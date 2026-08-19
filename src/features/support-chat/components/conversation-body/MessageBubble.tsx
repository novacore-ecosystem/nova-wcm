"use client";

import { Bot, Info } from "lucide-react";
import { cn } from "@novacore/frontend-next-shadcn";

import type { ConversationMessage } from "@/services/support-chat";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/** Every message is visually distinguished by sender — customer/agent/AI/system are never blended into one generic bubble style. */
export function MessageBubble({ message, showSender }: { message: ConversationMessage; showSender: boolean }) {
  if (message.sender === "system") {
    return (
      <div className="flex items-center justify-center gap-1.5 py-1 text-xs text-muted-foreground">
        <Info className="size-3" />
        {message.body}
      </div>
    );
  }

  const isCustomer = message.sender === "customer";

  return (
    <div className={cn("flex flex-col gap-0.5", isCustomer ? "items-start" : "items-end")}>
      {showSender && !isCustomer ? (
        <span className="flex items-center gap-1 px-1 text-[11px] font-medium text-muted-foreground">
          {message.sender === "ai" ? <Bot className="size-3" /> : null}
          {message.senderName ?? (message.sender === "ai" ? "AI" : "")}
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[75%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          isCustomer && "rounded-bl-sm bg-muted",
          message.sender === "agent" && "rounded-br-sm bg-primary text-primary-foreground",
          message.sender === "ai" && "rounded-br-sm border border-info/40 bg-info/10",
        )}
      >
        {message.body}
      </div>
      <span className="px-1 text-[10px] text-muted-foreground">{formatTime(message.sentAt)}</span>
    </div>
  );
}
