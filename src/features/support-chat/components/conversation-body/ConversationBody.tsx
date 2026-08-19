"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, Loader2 } from "lucide-react";
import { Button, SkeletonList } from "@novacore/frontend-next-shadcn";

import { MessageBubble } from "@/features/support-chat/components/conversation-body/MessageBubble";
import { useMessageHistoryQuery } from "@/features/support-chat/api/support-chat.queries";
import type { ConversationMessage } from "@/services/support-chat";

const GROUP_WINDOW_MS = 5 * 60_000;
const NEAR_BOTTOM_PX = 150;

function shouldShowSender(messages: ConversationMessage[], index: number) {
  const current = messages[index];
  const previous = messages[index - 1];
  if (!previous) return true;
  if (previous.sender !== current.sender || previous.senderName !== current.senderName) return true;
  return new Date(current.sentAt).getTime() - new Date(previous.sentAt).getTime() > GROUP_WINDOW_MS;
}

export function ConversationBody({ conversationId }: { conversationId: string }) {
  const query = useMessageHistoryQuery(conversationId);
  const messages = query.data?.pages.flatMap((page) => page.items) ?? [];

  const containerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number | null>(null);
  const prevMessageCountRef = useRef(0);
  const isFirstLoadRef = useRef(true);
  const [hasNewBelow, setHasNewBelow] = useState(false);

  useEffect(() => {
    isFirstLoadRef.current = true;
    prevMessageCountRef.current = 0;
    setHasNewBelow(false);
  }, [conversationId]);

  useEffect(() => {
    const node = topSentinelRef.current;
    const container = containerRef.current;
    if (!node || !container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && query.hasPreviousPage && !query.isFetchingPreviousPage) {
          prevScrollHeightRef.current = container.scrollHeight;
          void query.fetchPreviousPage();
        }
      },
      { root: container, threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.hasPreviousPage, query.isFetchingPreviousPage, query.fetchPreviousPage, conversationId]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (isFirstLoadRef.current && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
      isFirstLoadRef.current = false;
    } else if (prevScrollHeightRef.current !== null) {
      container.scrollTop += container.scrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = null;
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
        <div ref={topSentinelRef} className="flex justify-center py-2">
          {query.isFetchingPreviousPage ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
        </div>

        {query.isLoading ? (
          <SkeletonList rows={4} />
        ) : (
          <div className="flex flex-col gap-1.5">
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} showSender={shouldShowSender(messages, index)} />
            ))}
          </div>
        )}
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
