"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addGoal } from "@/redux/slices/goalsSlice";

import { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function CreateGoalModal({ open, setOpen }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("study");
  const [goalType, setGoalType] = useState<"progress" | "habit">("progress");
  const [target, setTarget] = useState(1);
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async () => {
    await dispatch(
      addGoal({
        title,
        category,
        goal_type: goalType,
        target,
        deadline: deadline === "" ? null : deadline,
      })
    );

    setOpen(false);
    setTitle("");
    setTarget(1);
    setDeadline("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label>Title</Label>
            <Input
              placeholder="Goal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Goal Type</Label>
            <Select
              value={goalType}
              onValueChange={(v) => setGoalType(v as "progress" | "habit")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">Progress Goal</SelectItem>
                <SelectItem value="habit">Habit Goal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Target Value</Label>
            <Input
              type="number"
              min={1}
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value))}
            />
          </div>

          <div>
            <Label>Deadline</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button className="bg-secondary text-white" onClick={handleSubmit}>
            Create Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
