"use client";

import { FormEvent, useMemo, useState } from "react";

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
import { useCreateInstitutionStudent } from "@/hooks/mutations/institution";
import type { AcademicBatch, Department, Program, Section } from "@/types/institution";

interface AddStudentDialogProps {
  open: boolean;
  departments: Department[];
  programs: Program[];
  batches: AcademicBatch[];
  sections: Section[];
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  enrollment_number: "",
  department: "",
  program: "",
  batch: "",
  section: "",
  admission_date: "",
};

export function AddStudentDialog({
  open,
  departments,
  programs,
  batches,
  sections,
  onOpenChange,
}: AddStudentDialogProps) {
  const [form, setForm] = useState(initialForm);
  const createStudent = useCreateInstitutionStudent();

  const filteredPrograms = useMemo(
    () =>
      form.department
        ? programs.filter((program) =>
            departments.find((department) => String(department.id) === form.department)
              ?.name === program.department_name,
          )
        : programs,
    [departments, form.department, programs],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createStudent.mutate(
      {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        enrollment_number: form.enrollment_number,
        department: Number(form.department),
        program: Number(form.program),
        batch: Number(form.batch),
        section: form.section ? Number(form.section) : null,
        admission_date: form.admission_date,
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          onOpenChange(false);
        },
      },
    );
  };

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add student</DialogTitle>
          <DialogDescription>
            Create a student account and place them into the academic structure.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <Input
                required
                value={form.first_name}
                onChange={(event) => update("first_name", event.target.value)}
              />
            </Field>
            <Field label="Last name">
              <Input
                required
                value={form.last_name}
                onChange={(event) => update("last_name", event.target.value)}
              />
            </Field>
            <Field label="Email">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
              />
            </Field>
            <Field label="Student ID">
              <Input
                required
                value={form.enrollment_number}
                onChange={(event) =>
                  update("enrollment_number", event.target.value)
                }
              />
            </Field>
            <Field label="Department">
              <Select
                value={form.department}
                onValueChange={(value) => update("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={String(department.id)}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Program">
              <Select
                value={form.program}
                onValueChange={(value) => update("program", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPrograms.map((program) => (
                    <SelectItem key={program.id} value={String(program.id)}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Batch">
              <Select
                value={form.batch}
                onValueChange={(value) => update("batch", value)}
              >
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
              <Select
                value={form.section}
                onValueChange={(value) => update("section", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={String(section.id)}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Admission date">
              <Input
                required
                type="date"
                value={form.admission_date}
                onChange={(event) => update("admission_date", event.target.value)}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createStudent.isPending ||
                !form.department ||
                !form.program ||
                !form.batch ||
                !form.admission_date
              }
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {createStudent.isPending ? "Creating..." : "Create student"}
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
