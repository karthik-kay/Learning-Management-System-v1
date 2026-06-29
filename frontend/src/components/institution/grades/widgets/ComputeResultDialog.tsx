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
import { useComputeInstitutionSubjectResult } from "@/hooks/mutations/institution";
import type { InstitutionStudent, Subject } from "@/types/institution";

interface ComputeResultDialogProps {
  open: boolean;
  students: InstitutionStudent[];
  subjects: Subject[];
  onOpenChange: (open: boolean) => void;
}

export function ComputeResultDialog({
  open,
  students,
  subjects,
  onOpenChange,
}: ComputeResultDialogProps) {
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [internalMarks, setInternalMarks] = useState("");
  const [externalMarks, setExternalMarks] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const computeResult = useComputeInstitutionSubjectResult();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const internal = Number(internalMarks);
    const external = Number(externalMarks);
    if (
      !studentId ||
      !subjectId ||
      !Number.isFinite(internal) ||
      !Number.isFinite(external) ||
      internal < 0 ||
      external < 0
    ) {
      setMessage("Choose a student and subject, then enter valid marks.");
      return;
    }

    computeResult.mutate(
      {
        student: Number(studentId),
        subject: Number(subjectId),
        internal_marks: internal,
        external_marks: external,
      },
      {
        onSuccess: (result) => {
          setMessage(
            `Result computed: ${result.total_marks} marks, grade ${result.grade || "pending"}.`,
          );
          setInternalMarks("");
          setExternalMarks("");
        },
        onError: (error) => setMessage(error.message),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Compute subject result</DialogTitle>
          <DialogDescription>
            Combine internal and external marks and apply the institution grade
            scale.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={String(student.id)}>
                      {student.name} · {student.enrollment_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={String(subject.id)}>
                      {subject.code} · {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internal-marks">Internal marks</Label>
              <Input
                id="internal-marks"
                type="number"
                min="0"
                step="0.01"
                value={internalMarks}
                onChange={(event) => setInternalMarks(event.target.value)}
                placeholder="e.g. 38"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="external-marks">External marks</Label>
              <Input
                id="external-marks"
                type="number"
                min="0"
                step="0.01"
                value={externalMarks}
                onChange={(event) => setExternalMarks(event.target.value)}
                placeholder="e.g. 54"
              />
            </div>
          </div>

          {message ? (
            <div className="rounded-xl bg-[#FFF0E8] p-3 text-sm text-[#B94D00]">
              {message}
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
              disabled={computeResult.isPending}
              className="bg-[#0F172A]"
            >
              {computeResult.isPending ? "Computing..." : "Compute result"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
