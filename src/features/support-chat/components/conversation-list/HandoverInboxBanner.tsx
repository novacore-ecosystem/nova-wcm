"use client";

import { ArrowRightLeft, Check, X } from "lucide-react";
import { Badge, Button, RelativeTime } from "@novacore/frontend-next-shadcn";

import type { HandoverInvitation } from "@/services/support-chat";

/**
 * `HandoverInvitationDto` carries no `fromAgentName` (no user directory in Chat Service) and no
 * note/reason field (`ConversationTransferRequest` has none — there's also no way to *create* an
 * invitation with a note, since no create-handover endpoint exists at all, see the backend
 * audit). Wording is deliberately generic — a raw user id fragment is the most this can say about
 * who's asking.
 */
export function HandoverInboxBanner({
  invitations,
  onAccept,
  onReject,
  busyId,
}: {
  invitations: HandoverInvitation[];
  onAccept: (transferRequestId: string, conversationId: string) => void;
  onReject: (transferRequestId: string) => void;
  busyId: string | null;
}) {
  if (invitations.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 border-b border-border bg-info/5 p-3">
      {invitations.map((invitation) => (
        <div key={invitation.transferRequestId} className="flex flex-col gap-2 rounded-lg border border-info/30 bg-background p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-info/15">
              <ArrowRightLeft className="size-3.5 text-info" />
            </span>
            <p className="text-sm">
              A colleague (<span className="font-mono text-xs">{invitation.fromUserId.slice(0, 8)}</span>) wants to hand over a conversation to you
            </p>
          </div>
          <div className="flex items-center gap-1.5 pl-8 text-xs text-muted-foreground">
            <Badge variant="outline">
              <RelativeTime date={invitation.requestedAt} />
            </Badge>
          </div>
          <div className="flex items-center gap-2 pl-8">
            <Button size="sm" loading={busyId === invitation.transferRequestId} onClick={() => onAccept(invitation.transferRequestId, invitation.conversationId)}>
              <Check className="mr-1.5 size-3.5" />
              Accept
            </Button>
            <Button size="sm" variant="outline" disabled={busyId === invitation.transferRequestId} onClick={() => onReject(invitation.transferRequestId)}>
              <X className="mr-1.5 size-3.5" />
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
