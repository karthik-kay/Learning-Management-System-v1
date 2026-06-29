"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBulkImportInstitutionStudents } from "@/hooks/mutations/institution";

interface BulkImportStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkImportStudentsDialog({
  open,
  onOpenChange,
}: BulkImportStudentsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [createdCount, setCreatedCount] = useState<number | null>(null);
  const importStudents = useBulkImportInstitutionStudents();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setCreatedCount(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    importStudents.mutate(file, {
      onSuccess: (result) => {
        setCreatedCount(result.created?.length ?? 0);
        setFile(null);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk import students</DialogTitle>
          <DialogDescription>
            Upload a CSV/XLSX file matching the backend import template.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <Label htmlFor="student-import-file">Student import file</Label>
            <Input
              id="student-import-file"
              type="file"
              accept=".csv,.xlsx,.xls"
              className="mt-3 bg-white"
              onChange={handleFileChange}
            />
            <p className="mt-3 text-sm text-slate-500">
              Keep department, program, batch, and section identifiers consistent
              with the institution setup.
            </p>
          </div>

          {createdCount !== null ? (
            <div className="rounded-xl bg-[#E7F6F5] p-3 text-sm font-medium text-[#22577A]">
              Import completed. Created {createdCount} student record
              {createdCount === 1 ? "" : "s"}.
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              type="submit"
              disabled={!file || importStudents.isPending}
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {importStudents.isPending ? "Importing..." : "Import students"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
