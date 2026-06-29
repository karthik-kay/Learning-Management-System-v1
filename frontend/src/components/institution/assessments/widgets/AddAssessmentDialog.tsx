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
import { useCreateInstitutionEvaluationComponent } from "@/hooks/mutations/institution";
import type { AcademicBatch, Section, Subject } from "@/types/institution";

interface AddAssessmentDialogProps {
  open: boolean;
  subjects: Subject[];
  batches: AcademicBatch[];
  sections: Section[];
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  name: "",
  subject: "",
  batch: "",
  section: "none",
  semester: "",
  component_type: "quiz",
  max_marks: "",
  weightage: "",
  is_internal: "true",
};

export function AddAssessmentDialog({
  open,
  subjects,
  batches,
  sections,
  onOpenChange,
}: AddAssessmentDialogProps) {
  const [form, setForm] = useState(initialForm);
  const createComponent = useCreateInstitutionEvaluationComponent();

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createComponent.mutate(
      {
        name: form.name,
        subject: Number(form.subject),
        batch: Number(form.batch),
        section: form.section !== "none" ? Number(form.section) : null,
        semester: form.semester ? Number(form.semester) : null,
        component_type: form.component_type,
        max_marks: Number(form.max_marks),
        weightage: Number(form.weightage),
        is_internal: form.is_internal === "true",
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add assessment</DialogTitle>
          <DialogDescription>
            Create an evaluation component with marks and weightage.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Assessment name">
              <Input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </Field>
            <Field label="Type">
              <Select
                value={form.component_type}
                onValueChange={(value) => update("component_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Subject">
              <Select value={form.subject} onValueChange={(value) => update("subject", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={String(subject.id)}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Field label="Section">
              <Select value={form.section} onValueChange={(value) => update("section", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Optional section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={String(section.id)}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Semester">
              <Input
                min={1}
                type="number"
                value={form.semester}
                onChange={(event) => update("semester", event.target.value)}
              />
            </Field>
            <Field label="Max marks">
              <Input
                required
                min={1}
                type="number"
                value={form.max_marks}
                onChange={(event) => update("max_marks", event.target.value)}
              />
            </Field>
            <Field label="Weightage">
              <Input
                required
                min={0}
                type="number"
                value={form.weightage}
                onChange={(event) => update("weightage", event.target.value)}
              />
            </Field>
            <Field label="Mode">
              <Select
                value={form.is_internal}
                onValueChange={(value) => update("is_internal", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Internal</SelectItem>
                  <SelectItem value="false">External</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createComponent.isPending ||
                !form.name ||
                !form.subject ||
                !form.batch ||
                !form.max_marks ||
                !form.weightage
              }
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {createComponent.isPending ? "Creating..." : "Create assessment"}
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
