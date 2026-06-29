import { useEffect } from "react";
import { Stack } from "@/components/shared/primitives/Stack";
import { EditorTabBar } from "@/components/blocks/ide/EditorTabBar";
import { EditorTab } from "@/components/blocks/ide/EditorTab";
import { CodeEditor } from "@/components/blocks/ide/CodeEditor";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  setActiveFile,
  closeFile,
  updateFileContent,
} from "@/redux/slices/ideSlice";
import { saveFileThunk } from "@/redux/thunks/ideThunks";
import { IDEFileNode } from "@/redux/slices/ideSlice";

function findNodeById(nodes: IDEFileNode[], id: number): IDEFileNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getLanguage(filename: string) {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "html":
      return "html";
    case "css":
      return "css";
    case "js":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    default:
      return "plaintext";
  }
}

export function EditorPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { openTabs, activeFile, files, originalContents, tree } = useSelector(
    (state: RootState) => state.ide,
  );

  const content = activeFile ? (files[activeFile] ?? "") : "";
  const fileNode = activeFile !== null ? findNodeById(tree, activeFile) : null;
  const language = fileNode ? getLanguage(fileNode.name) : "plaintext";

  // Handle Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (activeFile) dispatch(saveFileThunk(activeFile));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFile, dispatch]);

  return (
    <Stack grow className="h-full">
      <EditorTabBar>
        {openTabs.map((id) => {
          const node = findNodeById(tree, id);
          const isDirty = files[id] !== originalContents[id];

          return (
            <EditorTab
              key={id}
              label={node?.name ?? "Unknown"}
              active={id === activeFile}
              dirty={isDirty}
              onSelect={() => dispatch(setActiveFile(id))}
              onClose={() => dispatch(closeFile(id))}
            />
          );
        })}
      </EditorTabBar>

      <Stack grow>
        {activeFile ? (
          <CodeEditor
            key={activeFile} // Force refresh on file switch
            value={content}
            language={language}
            onChange={(val) =>
              dispatch(updateFileContent({ id: activeFile, content: val }))
            }
          />
        ) : (
          <Stack
            grow
            align="center"
            justify="center"
            className="text-muted-foreground"
          >
            No file open
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
