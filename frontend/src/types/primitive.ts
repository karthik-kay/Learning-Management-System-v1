import { ReactNode, HTMLAttributes } from "react";

export interface BasePrimitiveProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string; // decoration only

  /** layout intent */
  grow?: boolean;
  shrink?: boolean;
  scroll?: "x" | "y" | "both";
}

export type Space = number | string;

export type Align = "start" | "center" | "end" | "stretch";

export type Justify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export type Direction = "row" | "column";
