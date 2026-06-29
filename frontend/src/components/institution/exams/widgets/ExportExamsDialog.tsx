"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInstitutionExport } from "@/hooks/mutations/institution";
import type { InstitutionExportJob } from "@/types/institution";

interface ExportExamsDialogProps {
  open: boolean;
  filters: Record<string, unknown>;
  onOpenChange: (open: boolean) => void;
}

export function ExportExamsDialog({
  open,
  filters,
  onOpenChange,
}: ExportExamsDialogProps) {
  const [format, setFormat] =
    useState<InstitutionExportJob["export_format"]>("csv");
  const [job, setJob] = useState<InstitutionExportJob | null>(null);
  const createExport = useCreateInstitutionExport();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createExport.mutate(
      { report_type: "exams", export_format: format, filters },
      { onSuccess: setJob },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export exams</DialogTitle>
          <DialogDescription>Queue an async export for this exam view.</DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Select value={format} onValueChange={(value) => setFormat(value as typeof format)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="xlsx">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
          {job ? (
            <div className="rounded-xl bg-[#FFF0E8] p-4 text-sm text-[#E86C0D]">
              Export job queued. Status: {job.status}.
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit" disabled={createExport.isPending} className="bg-[#0F172A]">
              {createExport.isPending ? "Queueing..." : "Queue export"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
