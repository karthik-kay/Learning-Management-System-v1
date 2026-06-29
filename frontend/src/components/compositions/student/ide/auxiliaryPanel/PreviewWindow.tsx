"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Play, Eye } from "lucide-react";
import { IDEFileNode } from "@/redux/slices/ideSlice"; // Adjust path if needed

export function PreviewWindow() {
  // Use your actual state names: 'activeFile' and 'files'
  const { files, activeFile, tree } = useSelector(
    (state: RootState) => state.ide,
  );
  const [renderedUrl, setRenderedUrl] = useState("");

  const generatePreview = () => {
    let htmlContent = "";
    let cssContent = "";
    let jsContent = "";

    // 1. Recursive helper to find file names by ID in your tree
    const getFileNameById = (
      nodes: IDEFileNode[],
      targetId: number,
    ): string | null => {
      for (const node of nodes) {
        if (node.id === targetId) return node.name;
        if (node.children) {
          const found = getFileNameById(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    // 2. Logic: If the student is looking at an HTML file, use that.
    // Otherwise, find the first .html file available in the files record.
    const activeFileName = activeFile
      ? getFileNameById(tree, activeFile)
      : null;

    if (activeFile && activeFileName?.endsWith(".html")) {
      htmlContent = files[activeFile] || "";
    } else {
      // Fallback: Loop through all buffers to find the "main" HTML/CSS/JS
      Object.entries(files).forEach(([id, content]) => {
        const name = getFileNameById(tree, parseInt(id));
        if (name?.endsWith(".html") && !htmlContent) htmlContent = content;
        if (name?.endsWith(".css")) cssContent += `\n${content}`;
        if (name?.endsWith(".js")) jsContent += `\n${content}`;
      });
    }

    if (!htmlContent) {
      htmlContent =
        "<body><div style='font-family:sans-serif; padding:20px;'><h1>No HTML Preview Available</h1><p>Open or create an .html file to see it here.</p></div></body>";
    }

    const source = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>${cssContent}</style>
        </head>
        <body>
          ${htmlContent}
          <script>
            try {
              ${jsContent}
            } catch (err) {
              console.error("Runtime Error:", err);
            }
          <\/script>
        </body>
      </html>
    `;

    if (renderedUrl) URL.revokeObjectURL(renderedUrl);
    const blob = new Blob([source], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setRenderedUrl(url);
  };

  // Auto-update once when first loaded
  useEffect(() => {
    generatePreview();
    return () => {
      if (renderedUrl) URL.revokeObjectURL(renderedUrl);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Tab Header for Preview */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-white/10">
        <div className="flex items-center gap-2 text-zinc-400">
          <Eye size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Live Browser
          </span>
        </div>
        <button
          onClick={generatePreview}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold transition-all active:scale-95 shadow-lg"
        >
          <Play size={10} fill="currentColor" />
          RUN
        </button>
      </div>

      {/* The Actual Preview */}
      <div className="flex-grow bg-white">
        <iframe
          key={renderedUrl}
          src={renderedUrl}
          className="h-full w-full border-none shadow-inner"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
