import { Inline } from "@/components/shared/primitives/Inline";

export function StatusBarItem({ children }: { children: React.ReactNode }) {
  return (
    <Inline gap={4} className="px-2 text-xs opacity-80">
      {children}
    </Inline>
  );
}
