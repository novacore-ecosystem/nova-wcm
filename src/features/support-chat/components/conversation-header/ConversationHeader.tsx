"use client";

import { Check, MessagesSquare, UserPlus, Users } from "lucide-react";
import { Badge, Button } from "@novacore/frontend-next-shadcn";

import { AiModeControl } from "@/features/support-chat/components/ai/AiModeControl";
import { PriorityBadge } from "@/features/support-chat/components/priority/PriorityBadge";
import type { AiModeFormValues } from "@/features/support-chat/support-chat.schema";
import type { AiModeConfig, ConversationDetail } from "@/services/support-chat";

/**
 * No customer avatar/name/email/phone here — Chat Service has no endpoint that returns Contact
 * details for a conversation (see the backend audit's gap list). `title`/`reason` (both free
 * text, often unset) and the raw conversation id are all there is to identify who this is.
 */
export function ConversationHeader({
  conversation,
  isOwnedByMe,
  needsClaim,
  onClaim,
  isClaiming,
  onClose,
  isClosing,
  aiMode,
  onEnableAiMode,
  onDisableAiMode,
}: {
  conversation: ConversationDetail;
  isOwnedByMe: boolean;
  needsClaim: boolean;
  onClaim: () => void;
  isClaiming: boolean;
  onClose: () => void;
  isClosing: boolean;
  aiMode: AiModeConfig;
  onEnableAiMode: (values: AiModeFormValues) => void;
  onDisableAiMode: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            {conversation.type === "group" ? <Users className="size-4 text-muted-foreground" /> : <MessagesSquare className="size-4 text-muted-foreground" />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{conversation.title || "Untitled conversation"}</p>
            <p className="truncate text-[11px] text-muted-foreground">#{conversation.id}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <AiModeControl key={conversation.id} state={aiMode.state} skills={aiMode.skills} context={aiMode.context} onEnable={onEnableAiMode} onDisable={onDisableAiMode} isSaving={false} />
          {needsClaim ? (
            <Button variant="outline" size="sm" loading={isClaiming} onClick={onClaim}>
              <UserPlus className="mr-1.5 size-3.5" />
              Claim
            </Button>
          ) : null}
          {isOwnedByMe && conversation.status !== "closed" ? (
            <Button variant="outline" size="sm" loading={isClosing} onClick={onClose}>
              <Check className="mr-1.5 size-3.5" />
              Close
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {conversation.status === "closed" ? (
          <Badge variant="outline">Closed</Badge>
        ) : conversation.status === "queued" ? (
          <Badge variant="warning">Unassigned</Badge>
        ) : isOwnedByMe ? (
          <Badge variant="secondary">Owned by you</Badge>
        ) : conversation.assignedUserId ? (
          <Badge variant="secondary" className="font-mono text-[10px]">
            Owned by {conversation.assignedUserId.slice(0, 8)}
          </Badge>
        ) : null}
        <PriorityBadge priority={conversation.priority} />
        {conversation.reason ? <span className="text-xs text-muted-foreground">&ldquo;{conversation.reason}&rdquo;</span> : null}
      </div>
    </div>
  );
}
