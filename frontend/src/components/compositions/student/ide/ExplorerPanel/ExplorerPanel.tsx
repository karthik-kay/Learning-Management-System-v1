"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Stack } from "@/components/shared/primitives/Stack";
import { Box } from "@/components/shared/primitives/Box";
import { Divider } from "@/components/shared/primitives/Divider";
import { PanelHeader } from "@/components/blocks/ide/PanelHeader";
import { PanelAction } from "@/components/blocks/ide/PanelAction";

import { FileTreeFolder } from "@/components/blocks/ide/FileTreeFolder";
import { FileTreeFile } from "@/components/blocks/ide/FileTreeFile";

import { RootState, AppDispatch } from "@/redux/store";
import {
  openFileThunk,
  createItemThunk,
  renameItemThunk,
  deleteItemThunk,
} from "@/redux/thunks/ideThunks";
import { clearActiveFile } from "@/redux/slices/ideSlice";

/* ---------- Sub-Component: Inline Input ---------- */

function InlineInput({
  depth,
  icon,
  initialValue = "",
  placeholder,
  onConfirm,
  onCancel,
}: {
  depth: number;
  icon: string;
  initialValue?: string;
  placeholder?: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div
      className="flex items-center gap-1 px-2 py-1"
      style={{ paddingLeft: depth * 16 }}
    >
      <span className="text-xs opacity-70">{icon}</span>
      <input
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) onConfirm(value.trim());
          if (e.key === "Escape") onCancel();
        }}
        onBlur={() => {
          // Small timeout to allow Enter key to process before blur cancels
          setTimeout(() => onCancel(), 100);
        }}
        className="bg-transparent outline-none border-b border-blue-500 w-full text-sm"
      />
    </div>
  );
}

/* ---------- Main Explorer ---------- */

