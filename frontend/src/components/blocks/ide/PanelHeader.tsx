import { Inline } from "@/components/shared/primitives/Inline";
import { Box } from "@/components/shared/primitives/Box";

type PanelHeaderProps = {
  title: string;
  actions?: React.ReactNode;
};

export function PanelHeader({ title, actions }: PanelHeaderProps) {
  return (
    <Inline
      justify="between"
      align="center"
      className="border-b px-2 py-1 text-sm font-medium select-none"
      shrink
    >
      <Box>{title}</Box>
      {actions && <Inline gap={8}>{actions}</Inline>}
    </Inline>
  );
}
