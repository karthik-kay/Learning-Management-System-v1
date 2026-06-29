"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchTicket,
  fetchTicketMessages,
  sendMessage,
  updateTicketStatus,
} from "@/redux/thunks/ticketThunks";
import { TicketMessage, TicketStatus, SendMessageData } from "@/types";
import { Stack, Inline, Box } from "@/components/shared/primitives";
import { ArrowLeft, Paperclip, Send, Loader2 } from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  open: { label: "Open", color: "#2563eb", bg: "#eff6ff" },
  in_progress: { label: "In Progress", color: "#d97706", bg: "#fffbeb" },
  awaiting_student: {
    label: "Awaiting Student",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  reopened: { label: "Reopened", color: "#dc2626", bg: "#fef2f2" },
  resolved: { label: "Resolved", color: "#16a34a", bg: "#f0fdf4" },
  closed: { label: "Closed", color: "#6b7280", bg: "#f9fafb" },
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  support: { label: "Support", color: "#0ea5e9" },
  sales: { label: "Sales", color: "#f59e0b" },
  admin: { label: "Admin", color: "#8b5cf6" },
};

// Admin can set any status
const ALL_STATUS_OPTIONS: TicketStatus[] = [
  "open",
  "in_progress",
  "awaiting_student",
  "reopened",
  "resolved",
  "closed",
];

