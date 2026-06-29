import { SUPPORTED_CODE_LANGUAGES } from "@/constants/ide";

export type SupportedLanguage = (typeof SUPPORTED_CODE_LANGUAGES)[number];

export interface ExecuteCodeRequest {
  code: string;
  language: SupportedLanguage;
  stdin?: string;
}

export interface ExecuteCodeResponse {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  status?: {
    id: number;
    description: string;
  };
}

export type Workspace = {
  id: number;
  name: string;
  created_at: string;
};

export type WorkspaceItem = {
  id: number;
  name: string;
  type: "file" | "folder";
  parent: number | null;
  content?: string | null;
  children?: WorkspaceItem[];
};
