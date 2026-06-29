import { BasePrimitiveProps } from "@/types/primitive";

// Box — generic block container
// responsiveness: pass Tailwind classes via className
// example: <Box className="p-4 md:p-8 lg:p-12">
export function Box({
  children,
  className,
  grow,
  shrink,
  scroll,
  ...rest
}: BasePrimitiveProps) {
  return (
    <div
      className={className}
      style={{
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
      {...rest}
    >
      {children}
    </div>
  );
}
