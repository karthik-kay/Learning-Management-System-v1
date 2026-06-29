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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInstitutionExam } from "@/hooks/mutations/institution";
import type { AcademicBatch } from "@/types/institution";

interface AddExamDialogProps {
  open: boolean;
  batches: AcademicBatch[];
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  name: "",
  batch: "",
  exam_type: "midterm",
  start_date: "",
  end_date: "",
};

export function AddExamDialog({ open, batches, onOpenChange }: AddExamDialogProps) {
  const [form, setForm] = useState(initialForm);
  const createExam = useCreateInstitutionExam();

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createExam.mutate(
      {
        name: form.name,
        batch: Number(form.batch),
        exam_type: form.exam_type,
        start_date: form.start_date,
        end_date: form.end_date,
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add exam</DialogTitle>
          <DialogDescription>Create an exam window for a batch.</DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Exam name">
            <Input
              required
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </Field>
          <Field label="Batch">
            <Select value={form.batch} onValueChange={(value) => update("batch", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={String(batch.id)}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Exam type">
            <Select
              value={form.exam_type}
              onValueChange={(value) => update("exam_type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midterm">Midterm</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date">
              <Input
                required
                type="date"
                value={form.start_date}
                onChange={(event) => update("start_date", event.target.value)}
              />
            </Field>
            <Field label="End date">
              <Input
                required
                type="date"
                value={form.end_date}
                onChange={(event) => update("end_date", event.target.value)}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createExam.isPending ||
                !form.name ||
                !form.batch ||
                !form.start_date ||
                !form.end_date
              }
              className="bg-[#0F172A]"
            >
              {createExam.isPending ? "Creating..." : "Create exam"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
