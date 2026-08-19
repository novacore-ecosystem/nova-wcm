"use client";

import { Bot, CircleCheck } from "lucide-react";
import { Avatar, Badge, cn, RelativeTime } from "@novacore/frontend-next-shadcn";

import type { Conversation } from "@/services/support-chat";

const PRIORITY_DOT: Record<Conversation["priority"], string> = {
  urgent: "bg-destructive",
  high: "bg-warning",
  important: "bg-info",
  normal: "bg-transparent",
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function ConversationListItem({ conversation, isOpen, onSelect }: { conversation: Conversation; isOpen: boolean; onSelect: () => void }) {
  const isClosed = conversation.status === "closed";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isOpen}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
        isOpen ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent",
        isClosed && !isOpen && "opacity-60",
      )}
    >
      <span className="relative shrink-0">
        <Avatar fallback={initials(conversation.customer.name)} />
        {conversation.priority !== "normal" ? (
          <span className={cn("absolute -right-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-background", PRIORITY_DOT[conversation.priority])} />
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className={cn("truncate text-sm", isClosed ? "font-normal text-muted-foreground" : "font-medium")}>{conversation.customer.name}</span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            <RelativeTime date={conversation.updatedAt} />
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          {conversation.lastMessageSender === "ai" ? <Bot className="size-3 shrink-0 text-info" /> : null}
          <span className="truncate text-xs text-muted-foreground">{conversation.lastMessagePreview ?? "—"}</span>
        </span>
        <span className="mt-1 flex items-center gap-1.5">
          {isClosed ? (
            <Badge variant="outline" className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <CircleCheck className="size-3" />
              Closed
            </Badge>
          ) : null}
          {conversation.assignedAgentName && conversation.status === "assigned" ? (
            <span className="truncate text-[11px] text-muted-foreground">{conversation.assignedAgentName}</span>
          ) : null}
          {conversation.unreadCount > 0 ? <Badge className="ml-auto shrink-0">{conversation.unreadCount}</Badge> : null}
        </span>
      </span>
    </button>
  );
}
