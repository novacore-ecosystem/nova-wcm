"use client";

import { ArrowRightLeft, Check, Mail, MapPin, Phone } from "lucide-react";
import { Avatar, Badge, Button, Popover } from "@novacore/frontend-next-shadcn";

import { CustomerIdentityBadge } from "@/features/support-chat/components/customer/CustomerIdentityBadge";
import { AiModeControl } from "@/features/support-chat/components/ai/AiModeControl";
import { PrioritySelect } from "@/features/support-chat/components/priority/PrioritySelect";
import type { AiModeFormValues } from "@/features/support-chat/support-chat.schema";
import type { Conversation, ConversationPriority } from "@/services/support-chat";

/**
 * The right pane's own header — deliberately separate from the left pane's search/tabs header
 * (§2 of the task). Its whole job is making it unambiguous which conversation is open, even
 * though the left tab can change independently underneath it.
 */
export function ConversationHeader({
  conversation,
  isOwnedByMe,
  onChangePriority,
  onRequestHandover,
  onClose,
  onEnableAiMode,
  onDisableAiMode,
  isSavingAiMode,
}: {
  conversation: Conversation;
  isOwnedByMe: boolean;
  onChangePriority: (priority: ConversationPriority) => void;
  onRequestHandover: () => void;
  onClose: () => void;
  onEnableAiMode: (values: AiModeFormValues) => void;
  onDisableAiMode: () => void;
  isSavingAiMode: boolean;
}) {
  const { customer } = conversation;

  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar fallback={customer.name.slice(0, 2).toUpperCase()} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{customer.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">#{conversation.id}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <AiModeControl
            key={conversation.id}
            state={conversation.aiMode.state}
            skills={conversation.aiMode.skills}
            context={conversation.aiMode.context}
            onEnable={onEnableAiMode}
            onDisable={onDisableAiMode}
            isSaving={isSavingAiMode}
          />
          {isOwnedByMe && conversation.status !== "closed" ? (
            <>
              <Button variant="outline" size="sm" onClick={onRequestHandover}>
                <ArrowRightLeft className="mr-1.5 size-3.5" />
                Hand over
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <Check className="mr-1.5 size-3.5" />
                Close
              </Button>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <CustomerIdentityBadge kind={customer.kind} />
        {conversation.status === "closed" ? (
          <Badge variant="outline">Closed</Badge>
        ) : conversation.status === "unassigned" ? (
          <Badge variant="warning">Unassigned</Badge>
        ) : (
          <Badge variant="secondary">{conversation.assignedAgentName}</Badge>
        )}
        {isOwnedByMe && conversation.status !== "closed" ? (
          <PrioritySelect value={conversation.priority} onChange={onChangePriority} id={`priority-${conversation.id}`} />
        ) : (
          <Badge variant="outline" className="capitalize">
            {conversation.priority}
          </Badge>
        )}

        <Popover
          align="start"
          trigger={
            <Button variant="ghost" size="sm">
              Contact info
            </Button>
          }
        >
          <div className="grid gap-1.5 text-sm">
            {customer.email ? (
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="size-3.5" />
                {customer.email}
              </p>
            ) : null}
            {customer.phone ? (
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="size-3.5" />
                {customer.phone}
              </p>
            ) : null}
            {customer.address ? (
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-3.5" />
                {customer.address}
              </p>
            ) : null}
            {!customer.email && !customer.phone && !customer.address ? <p className="text-muted-foreground">No contact details on file.</p> : null}
          </div>
        </Popover>
      </div>
    </div>
  );
}
