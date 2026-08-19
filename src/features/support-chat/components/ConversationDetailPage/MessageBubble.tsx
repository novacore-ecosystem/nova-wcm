"use client";

import { Bot, Info } from "lucide-react";
import { cn, RelativeTime } from "@novacore/frontend-next-shadcn";

import type { ConversationMessage } from "@/services/support-chat";

/** Every message is visually distinguished by sender — customer/agent/AI/system — never blended, per §13. */
export function MessageBubble({ message }: { message: ConversationMessage }) {
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
    <div className={cn("flex flex-col gap-1", isCustomer ? "items-start" : "items-end")}>
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 text-sm",
          isCustomer && "bg-muted",
          message.sender === "agent" && "bg-primary text-primary-foreground",
          message.sender === "ai" && "border border-info/40 bg-info/10",
        )}
      >
        {message.sender === "ai" ? (
          <p className="mb-1 flex items-center gap-1 text-xs font-medium text-info">
            <Bot className="size-3" />
            AI
          </p>
        ) : null}
        {message.body}
      </div>
      <span className="px-1 text-[11px] text-muted-foreground">
        {message.senderName ? `${message.senderName} · ` : ""}
        <RelativeTime date={message.sentAt} />
      </span>
    </div>
  );
}
