import Editor from "@monaco-editor/react";
import { SupportedLanguage } from "@/types/index";

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: SupportedLanguage;
}

export default function CodeEditor({
  code,
  setCode,
  language,
}: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={(v) => setCode(v || "")}
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  );
}
