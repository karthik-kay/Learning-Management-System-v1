type Props = {
  name: string;
  depth?: number;
  icon?: React.ReactNode;
  active?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
};

export function FileTreeItem({
  name,
  depth = 0,
  icon,
  active,
  selected,
  onClick,
  onDoubleClick,
  onContextMenu,
}: Props) {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer
        ${active ? "bg-muted" : ""}
        ${selected && !active ? "bg-muted/50" : ""}
      `}
      style={{ paddingLeft: 8 + depth * 14 }}
    >
      {icon && <span className="w-4">{icon}</span>}
      <span>{name}</span>
    </div>
  );
}
