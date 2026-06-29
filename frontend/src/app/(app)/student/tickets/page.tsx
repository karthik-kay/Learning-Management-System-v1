"use client";

import { useEffect, useState } from "react";
import { fetchTickets } from "@/redux/thunks/ticketThunks";
import { Ticket, TicketStatus, TicketType } from "@/types";
import { Stack, Inline, Box, Spacer } from "@/components/shared/primitives";
import {
  Plus,
  Ticket as TicketIcon,
  ChevronRight,
  Paperclip,
} from "lucide-react";
import CreateTicketModal from "@/components/compositions/student/tickets/CreateTicketModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

// --- Status config ---
const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; bg: string }
> = {
  open: { label: "Open", color: "#2563eb", bg: "#eff6ff" },
  in_progress: { label: "In Progress", color: "#d97706", bg: "#fffbeb" },
  awaiting_student: { label: "Awaiting You", color: "#7c3aed", bg: "#f5f3ff" },
  reopened: { label: "Reopened", color: "#dc2626", bg: "#fef2f2" },
  resolved: { label: "Resolved", color: "#16a34a", bg: "#f0fdf4" },
  closed: { label: "Closed", color: "#6b7280", bg: "#f9fafb" },
};

const TYPE_CONFIG: Record<TicketType, { label: string; color: string }> = {
  support: { label: "Support", color: "#0ea5e9" },
  sales: { label: "Sales", color: "#f59e0b" },
  admin: { label: "Admin", color: "#8b5cf6" },
};

// --- Ticket Card ---
function TicketCard({
  ticket,
  onClick,
}: {
  ticket: Ticket;
  onClick: () => void;
}) {
  const status = STATUS_CONFIG[ticket.status];
  const type = TYPE_CONFIG[ticket.type];

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "box-shadow 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 16px rgba(0,0,0,0.08)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#d1d5db";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
      }}
    >
      <Inline justify="between" align="start">
        {/* Left */}
        <Stack gap={6} align="start" style={{ flex: 1, minWidth: 0 }}>
          <Inline gap={8} align="center">
            {/* Type badge */}
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

            {/* Status badge */}
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

            {/* Attachment indicator */}
            {ticket.attachment && <Paperclip size={12} color="#9ca3af" />}
          </Inline>

          {/* Title */}
          <p
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: "#111827",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {ticket.title}
          </p>

          {/* Description preview */}
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#6b7280",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 480,
            }}
          >
            {ticket.description}
          </p>

          {/* Date + message count */}
          <Inline gap={12} align="center">
            <span style={{ fontSize: 12, color: "#9ca3af" }}>
              {new Date(ticket.created_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            {ticket.messages?.length > 0 && (
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {ticket.messages.length} message
                {ticket.messages.length !== 1 ? "s" : ""}
              </span>
            )}
          </Inline>
        </Stack>

        {/* Chevron */}
        <ChevronRight
          size={18}
          color="#9ca3af"
          style={{ flexShrink: 0, marginTop: 2 }}
        />
      </Inline>
    </div>
  );
}

// --- Empty State ---
function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <Stack
      align="center"
      justify="center"
      gap={12}
      style={{ padding: "60px 0" }}
    >
      <TicketIcon size={40} color="#d1d5db" />
      <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#374151" }}>
        No tickets yet
      </p>
      <p style={{ margin: 0, fontSize: 14, color: "#9ca3af" }}>
        Raise a ticket and we'll get back to you
      </p>
      <button
        onClick={onCreateClick}
        style={{
          marginTop: 8,
          padding: "10px 20px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Raise a Ticket
      </button>
    </Stack>
  );
}

// --- Filter Tab ---
function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        border: "none",
        background: active ? "#2563eb" : "transparent",
        color: active ? "#fff" : "#6b7280",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

// --- Main Page ---
export default function StudentTicketsPage() {
  const dispatch = useAppDispatch();
  const { tickets, loading, error } = useAppSelector((s) => s.tickets);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<"all" | TicketStatus>("all");

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const filtered =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const router = useRouter();

  const handleTicketClick = (id: string) => {
    router.push(`/student/tickets/${id}`);
  };

  return (
    <Box style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <Inline justify="between" align="center">
        <Stack gap={4} align="start">
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            My Tickets
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} total
          </p>
        </Stack>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={16} />
          New Ticket
        </button>
      </Inline>

      <Spacer size={20} />

      {/* Filter tabs */}
      <Inline justify="start" gap={4}>
        {(
          [
            "all",
            "open",
            "in_progress",
            "awaiting_student",
            "reopened",
            "resolved",
            "closed",
          ] as const
        ).map((f) => (
          <FilterTab
            key={f}
            label={
              f === "all"
                ? "All"
                : (STATUS_CONFIG[f as TicketStatus]?.label ?? f)
            }
            active={filter === f}
            onClick={() => setFilter(f as "all" | TicketStatus)}
          />
        ))}
      </Inline>

      <Spacer size={16} />

      {/* Content */}
      {loading && (
        <p style={{ color: "#6b7280", fontSize: 14 }}>Loading tickets...</p>
      )}

      {error && (
        <p style={{ color: "#dc2626", fontSize: 14 }}>
          Something went wrong: {error}
        </p>
      )}

      {!loading && !error && tickets.length === 0 && (
        <EmptyState onCreateClick={() => setShowCreateModal(true)} />
      )}

      {!loading && filtered.length === 0 && tickets.length > 0 && (
        <p style={{ color: "#9ca3af", fontSize: 14 }}>
          No tickets with this status.
        </p>
      )}

      <Stack gap={10}>
        {filtered.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => handleTicketClick(ticket.id)}
          />
        ))}
      </Stack>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTicketModal onClose={() => setShowCreateModal(false)} />
      )}
    </Box>
  );
}
