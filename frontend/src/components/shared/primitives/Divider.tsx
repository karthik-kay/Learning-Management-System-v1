import { BasePrimitiveProps } from "@/types/primitive";

interface DividerProps extends BasePrimitiveProps {
  color?: string;
  thickness?: number;
  orientation?: "horizontal" | "vertical";
}

// Divider — thin separator line
// horizontal (default): full width, 1px height
// vertical: 1px width, use inside Inline for column separators
// example: <Divider> between sections
// example: <Divider orientation="vertical" className="h-8"> between stats
export function Divider({
  className,
  color = "rgba(0,0,0,0.1)",
  thickness = 1,
  orientation = "horizontal",
  ...rest
}: DividerProps) {
  return (
    <div
      {...rest}
      className={className}
      aria-hidden
      style={
        orientation === "horizontal"
          ? {
              width: "100%",
              height: thickness,
              backgroundColor: color,
              flexShrink: 0,
            }
          : {
              width: thickness,
              alignSelf: "stretch",
              backgroundColor: color,
              flexShrink: 0,
            }
      }
    />
  );
}
