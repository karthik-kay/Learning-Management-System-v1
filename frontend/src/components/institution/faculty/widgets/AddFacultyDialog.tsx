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
import { useCreateInstitutionFaculty } from "@/hooks/mutations/institution";
import type { Department } from "@/types/institution";

interface AddFacultyDialogProps {
  open: boolean;
  departments: Department[];
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  employee_id: "",
  designation: "",
  department: "",
  joining_date: "",
};

export function AddFacultyDialog({
  open,
  departments,
  onOpenChange,
}: AddFacultyDialogProps) {
  const [form, setForm] = useState(initialForm);
  const createFaculty = useCreateInstitutionFaculty();

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createFaculty.mutate(
      {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        employee_id: form.employee_id,
        designation: form.designation,
        department: Number(form.department),
        joining_date: form.joining_date,
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
          <DialogTitle>Add faculty</DialogTitle>
          <DialogDescription>
            Create a faculty account and attach it to an institution department.
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
            <Field label="Employee ID">
              <Input
                required
                value={form.employee_id}
                onChange={(event) => update("employee_id", event.target.value)}
              />
            </Field>
            <Field label="Designation">
              <Input
                required
                value={form.designation}
                onChange={(event) => update("designation", event.target.value)}
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
            <Field label="Joining date">
              <Input
                required
                type="date"
                value={form.joining_date}
                onChange={(event) => update("joining_date", event.target.value)}
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
                createFaculty.isPending ||
                !form.department ||
                !form.designation ||
                !form.joining_date
              }
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {createFaculty.isPending ? "Creating..." : "Create faculty"}
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
