import { BasePrimitiveProps, Space, Align } from "@/types/primitive";

interface GridProps extends BasePrimitiveProps {
  gap?: Space;
  align?: Align;
  justify?: Align;
  // NOTE: columns prop removed intentionally
  // use Tailwind grid classes via className instead
  // why: inline style columns cant use breakpoint prefixes
  // correct: <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  // wrong:   <Grid columns="repeat(3, 1fr)"> — not responsive
}

// Grid — CSS grid container
// responsiveness: ALWAYS use className for column definitions
// example: <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" gap={24}>
// example: <Grid className="grid-cols-2 lg:grid-cols-4" gap={16}>
// gap prop is fine as single value — if you need responsive gaps use className:
// example: <Grid className="gap-4 md:gap-6 lg:gap-8"> — ignore gap prop
export function Grid({
  children,
  className,
  gap = 24,
  align = "stretch",
  justify = "stretch",
  grow,
  shrink,
  scroll,
  ...rest
}: GridProps) {
  const alignMap: Record<Align, string> = {
    start: "start",
    center: "center",
    end: "end",
    stretch: "stretch",
  };

  return (
    <div
      {...rest}
      className={`grid ${className ?? ""}`}
      style={{
        gap,
        alignItems: alignMap[align],
        justifyItems: alignMap[justify],
        flexGrow: grow ? 1 : undefined,
        flexShrink: shrink ? 0 : undefined,
        overflow:
          scroll === "both"
            ? "auto"
            : scroll === "x"
              ? "auto hidden"
              : scroll === "y"
                ? "hidden auto"
                : undefined,
      }}
    >
      {children}
    </div>
  );
}
