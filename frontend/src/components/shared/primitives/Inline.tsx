import { BasePrimitiveProps, Justify, Space, Align } from "@/types/primitive";

interface InlineProps extends BasePrimitiveProps {
  justify?: Justify;
  align?: Align;
  gap?: Space;
  wrap?: boolean; // NEW — allow wrapping on small screens
  // example: <Inline wrap> wraps to next line on mobile
  // use with className="flex-col sm:flex-row" for full stack→row
}

// Inline — horizontal flex row
// responsiveness:
//   wrap prop    → allows items to wrap naturally
//   className    → override direction, gap, alignment at breakpoints
// example: <Inline className="flex-col md:flex-row gap-4 md:gap-8">
// example: <Inline wrap className="gap-3"> — wraps chips/tags on mobile
export function Inline({
  children,
  className,
  justify = "between",
  align = "center",
  gap = 16,
  wrap = false,
  grow,
  shrink,
  scroll,
  ...rest
}: InlineProps) {
  const justifyMap: Record<Justify, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };

  const alignMap: Record<Align, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  };

  return (
    <div
      {...rest}
      className={className}
      style={{
        display: "flex",
        flexWrap: wrap ? "wrap" : "nowrap",
        gap,
        justifyContent: justifyMap[justify],
        alignItems: alignMap[align],
        flexGrow: grow ? 1 : undefined,
        flexShrink: shrink ? 0 : undefined,
        overflow: scroll === "both" ? "auto" : undefined,
        overflowX: scroll === "x" ? "auto" : undefined,
        overflowY: scroll === "y" ? "auto" : undefined,
      }}
    >
      {children}
    </div>
  );
}
