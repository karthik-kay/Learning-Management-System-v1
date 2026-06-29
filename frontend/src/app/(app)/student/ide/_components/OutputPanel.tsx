interface OutputPanelProps {
  output: string;
}

export default function OutputPanel({ output }: OutputPanelProps) {
  return (
    <div className="h-full bg-black p-3 overflow-auto">
      <pre className="text-green-400 whitespace-pre-wrap">
        {output || "Run code to see output"}
      </pre>
    </div>
  );
}
