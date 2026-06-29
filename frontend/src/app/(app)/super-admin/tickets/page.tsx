"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTickets } from "@/redux/thunks/ticketThunks";
import { Ticket, TicketStatus } from "@/types";
import { Stack, Inline, Box, Spacer } from "@/components/shared/primitives";
import { Ticket as TicketIcon, ChevronRight, Paperclip } from "lucide-react";

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

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  faculty: { label: "Faculty", color: "#0ea5e9", bg: "#f0f9ff" },
  sales: { label: "Sales", color: "#f59e0b", bg: "#fffbeb" },
  admin: { label: "Admin", color: "#8b5cf6", bg: "#f5f3ff" },
};

function TicketCard({
  ticket,
  onClick,
}: {
  ticket: Ticket;
  onClick: () => void;
}) {
  const status = STATUS_CONFIG[ticket.status];
  const type = TYPE_CONFIG[ticket.type];
  const role = ROLE_CONFIG[ticket.assigned_to_role];

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 16px rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")
      }
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
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: role?.color,
                background: role?.bg,
                borderRadius: 6,
                padding: "2px 8px",
              }}
            >
              → {role?.label}
            </span>
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
        All tickets across the system will appear here
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

type RoleFilter = "all" | "faculty" | "sales" | "admin";

export default function AdminTicketsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tickets, loading, error } = useAppSelector((s) => s.tickets);
  const [statusFilter, setStatusFilter] = useState<"all" | TicketStatus>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const filtered = tickets
    .filter((t) => statusFilter === "all" || t.status === statusFilter)
    .filter((t) => roleFilter === "all" || t.assigned_to_role === roleFilter);

  // stats
  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "in_progress",
  ).length;
  const reopenedCount = tickets.filter((t) => t.status === "reopened").length;

  return (
    <Box style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <Stack gap={4} align="start">
        <h1
          style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}
        >
          All Tickets
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
          {tickets.length} total · {openCount} open · {inProgressCount} in
          progress · {reopenedCount} reopened
        </p>
      </Stack>

      <Spacer size={20} />

      {/* Role filter */}
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
        {(["all", "faculty", "sales", "admin"] as RoleFilter[]).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "none",
              background: roleFilter === r ? "#fff" : "transparent",
              color: roleFilter === r ? "#111827" : "#6b7280",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                roleFilter === r ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}
          >
            {r === "all"
              ? `All (${tickets.length})`
              : `${ROLE_CONFIG[r].label} (${tickets.filter((t) => t.assigned_to_role === r).length})`}
          </button>
        ))}
      </Inline>

      <Spacer size={12} />

      {/* Status filter */}
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
            active={statusFilter === f}
            onClick={() => setStatusFilter(f as "all" | TicketStatus)}
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
      {!loading && !error && tickets.length === 0 && <EmptyState />}
      {!loading && filtered.length === 0 && tickets.length > 0 && (
        <p style={{ color: "#9ca3af", fontSize: 14 }}>
          No tickets match this filter.
        </p>
      )}

      <Stack gap={10}>
        {filtered.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => router.push(`/admin/tickets/${ticket.id}`)}
          />
        ))}
      </Stack>
    </Box>
  );
}
