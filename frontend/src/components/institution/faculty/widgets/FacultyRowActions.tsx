"use client";

import {
  MoreHorizontal,
  ShieldCheck,
  UserCheck,
  UserMinus,
  UserRoundCheck,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InstitutionFaculty } from "@/types/institution";

interface FacultyRowActionsProps {
  faculty: InstitutionFaculty;
  onView: (faculty: InstitutionFaculty) => void;
  onSuspend: (faculty: InstitutionFaculty) => void;
  onReactivate: (faculty: InstitutionFaculty) => void;
  onOffboard: (faculty: InstitutionFaculty) => void;
  onMakeHod: (faculty: InstitutionFaculty) => void;
}

export function FacultyRowActions({
  faculty,
  onView,
  onSuspend,
  onReactivate,
  onOffboard,
  onMakeHod,
}: FacultyRowActionsProps) {
  const isInactive = faculty.status === "inactive";

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
        <DropdownMenuLabel>Faculty actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(faculty)}>
          <UserCheck className="size-4" />
          View profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMakeHod(faculty)}>
          <ShieldCheck className="size-4" />
          Assign as HOD
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={isInactive}
          variant="destructive"
          onClick={() => onSuspend(faculty)}
        >
          <UserX className="size-4" />
          Suspend
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!isInactive} onClick={() => onReactivate(faculty)}>
          <UserRoundCheck className="size-4" />
          Reactivate
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => onOffboard(faculty)}>
          <UserMinus className="size-4" />
          Offboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
