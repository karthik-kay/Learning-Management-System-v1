import { post } from "./nodeService";
import { ExecuteCodeRequest, ExecuteCodeResponse } from "@/types/ide";

export function executeCode(
  payload: ExecuteCodeRequest
): Promise<ExecuteCodeResponse> {
  return post<ExecuteCodeResponse>("/execute", payload);
}
