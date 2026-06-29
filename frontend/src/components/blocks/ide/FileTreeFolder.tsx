import { FileTreeItem } from "./FileTreeItem";

type FileTreeFolderProps = {
  name: string;
  depth?: number;
  open?: boolean;
  selected?: boolean;
  onDoubleClick?: () => void;
  onSelect?: () => void;
  onToggle?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
};

export function FileTreeFolder({
  name,
  depth,
  open,
  selected,
  onSelect,
  onToggle,
  onDoubleClick,
  onContextMenu,
}: FileTreeFolderProps) {
  return (
    <div className="relative">
      <FileTreeItem
        name={name}
        depth={depth}
        icon={open ? "📂" : "📁"}
        selected={selected}
        onClick={onSelect}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
      />

      {/* click target JUST for expand/collapse */}
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.();
        }}
      />
    </div>
  );
}
