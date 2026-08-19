"use client";

import { ArrowRightLeft, Check, X } from "lucide-react";
import { Badge, Button, RelativeTime } from "@novacore/frontend-next-shadcn";

import { PriorityBadge } from "@/features/support-chat/components/priority/PriorityBadge";
import type { Conversation } from "@/services/support-chat";

/**
 * "Someone wants to hand this conversation over to you" — prominent, notification-style, not an
 * "assignment record" — shown at the top of the Unassigned pane regardless of the conversation's
 * own status (it's still owned by the sender until accepted).
 */
export function HandoverInboxBanner({
  conversations,
  onAccept,
  onReject,
  busyId,
}: {
  conversations: Conversation[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  busyId: string | null;
}) {
  if (conversations.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 border-b border-border bg-info/5 p-3">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="flex flex-col gap-2 rounded-lg border border-info/30 bg-background p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-info/15">
              <ArrowRightLeft className="size-3.5 text-info" />
            </span>
            <p className="text-sm">
              <span className="font-medium">{conversation.pendingHandover?.fromAgentName}</span> wants to hand this conversation over to you
            </p>
          </div>
          <div className="flex items-center gap-1.5 pl-8 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{conversation.customer.name}</span>
            <PriorityBadge priority={conversation.priority} />
            <Badge variant="outline">
              <RelativeTime date={conversation.pendingHandover?.requestedAt ?? conversation.updatedAt} />
            </Badge>
          </div>
          {conversation.pendingHandover?.reason ? (
            <p className="pl-8 text-xs italic text-muted-foreground">&ldquo;{conversation.pendingHandover.reason}&rdquo;</p>
          ) : null}
          <div className="flex items-center gap-2 pl-8">
            <Button size="sm" loading={busyId === conversation.id} onClick={() => onAccept(conversation.id)}>
              <Check className="mr-1.5 size-3.5" />
              Accept
            </Button>
            <Button size="sm" variant="outline" disabled={busyId === conversation.id} onClick={() => onReject(conversation.id)}>
              <X className="mr-1.5 size-3.5" />
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
