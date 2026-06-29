"use client";

import { MoreHorizontal, UserCheck, UserRoundCheck, UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InstitutionStudent } from "@/types/institution";

interface StudentRowActionsProps {
  student: InstitutionStudent;
  onView: (student: InstitutionStudent) => void;
  onSuspend: (student: InstitutionStudent) => void;
  onPromote: (student: InstitutionStudent) => void;
}

export function StudentRowActions({
  student,
  onView,
  onSuspend,
  onPromote,
}: StudentRowActionsProps) {
  const isSuspended = student.status === "suspended";
  const isGraduated = student.status === "graduated";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
        <DropdownMenuLabel>Student actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(student)}>
          <UserCheck className="size-4" />
          View profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isSuspended || isGraduated}
          variant="destructive"
          onClick={() => onSuspend(student)}
        >
          <UserX className="size-4" />
          Suspend student
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isGraduated} onClick={() => onPromote(student)}>
          <UserRoundCheck className="size-4" />
          Promote / graduate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

