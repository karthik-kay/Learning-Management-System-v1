"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Stack } from "@/components/shared/primitives/Stack";
import { Inline } from "@/components/shared/primitives/Inline";
import { PreviewWindow } from "./PreviewWindow";
import ReactMarkdown from "react-markdown";

export function AuxiliaryPanel() {
  const [activeTab, setActiveTab] = useState<"instructions" | "preview">(
    "instructions",
  );
  const { files, tree } = useSelector((state: RootState) => state.ide);

  // Find instructions.md in the tree to display in the Markdown view
  const getInstructions = () => {
    const findFile = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.name.toLowerCase() === "instructions.md") return node;
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    const fileNode = findFile(tree);
    return fileNode
      ? files[fileNode.id]
      : "# Task\nNo `instructions.md` found in this workspace.";
  };

  return (
    <Stack grow className="h-full bg-background border-l">
      <Inline gap={0} className="border-b bg-muted/30">
        <button
          onClick={() => setActiveTab("instructions")}
          className={`px-4 py-2 text-xs font-bold uppercase transition-colors ${
            activeTab === "instructions"
              ? "border-b-2 border-blue-500 text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Instructions
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 text-xs font-bold uppercase transition-colors ${
            activeTab === "preview"
              ? "border-b-2 border-blue-500 text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Live Preview
        </button>
      </Inline>

      <Stack grow scroll="y" className="p-0">
        {activeTab === "instructions" ? (
          <div className="p-4 prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{getInstructions()}</ReactMarkdown>
          </div>
        ) : (
          <PreviewWindow />
        )}
      </Stack>
    </Stack>
  );
}
