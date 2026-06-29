import { Box } from "@/components/shared/primitives";

interface Props {
  group: {
    id: number;
    name: string;
  };
  active?: boolean;
  onClick?: () => void;
}

export function GroupListItem({ group, active, onClick }: Props) {
  return (
    <Box
      onClick={onClick}
      style={{
        padding: 10,
        cursor: "pointer",
        background: active ? "#f0f4ff" : "transparent",
        borderRadius: 8,
      }}
    >
      {group.name}
    </Box>
  );
}
