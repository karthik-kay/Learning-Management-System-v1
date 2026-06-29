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

interface ExportFacultyDialogProps {
  open: boolean;
  filters: Record<string, unknown>;
  onOpenChange: (open: boolean) => void;
}

export function ExportFacultyDialog({
  open,
  filters,
  onOpenChange,
}: ExportFacultyDialogProps) {
  const [format, setFormat] =
    useState<InstitutionExportJob["export_format"]>("csv");
  const [job, setJob] = useState<InstitutionExportJob | null>(null);
  const createExport = useCreateInstitutionExport();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createExport.mutate(
      {
        report_type: "faculty",
        export_format: format,
        filters,
      },
      {
        onSuccess: (result) => setJob(result),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export faculty</DialogTitle>
          <DialogDescription>
            Create an async export job using the current faculty filters.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Select value={format} onValueChange={(value) => setFormat(value as typeof format)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="xlsx">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>

          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-[#0F172A]">Filters included</p>
            <p className="mt-1 break-words">
              {Object.keys(filters).length ? JSON.stringify(filters) : "All faculty"}
            </p>
          </div>

          {job ? (
            <div className="rounded-xl bg-[#FFF0E8] p-4 text-sm text-[#E86C0D]">
              Export job queued. Status: {job.status}. Collect it from exports
              when ready.
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
              disabled={createExport.isPending}
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {createExport.isPending ? "Queueing..." : "Queue export"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
