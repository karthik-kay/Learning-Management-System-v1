"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Box } from "@/components/shared/primitives";

export interface Column<T> {
  key: keyof T;

  label: string;

  render?: (
    value: T[keyof T],

    row: T,
  ) => React.ReactNode;
}

interface Props<T> {
  data: T[];

  columns: Column<T>[];
}

export default function DataTable<T>({ data, columns }: Props<T>) {
  return (
    <Box className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => {
                const value = row[column.key];

                return (
                  <TableCell key={String(column.key)}>
                    {column.render ? column.render(value, row) : String(value)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
