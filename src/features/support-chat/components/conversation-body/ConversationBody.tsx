"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button, SkeletonList } from "@novacore/frontend-next-shadcn";

import { MessageBubble } from "@/features/support-chat/components/conversation-body/MessageBubble";
import type { ConversationMessage } from "@/services/support-chat";

const GROUP_WINDOW_MS = 5 * 60_000;
const NEAR_BOTTOM_PX = 150;

function shouldShowSender(messages: ConversationMessage[], index: number) {
  const current = messages[index];
  const previous = messages[index - 1];
  if (!previous) return true;
  if (previous.senderType !== current.senderType || previous.senderUserId !== current.senderUserId) return true;
  return new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime() > GROUP_WINDOW_MS;
}

/**
 * No "load older messages" affordance — Chat Service has no REST message-history endpoint, only
 * `ChatHub.RecoverMessages` (capped at 200, see `useConversationDetailPane`'s doc comment), so
 * there is nothing further back to fetch. A conversation past that cap simply has no way to show
 * anything older right now; that's a backend gap, not something this component works around.
 */
export function ConversationBody({ conversationId, messages, isLoading, myMessageIds }: { conversationId: string; messages: ConversationMessage[]; isLoading: boolean; myMessageIds: Set<string> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const isFirstLoadRef = useRef(true);
  const [hasNewBelow, setHasNewBelow] = useState(false);

  useEffect(() => {
    isFirstLoadRef.current = true;
    prevMessageCountRef.current = 0;
    setHasNewBelow(false);
  }, [conversationId]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isFirstLoadRef.current && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
      isFirstLoadRef.current = false;
    } else if (messages.length > prevMessageCountRef.current) {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      if (distanceFromBottom < NEAR_BOTTOM_PX) container.scrollTop = container.scrollHeight;
      else setHasNewBelow(true);
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  function scrollToBottom() {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    setHasNewBelow(false);
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={containerRef} className="h-full overflow-y-auto px-4 py-3">
        {isLoading ? (
          <SkeletonList rows={4} />
        ) : messages.length >= 200 ? (
          <p className="pb-2 text-center text-[11px] text-muted-foreground">Showing the most recent 200 messages — earlier history isn&apos;t available yet.</p>
        ) : null}
        {!isLoading ? (
          <div className="flex flex-col gap-1.5">
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} isMine={myMessageIds.has(message.id)} showSender={shouldShowSender(messages, index)} />
            ))}
          </div>
        ) : null}
      </div>

      {hasNewBelow ? (
        <Button size="sm" onClick={scrollToBottom} className="absolute bottom-3 left-1/2 -translate-x-1/2 shadow-md">
          <ArrowDown className="mr-1.5 size-3.5" />
          New messages
        </Button>
      ) : null}
    </div>
  );
}
