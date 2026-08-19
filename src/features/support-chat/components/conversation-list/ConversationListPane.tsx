"use client";

import { useEffect, useRef } from "react";
import { Loader2, MessagesSquare } from "lucide-react";
import { Badge, cn, EmptyState, SearchInput, SkeletonList } from "@novacore/frontend-next-shadcn";

import { ConversationListItem } from "@/features/support-chat/components/conversation-list/ConversationListItem";
import { HandoverInboxBanner } from "@/features/support-chat/components/conversation-list/HandoverInboxBanner";
import { useConversationListPane } from "@/features/support-chat/components/conversation-list/useConversationListPane";
import type { ConversationListTab } from "@/services/support-chat";

export function ConversationListPane({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  openedConversationId,
  onSelectConversation,
}: {
  activeTab: ConversationListTab;
  onTabChange: (tab: ConversationListTab) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  openedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}) {
  const { listQuery, items, handovers, acceptHandover, rejectHandover, busyHandoverId } = useConversationListPane(activeTab, searchQuery);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = listQuery;

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex h-full min-w-0 flex-col border-r border-border">
      <div className="flex shrink-0 flex-col gap-3 border-b border-border p-3">
        <SearchInput value={searchQuery} onValueChange={onSearchChange} placeholder="Search conversations…" />
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {(["unassigned", "assigned"] as ConversationListTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "unassigned" ? (
        <HandoverInboxBanner conversations={handovers} onAccept={acceptHandover} onReject={rejectHandover} busyId={busyHandoverId} />
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {listQuery.isLoading ? (
          <SkeletonList rows={5} />
        ) : items.length === 0 ? (
          <EmptyState icon={<MessagesSquare className="h-8 w-8" />} title={searchQuery ? "No matches" : `No ${activeTab} conversations`} />
        ) : (
          <div className="flex flex-col gap-1">
            {items.map((conversation) => (
              <ConversationListItem key={conversation.id} conversation={conversation} isOpen={conversation.id === openedConversationId} onSelect={() => onSelectConversation(conversation.id)} />
            ))}
            <div ref={sentinelRef} className="flex items-center justify-center py-3">
              {listQuery.isFetchingNextPage ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
              {!listQuery.hasNextPage && items.length > 0 ? <Badge variant="outline">All caught up</Badge> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
