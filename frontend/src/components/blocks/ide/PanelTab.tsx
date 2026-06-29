import { Box } from "@/components/shared/primitives/Box";

type PanelTabProps = {
  label: string;
  active?: boolean;
  onSelect?: () => void;
};

export function PanelTab({ label, active, onSelect }: PanelTabProps) {
  return (
    <Box
      onClick={onSelect}
      className={`cursor-pointer px-2 py-1 text-sm ${
        active ? "border-b-2 font-medium" : "opacity-70"
      }`}
    >
      {label}
    </Box>
  );
}
