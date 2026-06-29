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
import {
  useCreateInstitutionBatch,
  useCreateInstitutionSection,
} from "@/hooks/mutations/institution";
import type {
  AcademicBatch,
  InstitutionFaculty,
  Program,
} from "@/types/institution";

interface AddStructureNodeDialogProps {
  open: boolean;
  kind: "batch" | "section";
  programs: Program[];
  batches: AcademicBatch[];
  faculty: InstitutionFaculty[];
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  name: "",
  parent: "",
  start_year: "",
  end_year: "",
  intake: "",
  semester: "1",
  status: "upcoming",
  teacher: "unassigned",
  capacity: "",
};

export function AddStructureNodeDialog({
  open,
  kind,
  programs,
  batches,
  faculty,
  onOpenChange,
}: AddStructureNodeDialogProps) {
  const [form, setForm] = useState(initialForm);
  const createBatch = useCreateInstitutionBatch();
  const createSection = useCreateInstitutionSection();
  const isBatch = kind === "batch";
  const pending = createBatch.isPending || createSection.isPending;

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const onSuccess = () => {
      setForm(initialForm);
      onOpenChange(false);
    };

    if (isBatch) {
      createBatch.mutate(
        {
          name: form.name,
          program: Number(form.parent),
          start_year: Number(form.start_year),
          end_year: Number(form.end_year),
          intake_size: form.intake ? Number(form.intake) : undefined,
          current_semester: Number(form.semester),
          status: form.status,
        },
        { onSuccess },
      );
      return;
    }

    createSection.mutate(
      {
        name: form.name,
        batch: Number(form.parent),
        class_teacher:
          form.teacher === "unassigned" ? null : Number(form.teacher),
        capacity: form.capacity ? Number(form.capacity) : undefined,
      },
      { onSuccess },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add {isBatch ? "batch" : "section"}</DialogTitle>
          <DialogDescription>
            {isBatch
              ? "Create a cohort under an academic program."
              : "Create a class section under an existing batch."}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={isBatch ? "Batch name" : "Section name"}>
              <Input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder={isBatch ? "2026 Batch" : "A"}
              />
            </Field>
            <Field label={isBatch ? "Program" : "Batch"}>
              <Select value={form.parent} onValueChange={(value) => update("parent", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${isBatch ? "program" : "batch"}`} />
                </SelectTrigger>
                <SelectContent>
                  {(isBatch ? programs : batches).map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {isBatch ? (
              <>
                <Field label="Start year">
                  <Input
                    required
                    type="number"
                    min="2000"
                    value={form.start_year}
                    onChange={(event) => update("start_year", event.target.value)}
                  />
                </Field>
                <Field label="End year">
                  <Input
                    required
                    type="number"
                    min="2000"
                    value={form.end_year}
                    onChange={(event) => update("end_year", event.target.value)}
                  />
                </Field>
                <Field label="Current semester">
                  <Input
                    required
                    type="number"
                    min="1"
                    value={form.semester}
                    onChange={(event) => update("semester", event.target.value)}
                  />
                </Field>
                <Field label="Intake size">
                  <Input
                    type="number"
                    min="1"
                    value={form.intake}
                    onChange={(event) => update("intake", event.target.value)}
                  />
                </Field>
                <Field label="Status">
                  <Select value={form.status} onValueChange={(value) => update("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </>
            ) : (
              <>
                <Field label="Class teacher">
                  <Select value={form.teacher} onValueChange={(value) => update("teacher", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {faculty.map((member) => (
                        <SelectItem key={member.id} value={String(member.id)}>
                          {member.name} · {member.department_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Capacity">
                  <Input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(event) => update("capacity", event.target.value)}
                  />
                </Field>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                pending ||
                !form.name ||
                !form.parent ||
                (isBatch && (!form.start_year || !form.end_year))
              }
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {pending ? "Creating..." : `Create ${isBatch ? "batch" : "section"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
