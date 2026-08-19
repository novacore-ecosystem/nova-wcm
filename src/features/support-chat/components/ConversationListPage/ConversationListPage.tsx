"use client";

import Link from "next/link";
import { Bot, MessagesSquare, User } from "lucide-react";
import { Badge, cn, EmptyState, PageContainer, PageHeader, RelativeTime, SkeletonList } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useConversationListPage, type ConversationFilter } from "@/features/support-chat/components/ConversationListPage/useConversationListPage";
import type { Conversation } from "@/services/support-chat";

function lastMessage(conversation: Conversation) {
  return conversation.messages[conversation.messages.length - 1];
}

export function ConversationListPage() {
  const { t } = useAppTranslation();
  const { conversationsQuery, filter, setFilter, counts, filtered } = useConversationListPage();

  const tabs: { value: ConversationFilter; label: string; count?: number }[] = [
    { value: "unassigned", label: t("supportChat.unassigned", "Unassigned pool"), count: counts.unassigned },
    { value: "assigned", label: t("supportChat.assigned", "Assigned"), count: counts.assigned },
    { value: "closed", label: t("supportChat.closed", "Closed"), count: counts.closed },
    { value: "all", label: t("supportChat.all", "All") },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("supportChat.title", "Customer conversations")}
          description={t("supportChat.description", "Pick a conversation from the unassigned pool, or continue one already assigned to you.")}
        />

        <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === tab.value ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent",
              )}
            >
              {tab.label}
              {tab.count !== undefined ? <Badge variant="outline">{tab.count}</Badge> : null}
            </button>
          ))}
        </div>

        {conversationsQuery.isLoading ? (
          <SkeletonList rows={4} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<MessagesSquare className="h-8 w-8" />} title={t("supportChat.empty", "No conversations here")} />
        ) : (
          <div className="grid gap-2">
            {filtered.map((conversation) => {
              const last = lastMessage(conversation);
              return (
                <Link
                  key={conversation.id}
                  href={`/support/conversations/${conversation.id}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{conversation.customerName}</p>
                      {conversation.unreadCount > 0 ? <Badge>{conversation.unreadCount}</Badge> : null}
                      {last?.sender === "ai" ? (
                        <Badge variant="info" className="flex items-center gap-1">
                          <Bot className="size-3" />
                          AI
                        </Badge>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{last?.body}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
                    {last ? <RelativeTime date={last.sentAt} /> : null}
                    {conversation.status === "assigned" ? (
                      <Badge variant="secondary">{conversation.assignedAgentName}</Badge>
                    ) : conversation.status === "closed" ? (
                      <Badge variant="outline">{t("supportChat.closed", "Closed")}</Badge>
                    ) : (
                      <Badge variant="warning">{t("supportChat.unassignedBadge", "Unassigned")}</Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
