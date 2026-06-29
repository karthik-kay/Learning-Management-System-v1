import { FileTreeItem } from "./FileTreeItem";

type FileTreeFileProps = {
  name: string;
  depth?: number;
  active?: boolean;
  selected?: boolean;
  onDoubleClick?: () => void;
  onOpen?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
};

export function FileTreeFile({
  name,
  depth,
  active,
  selected,
  onOpen,
  onDoubleClick,
  onContextMenu,
}: FileTreeFileProps) {
  return (
    <FileTreeItem
      name={name}
      depth={depth}
      icon="📄"
      active={active}
      selected={selected}
      onClick={onOpen}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    />
  );
}
