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
import { useCreateInstitutionAssignment } from "@/hooks/mutations/institution";
import type { EvaluationComponent } from "@/types/institution";

interface AddAssignmentDialogProps {
  open: boolean;
  components: EvaluationComponent[];
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  component: "",
  title: "",
  description: "",
  due_date: "",
};

export function AddAssignmentDialog({
  open,
  components,
  onOpenChange,
}: AddAssignmentDialogProps) {
  const [form, setForm] = useState(initialForm);
  const createAssignment = useCreateInstitutionAssignment();

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createAssignment.mutate(
      {
        component: Number(form.component),
        title: form.title,
        description: form.description,
        due_date: form.due_date,
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
          <DialogTitle>Add assignment</DialogTitle>
          <DialogDescription>
            Attach an assignment to an existing evaluation component.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Component">
            <Select value={form.component} onValueChange={(value) => update("component", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select component" />
              </SelectTrigger>
              <SelectContent>
                {components.map((component) => (
                  <SelectItem key={component.id} value={String(component.id)}>
                    {component.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Title">
            <Input
              required
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </Field>
          <Field label="Due date">
            <Input
              required
              type="datetime-local"
              value={form.due_date}
              onChange={(event) => update("due_date", event.target.value)}
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAssignment.isPending || !form.component || !form.title || !form.due_date}
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {createAssignment.isPending ? "Creating..." : "Create assignment"}
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