export function ExplorerPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { tree, activeFile, workspaceId } = useSelector(
    (s: RootState) => s.ide,
  );

  // UI State
  const [openFolders, setOpenFolders] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<{
    id: number;
    type: "file" | "folder";
  } | null>(null);
  const [createCtx, setCreateCtx] = useState<{
    parentId: number | null;
    type: "file" | "folder";
  } | null>(null);
  const [renameId, setRenameId] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: { id: number; type: "file" | "folder" } | null;
  } | null>(null);

  /* ---------- Handlers ---------- */

  const toggleFolder = (id: number) => {
    setOpenFolders((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleCreate = async (name: string) => {
    if (!workspaceId || !createCtx) return;
    await dispatch(
      createItemThunk({
        workspace: workspaceId,
        name,
        type: createCtx.type,
        parent: createCtx.parentId,
        content: createCtx.type === "file" ? "" : undefined,
      }),
    );
    setCreateCtx(null);
  };

  const handleDelete = async () => {
    const target = contextMenu?.node || selected;
    if (!target) return;

    const ok = window.confirm(`Delete this ${target.type}?`);
    if (!ok) return;

    await dispatch(deleteItemThunk(target.id));
    setSelected(null);
    setContextMenu(null);
  };

  // Global click to close menu
  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  /* ---------- Recursive Render ---------- */

  const renderNode = (node: any, depth = 0): React.ReactNode => {
    const isFolder = node.type === "folder";
    const isOpen = openFolders.has(node.id);
    const isSelected = selected?.id === node.id;

    if (renameId === node.id) {
      return (
        <InlineInput
          key={`rename-${node.id}`}
          depth={depth}
          icon={isFolder ? "📁" : "📄"}
          initialValue={node.name}
          onConfirm={(name) => {
            dispatch(renameItemThunk(node.id, name));
            setRenameId(null);
          }}
          onCancel={() => setRenameId(null)}
        />
      );
    }

    return (
      <div key={node.id}>
        {isFolder ? (
          <FileTreeFolder
            name={node.name}
            depth={depth}
            open={isOpen}
            selected={isSelected}
            onSelect={() => {
              setSelected({ id: node.id, type: "folder" });
              dispatch(clearActiveFile());
            }}
            onToggle={() => toggleFolder(node.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Critical: prevent box context menu
              setContextMenu({
                x: e.clientX,
                y: e.clientY,
                node: { id: node.id, type: "folder" },
              });
              setSelected({ id: node.id, type: "folder" });
            }}
            onDoubleClick={() => setRenameId(node.id)}
          />
        ) : (
          <FileTreeFile
            name={node.name}
            depth={depth}
            active={node.id === activeFile}
            selected={isSelected}
            onOpen={() => {
              setSelected({ id: node.id, type: "file" });
              dispatch(openFileThunk(node.id));
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Critical: prevent box context menu
              setContextMenu({
                x: e.clientX,
                y: e.clientY,
                node: { id: node.id, type: "file" },
              });
              setSelected({ id: node.id, type: "file" });
            }}
            onDoubleClick={() => setRenameId(node.id)}
          />
        )}

        {/* Render Children + New Item Input inside folder */}
        {isFolder && isOpen && (
          <div className="flex flex-col">
            {createCtx?.parentId === node.id && (
              <InlineInput
                depth={depth + 1}
                icon={createCtx.type === "folder" ? "📁" : "📄"}
                placeholder={
                  createCtx.type === "folder" ? "New Folder" : "New File"
                }
                onConfirm={handleCreate}
                onCancel={() => setCreateCtx(null)}
              />
            )}
            {node.children?.map((child: any) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Stack grow className="h-full border-r bg-background select-none">
      <PanelHeader
        title="Explorer"
        actions={
          <div className="flex gap-1">
            <PanelAction
              title="New File"
              onClick={() =>
                setCreateCtx({
                  parentId: selected?.type === "folder" ? selected.id : null,
                  type: "file",
                })
              }
            >
              ＋📄
            </PanelAction>
            <PanelAction
              title="New Folder"
              onClick={() =>
                setCreateCtx({
                  parentId: selected?.type === "folder" ? selected.id : null,
                  type: "folder",
                })
              }
            >
              ＋📁
            </PanelAction>
          </div>
        }
      />
      <Divider />
      <Box
        grow
        scroll="y"
        className="p-1"
        onContextMenu={(e) => {
          e.preventDefault();
          setSelected(null);
          setContextMenu({ x: e.clientX, y: e.clientY, node: null });
        }}
      >
        {/* Root Level Creation Input */}
        {createCtx?.parentId === null && (
          <InlineInput
            depth={0}
            icon={createCtx.type === "folder" ? "📁" : "📄"}
            onConfirm={handleCreate}
            onCancel={() => setCreateCtx(null)}
          />
        )}

        {tree.map((n: any) => renderNode(n))}
      </Box>
      {/* Floating Context Menu */}

      {contextMenu && (
        <div
          className="fixed z-50 min-w-40 bg-popover border rounded shadow-xl py-1 text-sm text-popover-foreground"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          // Prevent the window click listener from seeing this specific interaction
          onMouseDown={(e) => e.stopPropagation()}
        >
          {!contextMenu.node ? (
            <>
              <ContextMenuItem
                label="New File"
                onAction={() => {
                  setCreateCtx({ parentId: null, type: "file" });
                  setContextMenu(null);
                }}
              />
              <ContextMenuItem
                label="New Folder"
                onAction={() => {
                  setCreateCtx({ parentId: null, type: "folder" });
                  setContextMenu(null);
                }}
              />
            </>
          ) : (
            <>
              {contextMenu.node.type === "folder" && (
                <>
                  <ContextMenuItem
                    label="New File"
                    onAction={() => {
                      setOpenFolders((s) =>
                        new Set(s).add(contextMenu.node!.id),
                      );
                      setCreateCtx({
                        parentId: contextMenu.node!.id,
                        type: "file",
                      });
                      setContextMenu(null);
                    }}
                  />
                  <ContextMenuItem
                    label="New Folder"
                    onAction={() => {
                      setOpenFolders((s) =>
                        new Set(s).add(contextMenu.node!.id),
                      );
                      setCreateCtx({
                        parentId: contextMenu.node!.id,
                        type: "folder",
                      });
                      setContextMenu(null);
                    }}
                  />
                  <div className="h-px bg-muted my-1" />
                </>
              )}
              <ContextMenuItem
                label="Rename"
                onAction={() => {
                  setRenameId(contextMenu.node!.id);
                  setContextMenu(null);
                }}
              />
              <ContextMenuItem
                label="Delete"
                color="text-red-500"
                onAction={handleDelete}
              />
            </>
          )}
        </div>
      )}
    </Stack>
  );
}

function ContextMenuItem({
  label,
  onAction,
  color = "",
}: {
  label: string;
  onAction: () => void;
  color?: string;
}) {
  return (
    <button
      className={`block w-full px-4 py-1.5 hover:bg-accent hover:text-accent-foreground text-left ${color}`}
      // Triggering on MouseDown beats the global "window.click" closer
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAction();
      }}
    >
      {label}
    </button>
  );
}
