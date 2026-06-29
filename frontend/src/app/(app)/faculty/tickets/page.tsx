"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTickets } from "@/redux/thunks/ticketThunks";
import { Ticket, TicketStatus } from "@/types";
import { Stack, Inline, Box, Spacer } from "@/components/shared/primitives";
import {
  Plus,
  Ticket as TicketIcon,
  ChevronRight,
  Paperclip,
} from "lucide-react";
import CreateFacultyTicketModal from "@/components/compositions/faculty/tickets/CreateFacultyTicketModal";

const STATUS_CONFIG: Record<
  TicketStatus,
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

function TicketCard({
  ticket,
  onClick,
  isOwn,
}: {
  ticket: Ticket;
  onClick: () => void;
  isOwn: boolean;
}) {
  const status = STATUS_CONFIG[ticket.status];
  const type = TYPE_CONFIG[ticket.type];

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: `1px solid ${isOwn ? "#e9d5ff" : "#e5e7eb"}`,
        borderRadius: 12,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 16px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <Inline justify="between" align="start">
        <Stack gap={6} align="start" style={{ flex: 1, minWidth: 0 }}>
          <Inline gap={8} align="center">
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: type?.color,
                background: `${type?.color}18`,
                borderRadius: 6,
                padding: "2px 8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {type?.label}
            </span>
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
            {isOwn && (
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
                Raised by you
              </span>
            )}
            {ticket.attachment && <Paperclip size={12} color="#9ca3af" />}
          </Inline>

          <p
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: "#111827",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {ticket.title}
          </p>

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

          <Inline gap={12} align="center">
            {!isOwn && (
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                By {ticket.created_by_username}
              </span>
            )}
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
        <ChevronRight
          size={18}
          color="#9ca3af"
          style={{ flexShrink: 0, marginTop: 2 }}
        />
      </Inline>
    </div>
  );
}

function EmptyState() {
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
        Tickets will appear here
      </p>
    </Stack>
  );
}

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

type TabView = "assigned" | "mine";

export default function FacultyTicketsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tickets, loading, error } = useAppSelector((s) => s.tickets);
  const user = useAppSelector((s) => s.user.profile);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<"all" | TicketStatus>("all");
  const [tabView, setTabView] = useState<TabView>("assigned");

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const assignedTickets = tickets.filter((t) => t.created_by !== user?.id);
  const myTickets = tickets.filter((t) => t.created_by === user?.id);
  const activeList = tabView === "assigned" ? assignedTickets : myTickets;
  const filtered =
    filter === "all"
      ? activeList
      : activeList.filter((t) => t.status === filter);

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
            Tickets
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
            {assignedTickets.length} assigned · {myTickets.length} raised by you
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
          Raise to Admin
        </button>
      </Inline>

      <Spacer size={20} />

      {/* Tab toggle — assigned vs mine */}
      <Inline
        justify="start"
        gap={4}
        style={{
          background: "#f3f4f6",
          borderRadius: 10,
          padding: 4,
          width: "fit-content",
        }}
      >
        {(["assigned", "mine"] as TabView[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setTabView(tab)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "none",
              background: tabView === tab ? "#fff" : "transparent",
              color: tabView === tab ? "#111827" : "#6b7280",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                tabView === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}
          >
            {tab === "assigned"
              ? `Assigned (${assignedTickets.length})`
              : `My Tickets (${myTickets.length})`}
          </button>
        ))}
      </Inline>

      <Spacer size={12} />

      {/* Status filters */}
      <Inline justify="start" gap={4} style={{ flexWrap: "wrap" }}>
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

      {loading && (
        <p style={{ color: "#6b7280", fontSize: 14 }}>Loading tickets...</p>
      )}
      {error && (
        <p style={{ color: "#dc2626", fontSize: 14 }}>
          Something went wrong: {error}
        </p>
      )}
      {!loading && !error && activeList.length === 0 && <EmptyState />}
      {!loading && filtered.length === 0 && activeList.length > 0 && (
        <p style={{ color: "#9ca3af", fontSize: 14 }}>
          No tickets with this status.
        </p>
      )}

      <Stack gap={10}>
        {filtered.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            isOwn={ticket.created_by === user?.id}
            onClick={() => router.push(`/faculty/tickets/${ticket.id}`)}
          />
        ))}
      </Stack>

      {showCreateModal && (
        <CreateFacultyTicketModal onClose={() => setShowCreateModal(false)} />
      )}
    </Box>
  );
}
