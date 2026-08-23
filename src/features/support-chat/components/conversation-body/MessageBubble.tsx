"use client";

import { Bot, Info } from "lucide-react";
import { cn } from "@novacore/frontend-next-shadcn";

import type { ConversationMessage } from "@/services/support-chat";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/**
 * `senderType: "user"` covers both a guest/customer and staff — the wire model doesn't
 * distinguish them (see `Message.SenderType`/`Message.SenderUserId` in the backend audit; there's
 * no per-conversation Contact lookup to tell them apart by id either). `isMine` is the best
 * available signal (messages this browser session actually sent, see
 * `useConversationDetailPane`'s doc comment) — anything else renders as a generic "other" bubble,
 * which in practice is almost always the customer.
 */
export function MessageBubble({ message, isMine, showSender }: { message: ConversationMessage; isMine: boolean; showSender: boolean }) {
  if (message.senderType === "system" || message.senderType === "service") {
    return (
      <div className="flex items-center justify-center gap-1.5 py-1 text-xs text-muted-foreground">
        <Info className="size-3" />
        {message.content}
      </div>
    );
  }

  const isAutomated = message.senderType === "ai" || message.senderType === "bot";
  const senderLabel = isAutomated ? (message.senderType === "ai" ? "AI" : "Bot") : isMine ? "You" : undefined;

  return (
    <div className={cn("flex flex-col gap-0.5", isMine || isAutomated ? "items-end" : "items-start")}>
      {showSender && senderLabel ? (
        <span className="flex items-center gap-1 px-1 text-[11px] font-medium text-muted-foreground">
          {isAutomated ? <Bot className="size-3" /> : null}
          {senderLabel}
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[75%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          !isMine && !isAutomated && "rounded-bl-sm bg-muted",
          isMine && "rounded-br-sm bg-primary text-primary-foreground",
          isAutomated && "rounded-br-sm border border-info/40 bg-info/10",
        )}
      >
        {message.content}
      </div>
      <span className="px-1 text-[10px] text-muted-foreground">{formatTime(message.createdAt)}</span>
    </div>
  );
}
