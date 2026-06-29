import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
};

export function CodeEditor({
  value,
  language = "typescript",
  onChange,
}: CodeEditorProps) {
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={value}
        onChange={(val) => onChange?.(val ?? "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}
