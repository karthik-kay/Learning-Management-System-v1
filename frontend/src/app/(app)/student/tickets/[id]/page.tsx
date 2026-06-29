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
import { TicketMessage, SendMessageData } from "@/types";
import { Stack, Inline, Box, Spacer } from "@/components/shared/primitives";
import { ArrowLeft, Paperclip, Send, Loader2, RotateCcw } from "lucide-react";

// --- Status config ---
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  open: { label: "Open", color: "#2563eb", bg: "#eff6ff" },
  in_progress: { label: "In Progress", color: "#d97706", bg: "#fffbeb" },
  awaiting_student: { label: "Awaiting You", color: "#7c3aed", bg: "#f5f3ff" },
  reopened: { label: "Reopened", color: "#dc2626", bg: "#fef2f2" },
  resolved: { label: "Resolved", color: "#16a34a", bg: "#f0fdf4" },
  closed: { label: "Closed", color: "#6b7280", bg: "#f9fafb" },
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  support: { label: "Support", color: "#0ea5e9" },
  sales: { label: "Sales", color: "#f59e0b" },
  admin: { label: "Admin", color: "#8b5cf6" },
};

// --- Message Bubble ---
function MessageBubble({ msg }: { msg: TicketMessage }) {
  const isStudent = msg.sender_type === "student";

  return (
    <Stack
      align={isStudent ? "end" : "start"}
      gap={4}
      style={{ width: "100%" }}
    >
      {/* Sender label */}
      <span
        style={{
          fontSize: 11,
          color: "#9ca3af",
          paddingLeft: 4,
          paddingRight: 4,
        }}
      >
        {msg.sender_username} ·{" "}
        {new Date(msg.created_at).toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>

      {/* Bubble */}
      <div
        style={{
          maxWidth: "70%",
          background: isStudent ? "#2563eb" : "#f3f4f6",
          color: isStudent ? "#fff" : "#111827",
          borderRadius: isStudent ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          padding: "10px 14px",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        <p style={{ margin: 0 }}>{msg.message}</p>

        {/* Attachment */}
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
              color: isStudent ? "#bfdbfe" : "#2563eb",
              textDecoration: "none",
            }}
          >
            <Paperclip size={12} />
            View attachment
          </a>
        )}
      </div>

      {/* Replies */}
      {msg.replies && msg.replies.length > 0 && (
        <Stack
          gap={8}
          align={isStudent ? "end" : "start"}
          style={{
            paddingLeft: isStudent ? 0 : 24,
            paddingRight: isStudent ? 24 : 0,
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

// --- Main Page ---
export default function TicketDetailPage() {
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
  const [reopening, setReopening] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTicket(id));
      dispatch(fetchTicketMessages(id));
    }
  }, [id, dispatch]);

  // Scroll to bottom when messages load
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

  const handleReopen = async () => {
    if (!id) return;
    setReopening(true);
    try {
      await dispatch(
        updateTicketStatus({ ticketId: id, data: { status: "reopened" } }),
      ).unwrap();
      dispatch(fetchTicket(id));
    } finally {
      setReopening(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canReopen =
    ticket?.status === "resolved" || ticket?.status === "closed";
  const isClosed = ticket?.status === "closed";
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
    <Box
      style={{
        maxWidth: 720,
        margin: "0 auto",
        paddingBottom: 100,
      }}
    >
      {/* Header */}
      <Box
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        {/* Back */}
        <button
          onClick={() => router.push("/student/tickets")}
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

        {/* Title + badges */}
        <Stack gap={8} align="start">
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

          <Inline gap={8} align="center">
            {/* Type */}
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

            {/* Status */}
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
              Raised{" "}
              {new Date(ticket.created_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </Inline>

          {/* Description */}
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

          {/* Original attachment */}
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

          {/* Reopen button */}
          {canReopen && (
            <button
              onClick={handleReopen}
              disabled={reopening}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
                padding: "8px 14px",
                border: "1px solid #dc2626",
                borderRadius: 8,
                background: "#fff",
                color: "#dc2626",
                fontSize: 13,
                fontWeight: 600,
                cursor: reopening ? "not-allowed" : "pointer",
              }}
            >
              {reopening ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <RotateCcw size={13} />
              )}
              {reopening ? "Reopening..." : "Reopen Ticket"}
            </button>
          )}
        </Stack>
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
            No messages yet. Add a follow-up below.
          </p>
        )}

        <Stack gap={16}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </Stack>

        <div ref={bottomRef} />
      </Box>

      {/* Fixed input at bottom */}
      <Box
        style={{
          position: "fixed",
          width: "100%",
          bottom: 0,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          padding: "12px 16px",
        }}
      >
        <Box>
          {/* Attachment preview */}
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
            {/* Attach button */}
            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={isClosed}
              style={{
                background: "none",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 8,
                cursor: isClosed ? "not-allowed" : "pointer",
                color: "#6b7280",
                flexShrink: 0,
              }}
            >
              <Paperclip size={16} />
            </button>

            {/* Text input */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isClosed}
              placeholder={
                isClosed
                  ? "This ticket is closed. Reopen to reply."
                  : "Type a follow-up message... (Enter to send)"
              }
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
                background: isClosed ? "#f9fafb" : "#fff",
                lineHeight: 1.5,
              }}
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={sending || !text.trim() || isClosed}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                background:
                  sending || !text.trim() || isClosed ? "#93c5fd" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor:
                  sending || !text.trim() || isClosed
                    ? "not-allowed"
                    : "pointer",
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
