export const SUPPORTED_CODE_LANGUAGES = ["javascript", "python"] as const;

export const JUDGE0_LANGUAGE_ID_MAP = {
  javascript: 63,
  python: 71,
} as const;

export const DEFAULT_CODE = {
  javascript: `console.log("Hello World");`,
  python: `print("Hello World")`,
} as const;
