import { Box } from "@/components/shared/primitives/Box";

type PanelActionProps = {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
};

export function PanelAction({ children, onClick, title }: PanelActionProps) {
  return (
    <Box
      role="button"
      tabIndex={0}
      title={title}
      onClick={onClick}
      className="cursor-pointer rounded px-1 py-0.5 hover:bg-muted"
    >
      {children}
    </Box>
  );
}
