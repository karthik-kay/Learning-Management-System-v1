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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUploadInstitutionBulkScores } from "@/hooks/mutations/institution";
import type { EvaluationComponent } from "@/types/institution";

interface BulkScoreUploadDialogProps {
  open: boolean;
  components: EvaluationComponent[];
  onOpenChange: (open: boolean) => void;
}

export function BulkScoreUploadDialog({
  open,
  components,
  onOpenChange,
}: BulkScoreUploadDialogProps) {
  const [componentId, setComponentId] = useState("");
  const [rows, setRows] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const uploadScores = useUploadInstitutionBulkScores();

  const parsed = useMemo(() => parseScoreRows(rows), [rows]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!componentId || parsed.errors.length || !parsed.scores.length) {
      setMessage(
        parsed.errors[0] ||
          (!componentId
            ? "Choose an evaluation component."
            : "Add at least one score row."),
      );
      return;
    }

    uploadScores.mutate(
      { component: Number(componentId), scores: parsed.scores },
      {
        onSuccess: () => {
          setMessage(`${parsed.scores.length} score rows submitted successfully.`);
          setRows("");
        },
        onError: (error) => setMessage(error.message),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Bulk upload scores</DialogTitle>
          <DialogDescription>
            Paste one row per student using: student ID, marks, absent.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Evaluation component</Label>
            <Select value={componentId} onValueChange={setComponentId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a component" />
              </SelectTrigger>
              <SelectContent>
                {components.map((component) => (
                  <SelectItem key={component.id} value={String(component.id)}>
                    {component.name} · {component.subject_name} · max{" "}
                    {component.max_marks}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score-rows">Score rows</Label>
            <Textarea
              id="score-rows"
              value={rows}
              onChange={(event) => setRows(event.target.value)}
              rows={8}
              placeholder={"101, 42, false\n102, 38, false\n103, 0, true"}
              className="font-mono text-sm"
            />
            <p className="text-xs text-slate-500">
              The third value is optional. Use true to mark a student absent.
            </p>
          </div>

          {message ? (
            <div
              className={
                parsed.errors.length
                  ? "rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
                  : "rounded-xl bg-[#FFF0E8] p-3 text-sm text-[#B94D00]"
              }
            >
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
              disabled={uploadScores.isPending}
              className="bg-[#0F172A]"
            >
              {uploadScores.isPending
                ? "Uploading..."
                : `Upload ${parsed.scores.length || ""} scores`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function parseScoreRows(value: string) {
  const scores: Array<{
    student: number;
    marks_obtained: number;
    is_absent: boolean;
  }> = [];
  const errors: string[] = [];

  value
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean)
    .forEach((row, index) => {
      const [studentValue, marksValue, absentValue = "false"] = row
        .split(",")
        .map((cell) => cell.trim());
      const student = Number(studentValue);
      const marks = Number(marksValue);
      const absent = absentValue.toLowerCase() === "true";

      if (!Number.isInteger(student) || student <= 0 || !Number.isFinite(marks)) {
        errors.push(`Row ${index + 1} must contain a valid student ID and marks.`);
        return;
      }

      scores.push({
        student,
        marks_obtained: absent ? 0 : marks,
        is_absent: absent,
      });
    });

  return { scores, errors };
}
