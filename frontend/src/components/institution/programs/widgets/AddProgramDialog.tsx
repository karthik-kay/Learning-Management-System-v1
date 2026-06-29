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
import { useCreateInstitutionProgram } from "@/hooks/mutations/institution";
import type { Degree, Department } from "@/types/institution";

interface AddProgramDialogProps {
  open: boolean;
  departments: Department[];
  degrees: Degree[];
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  name: "",
  code: "",
  department: "",
  degree: "",
  duration_semesters: "",
  intake_capacity: "",
};

export function AddProgramDialog({
  open,
  departments,
  degrees,
  onOpenChange,
}: AddProgramDialogProps) {
  const [form, setForm] = useState(initialForm);
  const createProgram = useCreateInstitutionProgram();

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createProgram.mutate(
      {
        name: form.name,
        code: form.code,
        department: Number(form.department),
        degree: Number(form.degree),
        duration_semesters: Number(form.duration_semesters),
        intake_capacity: form.intake_capacity
          ? Number(form.intake_capacity)
          : undefined,
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add program</DialogTitle>
          <DialogDescription>
            Create an academic program under a department and degree stream.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Program name">
              <Input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </Field>
            <Field label="Program code">
              <Input
                required
                value={form.code}
                onChange={(event) => update("code", event.target.value)}
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
            <Field label="Degree">
              <Select value={form.degree} onValueChange={(value) => update("degree", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  {degrees.map((degree) => (
                    <SelectItem key={degree.id} value={String(degree.id)}>
                      {degree.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Duration semesters">
              <Input
                required
                min={1}
                type="number"
                value={form.duration_semesters}
                onChange={(event) => update("duration_semesters", event.target.value)}
              />
            </Field>
            <Field label="Intake capacity">
              <Input
                min={0}
                type="number"
                value={form.intake_capacity}
                onChange={(event) => update("intake_capacity", event.target.value)}
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
                createProgram.isPending ||
                !form.name ||
                !form.code ||
                !form.department ||
                !form.degree ||
                !form.duration_semesters
              }
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {createProgram.isPending ? "Creating..." : "Create program"}
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
