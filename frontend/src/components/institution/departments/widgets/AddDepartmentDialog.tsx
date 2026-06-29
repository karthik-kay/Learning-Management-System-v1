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
import { Textarea } from "@/components/ui/textarea";
import { useCreateInstitutionDepartment } from "@/hooks/mutations/institution";
import type { InstitutionFaculty } from "@/types/institution";

interface AddDepartmentDialogProps {
  open: boolean;
  faculty: InstitutionFaculty[];
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  name: "",
  code: "",
  description: "",
  hod: "none",
};

export function AddDepartmentDialog({
  open,
  faculty,
  onOpenChange,
}: AddDepartmentDialogProps) {
  const [form, setForm] = useState(initialForm);
  const createDepartment = useCreateInstitutionDepartment();

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createDepartment.mutate(
      {
        name: form.name,
        code: form.code,
        description: form.description,
        ...(form.hod !== "none" ? { hod: Number(form.hod) } : {}),
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
          <DialogTitle>Add department</DialogTitle>
          <DialogDescription>
            Create a department and optionally assign an HOD.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Department name">
              <Input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </Field>
            <Field label="Department code">
              <Input
                required
                value={form.code}
                onChange={(event) => update("code", event.target.value)}
              />
            </Field>
            <Field label="HOD">
              <Select value={form.hod} onValueChange={(value) => update("hod", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Optional HOD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No HOD yet</SelectItem>
                  {faculty.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.name} · {member.employee_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <Textarea
                  value={form.description}
                  onChange={(event) => update("description", event.target.value)}
                  placeholder="What does this department manage?"
                />
              </Field>
            </div>
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
              disabled={createDepartment.isPending || !form.name || !form.code}
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {createDepartment.isPending ? "Creating..." : "Create department"}
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
