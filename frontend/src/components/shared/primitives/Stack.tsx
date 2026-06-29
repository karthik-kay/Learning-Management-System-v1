import { BasePrimitiveProps, Space, Align, Justify } from "@/types/primitive";

interface StackProps extends BasePrimitiveProps {
  gap?: Space;
  align?: Align;
  justify?: Justify;
}

// Stack — vertical flex column
// responsiveness: override direction at breakpoints via className
// example: <Stack className="flex-col md:flex-row gap-4 md:gap-8">
// for responsive gaps — use className gap utilities, ignore gap prop
// example: <Stack className="gap-4 md:gap-8"> instead of gap={16}
export function Stack({
  children,
  className,
  gap = 16,
  align = "stretch",
  justify = "start",
  grow,
  shrink,
  scroll,
  ...rest
}: StackProps) {
  const alignMap: Record<Align, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  };
  const justifyMap: Record<Justify, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };

  return (
    <div
      {...rest}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
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
