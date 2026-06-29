// --- Enums / Union Types ---

export type TicketType = "support" | "sales" | "admin";

export type TicketStatus =
  | "open"
  | "in_progress"
  | "awaiting_student"
  | "reopened"
  | "resolved"
  | "closed";

export type AssignedRole = "faculty" | "sales" | "admin";

export type SenderType = "student" | "staff";

// --- Models ---

export interface TicketMessage {
  id: string; // UUID now
  ticket: string; // UUID
  sender: number;
  sender_username: string;
  sender_role: string;
  sender_type: SenderType;
  message: string;
  attachment?: string | null;
  parent?: string | null; // UUID of parent message for threading
  replies?: TicketMessage[]; // nested replies
  created_at: string;
}

export interface Ticket {
  id: string; // UUID
  created_by: number;
  created_by_username: string;
  created_by_role: string;
  title: string;
  description: string;
  attachment?: string | null;
  status: TicketStatus;
  type: TicketType;
  assigned_to_role: AssignedRole;
  created_at: string;
  updated_at: string;
  messages: TicketMessage[];
}

// --- Request Payloads ---

export interface CreateTicketData {
  title: string;
  description: string;
  type: TicketType;
  attachment?: File | null;
}

export interface SendMessageData {
  ticket: string; // UUID
  message: string;
  attachment?: File | null;
  parent?: string | null; // UUID, for replying to a specific message
}

export interface UpdateTicketStatusData {
  status: TicketStatus;
}
