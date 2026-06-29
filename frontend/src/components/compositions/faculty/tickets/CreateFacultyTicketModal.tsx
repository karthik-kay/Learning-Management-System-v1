"use client";

import { useState, useRef } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { createTicket } from "@/redux/thunks/ticketThunks";
import { CreateTicketData } from "@/types";
import { Stack, Inline, Spacer } from "@/components/shared/primitives";
import { X, Paperclip, Loader2 } from "lucide-react";

interface Props {
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 14,
  color: "#111827",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
};

export default function CreateFacultyTicketModal({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setLoading(true);
    setError(null);

    // faculty always raises to admin
    const data: CreateTicketData = {
      title: title.trim(),
      description: description.trim(),
      type: "admin",
      attachment: attachment ?? undefined,
    };

    try {
      await dispatch(createTicket(data)).unwrap();
      onClose();
    } catch (err: any) {
      setError(err || "Failed to raise ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <Inline justify="between" align="center">
          <Stack gap={6} align="start">
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Raise Ticket to Admin
            </h2>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#8b5cf6",
                background: "#f5f3ff",
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              ADMIN
            </span>
          </Stack>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={20} color="#6b7280" />
          </button>
        </Inline>

        <Spacer size={20} />

        <Stack gap={16}>
          <Stack gap={6} align="start">
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
              Title
            </label>
            <input
              style={inputStyle}
              placeholder="Brief summary of your issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Stack>

          <Stack gap={6} align="start">
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
              Description
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
              placeholder="Describe your issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>

          <Stack gap={6} align="start">
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
              Attachment{" "}
              <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                (optional)
              </span>
            </label>
            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                border: "1px dashed #d1d5db",
                borderRadius: 8,
                background: "#f9fafb",
                color: "#6b7280",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <Paperclip size={14} />
              {attachment ? attachment.name : "Attach a file"}
            </button>
          </Stack>

          {error && (
            <p style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>{error}</p>
          )}

          <Inline justify="end" gap={10}>
            <button
              onClick={onClose}
              style={{
                padding: "10px 18px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: "#fff",
                color: "#374151",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                background: loading ? "#93c5fd" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </Inline>
        </Stack>
      </div>
    </div>
  );
}
