import { useState } from "react";
import { SupportedLanguage } from "@/types/index";

const LANGUAGE_MAP: Record<string, number> = {
  javascript: 63,
  python: 71,
  typescript: 74,
  cpp: 54,
  java: 62,
};

export function useRunCode() {
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const smartDecode = (str: string | null | undefined): string => {
    if (!str) return "";
    try {
      // If it's Base64, atob works. If it's plain text, this might throw or
      // return garbage. We check for common Base64 patterns.
      const isBase64 =
        /^[A-Za-z0-9+/]*={0,2}$/.test(str.trim()) && str.length % 4 === 0;
      return isBase64 ? atob(str).trim() : str.trim();
    } catch (e) {
      return str.trim(); // Return as-is if decoding fails
    }
  };

  async function runCode(code: string, language: SupportedLanguage) {
    setIsRunning(true);
    setError(null);
    setOutput("Running...");

    const JUDGE0_URL = "http://192.168.0.108:2358";

    try {
      const body = {
        // 1. Encode your code so special characters like ² don't break the request
        source_code: btoa(code),
        language_id: LANGUAGE_MAP[language] || 63,
        // 2. Tell Judge0 the input is Base64
        base64_encoded: true,
      };

      // 3. Add base64_encoded=true to the URL as well (as the error suggested)
      const res = await fetch(
        `${JUDGE0_URL}/submissions?wait=true&base64_encoded=true`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 4. ALWAYS decode the response parts
      const stdout = data.stdout ? atob(data.stdout) : "";
      const stderr = data.stderr ? atob(data.stderr) : "";
      const compile_output = data.compile_output
        ? atob(data.compile_output)
        : "";
      const message = data.message ? atob(data.message) : "";

      const finalResult = [stdout, stderr, compile_output, message]
        .filter(Boolean)
        .join("\n");

      setOutput(finalResult || "No output");
    } catch (err: any) {
      console.error("Execution Error:", err);
      setOutput("Error: " + err.message);
    } finally {
      setIsRunning(false);
    }
  }
  return { runCode, output, isRunning, error };
}
