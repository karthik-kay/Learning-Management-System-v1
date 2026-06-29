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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublishInstitutionResults } from "@/hooks/mutations/institution";
import type { Exam } from "@/types/institution";

interface PublishResultsDialogProps {
  open: boolean;
  exams: Exam[];
  onOpenChange: (open: boolean) => void;
}

export function PublishResultsDialog({
  open,
  exams,
  onOpenChange,
}: PublishResultsDialogProps) {
  const [examId, setExamId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const publishResults = usePublishInstitutionResults();
  const unpublishedExams = exams.filter((exam) => !exam.is_published);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!examId) {
      setMessage("Choose an exam to publish.");
      return;
    }

    publishResults.mutate(Number(examId), {
      onSuccess: () => {
        setMessage("Results published successfully.");
        setExamId("");
      },
      onError: (error) => setMessage(error.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish results</DialogTitle>
          <DialogDescription>
            Publishing makes the selected exam results visible to students.
            Verify all marks before continuing.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Unpublished exam</Label>
            <Select value={examId} onValueChange={setExamId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an exam" />
              </SelectTrigger>
              <SelectContent>
                {unpublishedExams.map((exam) => (
                  <SelectItem key={exam.id} value={String(exam.id)}>
                    {exam.name} · {exam.batch_name || `Batch #${exam.batch}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!unpublishedExams.length ? (
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              All available exams are already published.
            </div>
          ) : null}

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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={publishResults.isPending || !unpublishedExams.length}
              className="bg-[#E86C0D] hover:bg-[#C95708]"
            >
              {publishResults.isPending ? "Publishing..." : "Publish results"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
