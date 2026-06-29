import { BaseModel } from "./common";

export interface InstitutionAuditLog {
  id: number;
  actor_name: string | null;
  action: string;
  module: string;
  object_type: string;
  object_id: string;
  summary: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export type InstitutionExportStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface InstitutionExportJob extends BaseModel {
  report_type: string;
  export_format: "csv" | "xlsx" | "pdf";
  status: InstitutionExportStatus;
  filters: Record<string, unknown>;
  file: string | null;
  requested_by_name: string | null;
  error_message: string;
  expires_at: string | null;
}

export interface InstitutionExportCreatePayload {
  report_type: string;
  export_format?: "csv" | "xlsx" | "pdf";
  filters?: Record<string, unknown>;
}