function MessageBubble({ msg }: { msg: TicketMessage }) {
  const isStudent = msg.sender_type === "student";

  return (
    <Stack
      align={isStudent ? "start" : "end"}
      gap={4}
      style={{ width: "100%" }}
    >
      <Inline
        gap={6}
        align="center"
        style={{ paddingLeft: 4, paddingRight: 4 }}
      >
        <span style={{ fontSize: 11, color: "#9ca3af" }}>
          {msg.sender_username}
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: isStudent ? "#2563eb" : "#16a34a",
            background: isStudent ? "#eff6ff" : "#f0fdf4",
            borderRadius: 4,
            padding: "1px 5px",
          }}
        >
          {msg.sender_type}
        </span>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>
          {new Date(msg.created_at).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </Inline>

      <div
        style={{
          maxWidth: "70%",
          background: isStudent ? "#f3f4f6" : "#2563eb",
          color: isStudent ? "#111827" : "#fff",
          borderRadius: isStudent ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
          padding: "10px 14px",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        <p style={{ margin: 0 }}>{msg.message}</p>
        {msg.attachment && (
          <a
            href={msg.attachment}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
              fontSize: 12,
              color: isStudent ? "#2563eb" : "#bfdbfe",
              textDecoration: "none",
            }}
          >
            <Paperclip size={12} />
            View attachment
          </a>
        )}
      </div>

      {msg.replies && msg.replies.length > 0 && (
        <Stack
          gap={8}
          align={isStudent ? "start" : "end"}
          style={{
            paddingLeft: isStudent ? 24 : 0,
            paddingRight: isStudent ? 0 : 24,
            width: "100%",
          }}
        >
          {msg.replies.map((reply) => (
            <MessageBubble key={reply.id} msg={reply} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default function AdminTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    selectedTicket: ticket,
    messages,
    loading,
    messageLoading,
  } = useAppSelector((s) => s.tickets);

  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTicket(id));
      dispatch(fetchTicketMessages(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !id) return;
    setSending(true);
    const data: SendMessageData = {
      ticket: id,
      message: text.trim(),
      attachment: attachment ?? undefined,
    };
    try {
      await dispatch(sendMessage(data)).unwrap();
      setText("");
      setAttachment(null);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!id) return;
    setUpdatingStatus(true);
    setShowStatusMenu(false);
    try {
      await dispatch(
        updateTicketStatus({ ticketId: id, data: { status } }),
      ).unwrap();
      dispatch(fetchTicket(id));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const status = ticket ? STATUS_CONFIG[ticket.status] : null;
  const type = ticket ? TYPE_CONFIG[ticket.type] : null;

  if (loading || !ticket) {
    return (
      <Box style={{ padding: 24 }}>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Loading ticket...</p>
      </Box>
    );
  }

  return (
    <Box style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 100 }}>
      {/* Header */}
      <Box
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <button
          onClick={() => router.push("/admin/tickets")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            fontSize: 13,
            padding: 0,
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={15} />
          Back to tickets
        </button>

        <Inline justify="between" align="start">
          <Stack gap={8} align="start" style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {ticket.title}
            </h1>

            <Inline gap={8} align="center" style={{ flexWrap: "wrap" }}>
              {type && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: type.color,
                    background: `${type.color}18`,
                    borderRadius: 6,
                    padding: "2px 8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {type.label}
                </span>
              )}
              {status && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: status.color,
                    background: status.bg,
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}
                >
                  {status.label}
                </span>
              )}
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                By {ticket.created_by_username} ({ticket.created_by_role})
              </span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {new Date(ticket.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </Inline>

            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "#6b7280",
                lineHeight: 1.6,
              }}
            >
              {ticket.description}
            </p>

            {ticket.attachment && (
              <a
                href={ticket.attachment}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  color: "#2563eb",
                  textDecoration: "none",
                }}
              >
                <Paperclip size={13} />
                View attachment
              </a>
            )}
          </Stack>

          {/* Status changer — admin can change any status */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setShowStatusMenu((v) => !v)}
              disabled={updatingStatus}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: "#fff",
                color: "#374151",
                fontSize: 13,
                fontWeight: 600,
                cursor: updatingStatus ? "not-allowed" : "pointer",
              }}
            >
              {updatingStatus && <Loader2 size={13} className="animate-spin" />}
              {updatingStatus ? "Updating..." : "Change Status"}
            </button>

            {showStatusMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  zIndex: 10,
                  minWidth: 180,
                  overflow: "hidden",
                }}
              >
                {ALL_STATUS_OPTIONS.map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "10px 14px",
                        background: ticket.status === s ? "#f9fafb" : "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: ticket.status === s ? 700 : 400,
                        color: cfg.color,
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: cfg.color,
                          flexShrink: 0,
                        }}
                      />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </Inline>
      </Box>

      {/* Thread */}
      <Box style={{ padding: "20px 16px" }}>
        {messageLoading && (
          <p style={{ fontSize: 14, color: "#9ca3af" }}>Loading messages...</p>
        )}
        {!messageLoading && messages.length === 0 && (
          <p
            style={{
              fontSize: 14,
              color: "#9ca3af",
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            No messages yet.
          </p>
        )}
        <Stack gap={16}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </Stack>
        <div ref={bottomRef} />
      </Box>

      {/* Fixed input */}
      <Box
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          padding: "12px 16px",
          zIndex: 40,
        }}
      >
        <Box style={{ maxWidth: 720, margin: "0 auto" }}>
          {attachment && (
            <Inline justify="start" gap={6} style={{ marginBottom: 8 }}>
              <Paperclip size={12} color="#6b7280" />
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {attachment.name}
              </span>
              <button
                onClick={() => setAttachment(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc2626",
                  fontSize: 12,
                }}
              >
                remove
              </button>
            </Inline>
          )}
          <Inline gap={10} align="end">
            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                background: "none",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 8,
                cursor: "pointer",
                color: "#6b7280",
                flexShrink: 0,
              }}
            >
              <Paperclip size={16} />
            </button>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a reply... (Enter to send)"
              rows={1}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 14,
                color: "#111827",
                outline: "none",
                resize: "none",
                background: "#fff",
                lineHeight: 1.5,
              }}
            />
            <button
              onClick={handleSend}
              disabled={sending || !text.trim()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                background: sending || !text.trim() ? "#93c5fd" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: sending || !text.trim() ? "not-allowed" : "pointer",
                flexShrink: 0,
              }}
            >
              {sending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </Inline>
        </Box>
      </Box>
    </Box>
  );
}
