import { Inline } from "@/components/shared/primitives/Inline";
import { Box } from "@/components/shared/primitives/Box";

type EditorTabProps = {
  label: string;
  active?: boolean;
  dirty?: boolean; // New prop for unsaved state
  onSelect?: () => void;
  onClose?: () => void;
};

export function EditorTab({
  label,
  active,
  dirty,
  onSelect,
  onClose,
}: EditorTabProps) {
  return (
    <Inline
      gap={8}
      align="center"
      onClick={onSelect}
      // Added 'group' so we can target children on hover
      className={`group relative px-3 py-1 text-sm cursor-pointer border-r transition-colors h-full ${
        active
          ? "bg-background font-medium"
          : "bg-muted/30 hover:bg-muted/50 text-muted-foreground"
      }`}
      shrink
    >
      <Box className={dirty ? "italic" : ""}>{label}</Box>

      {onClose && (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="relative w-3 h-3 flex items-center justify-center"
        >
          {/* LOGIC: 
             If dirty: show dot, hide on hover. 
             Always show X on hover.
          */}
          {dirty && (
            <span className="absolute w-2 h-2 bg-blue-500 rounded-full group-hover:opacity-0 transition-opacity" />
          )}

          <span
            className={`text-[10px] transition-opacity ${dirty ? "opacity-0 group-hover:opacity-100" : "opacity-40 group-hover:opacity-100"}`}
          >
            ✕
          </span>
        </Box>
      )}

      {/* VS Code Style Active Accent */}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
      )}
    </Inline>
  );
}
