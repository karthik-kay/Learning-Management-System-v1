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
import { useMakeInstitutionHod } from "@/hooks/mutations/institution";
import type { Department, InstitutionFaculty } from "@/types/institution";

interface AssignHodDialogProps {
  open: boolean;
  faculty?: InstitutionFaculty | null;
  facultyList: InstitutionFaculty[];
  departments: Department[];
  onOpenChange: (open: boolean) => void;
}

export function AssignHodDialog({
  open,
  faculty,
  facultyList,
  departments,
  onOpenChange,
}: AssignHodDialogProps) {
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const makeHod = useMakeInstitutionHod();
  const selectedFacultyId = facultyId || (faculty ? String(faculty.id) : "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFacultyId || !departmentId) return;

    makeHod.mutate(
      {
        facultyId: Number(selectedFacultyId),
        departmentId: Number(departmentId),
      },
      {
        onSuccess: () => {
          setDepartmentId("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign HOD</DialogTitle>
          <DialogDescription>
            Make {faculty?.name ?? "this faculty member"} the HOD of a department.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Select value={selectedFacultyId} onValueChange={setFacultyId}>
            <SelectTrigger>
              <SelectValue placeholder="Select faculty" />
            </SelectTrigger>
            <SelectContent>
              {facultyList.map((member) => (
                <SelectItem key={member.id} value={String(member.id)}>
                  {member.name} · {member.employee_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={departmentId} onValueChange={setDepartmentId}>
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
              disabled={!selectedFacultyId || !departmentId || makeHod.isPending}
              className="bg-[#0F172A] hover:bg-[#22577A]"
            >
              {makeHod.isPending ? "Assigning..." : "Assign HOD"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
