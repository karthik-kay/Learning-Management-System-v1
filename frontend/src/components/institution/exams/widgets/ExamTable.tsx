"use client";

import { ChevronRight, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Exam } from "@/types/institution";

interface ExamTableProps {
  exams: Exam[];
  isLoading?: boolean;
  onSelect: (exam: Exam) => void;
  onPublish: (exam: Exam) => void;
}

export function ExamTable({ exams, isLoading, onSelect, onPublish }: ExamTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="px-4">Exam</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 7 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-slate-100" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : exams.length ? (
            exams.map((exam) => (
              <TableRow
                key={exam.id}
                className="cursor-pointer"
                onClick={() => onSelect(exam)}
              >
                <TableCell className="px-4 py-4">
                  <p className="font-semibold text-[#0F172A]">{exam.name}</p>
                  <p className="text-xs text-slate-500">#{exam.id}</p>
                </TableCell>
                <TableCell>{exam.batch_name || exam.batch}</TableCell>
                <TableCell className="capitalize">{exam.exam_type}</TableCell>
                <TableCell>{exam.start_date}</TableCell>
                <TableCell>{exam.end_date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full">
                    {exam.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={exam.is_published}
                      onClick={(event) => {
                        event.stopPropagation();
                        onPublish(exam);
                      }}
                    >
                      <Send className="size-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                      <ChevronRight className="size-4 text-slate-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center text-slate-500">
                No exams found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
