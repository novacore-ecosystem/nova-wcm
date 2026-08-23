"use client";

import { CircleCheck, MessagesSquare, Users } from "lucide-react";
import { Badge, Button, cn, RelativeTime } from "@novacore/frontend-next-shadcn";

import { PriorityBadge } from "@/features/support-chat/components/priority/PriorityBadge";
import type { ConversationListEntry } from "@/features/support-chat/components/conversation-list/useConversationListPane";

const PRIORITY_DOT: Record<ConversationListEntry["priority"], string> = {
  urgent: "bg-destructive",
  high: "bg-warning",
  normal: "bg-transparent",
  low: "bg-transparent",
};

/**
 * No customer name/avatar renders here — Chat Service has no endpoint that returns Contact
 * details for a conversation (see the backend audit), so `title` (free text, often unset) and
 * the raw id are all this list has to identify a conversation by.
 */
export function ConversationListItem({ entry, isOpen, onSelect, onClaim, isClaiming }: { entry: ConversationListEntry; isOpen: boolean; onSelect: () => void; onClaim: () => void; isClaiming: boolean }) {
  return (
    <div className={cn("flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors", isOpen ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent", entry.isClosed && !isOpen && "opacity-60")}>
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-start gap-3 text-left">
        <span className="relative shrink-0">
          <span className="flex size-8 items-center justify-center rounded-full bg-muted">
            {entry.type === "group" ? <Users className="size-4 text-muted-foreground" /> : <MessagesSquare className="size-4 text-muted-foreground" />}
          </span>
          {entry.priority !== "normal" && entry.priority !== "low" ? <span className={cn("absolute -right-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-background", PRIORITY_DOT[entry.priority])} /> : null}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className={cn("truncate text-sm", entry.isClosed ? "font-normal text-muted-foreground" : "font-medium")}>{entry.title || `Conversation #${entry.conversationId.slice(0, 8)}`}</span>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              <RelativeTime date={entry.timestamp} />
            </span>
          </span>
          <span className="mt-1 flex items-center gap-1.5">
            {entry.isClosed ? (
              <Badge variant="outline" className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <CircleCheck className="size-3" />
                Closed
              </Badge>
            ) : (
              <PriorityBadge priority={entry.priority} />
            )}
          </span>
        </span>
      </button>

      {entry.needsClaim ? (
        <Button size="sm" variant="outline" loading={isClaiming} onClick={onClaim} className="shrink-0">
          Claim
        </Button>
      ) : null}
    </div>
  );
}
