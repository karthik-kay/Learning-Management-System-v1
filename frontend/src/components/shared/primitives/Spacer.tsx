import { Space } from "@/types/primitive";

interface SpacerProps {
  size?: Space; // single size — use for consistent spacing
  axis?: "vertical" | "horizontal";
  // NOTE: for responsive spacing between sections
  // don't use Spacer — use padding on the section itself
  // example: <section className="py-16 md:py-20 lg:py-24">
  // Spacer is for fixed micro-spacing inside components
  // example: <Spacer size={8}> between icon and label
}

// Spacer — fixed whitespace block
// for responsive vertical rhythm between page sections:
//   use py- classes on the section wrapper instead
// for fixed gaps inside components (icon→text, label→input):
//   Spacer is correct here
export function Spacer({ size = 16, axis = "vertical" }: SpacerProps) {
  return (
    <div
      aria-hidden
      style={
        axis === "vertical"
          ? { height: size, flexShrink: 0 }
          : { width: size, flexShrink: 0 }
      }
    />
  );
}
