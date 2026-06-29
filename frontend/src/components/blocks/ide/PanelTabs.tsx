import { Inline } from "@/components/shared/primitives/Inline";

export function PanelTabs({ children }: { children: React.ReactNode }) {
  return (
    <Inline gap={8} shrink className="border-b px-2">
      {children}
    </Inline>
  );
}
