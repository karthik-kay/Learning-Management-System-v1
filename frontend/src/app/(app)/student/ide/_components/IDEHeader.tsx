import { SupportedLanguage } from "@/types";

interface IDEHeaderProps {
  code: string;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onRun: () => void; // Remove the arguments here
  isRunning: boolean;
}

export default function IDEHeader({
  code,
  language,
  setLanguage,
  onRun,
  isRunning,
}: IDEHeaderProps) {
  return (
    <div className="flex gap-4 p-2 bg-zinc-800">
      <button
        // Now it just calls the function passed from the parent
        onClick={onRun}
        disabled={isRunning}
        className="bg-green-600 px-4 py-1 rounded disabled:opacity-50"
      >
        {isRunning ? "Running..." : "Run"}
      </button>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        className="bg-zinc-700 p-1 rounded"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        {/* Add more as needed based on your Judge0 ID map */}
      </select>
    </div>
  );
}
