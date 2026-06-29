import { Inline } from "@/components/shared/primitives/Inline";

export function EditorTabBar({ children }: { children: React.ReactNode }) {
  return (
    <Inline gap={0} justify="start" shrink className="border-b">
      {children}
    </Inline>
  );
}
