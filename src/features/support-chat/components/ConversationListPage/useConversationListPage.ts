"use client";

import { useState } from "react";

import { useConversationsQuery } from "@/features/support-chat/api/support-chat.queries";
import type { ConversationStatus } from "@/services/support-chat";

export type ConversationFilter = "unassigned" | "assigned" | "closed" | "all";

export function useConversationListPage() {
  const conversationsQuery = useConversationsQuery();
  const [filter, setFilter] = useState<ConversationFilter>("unassigned");

  const conversations = conversationsQuery.data ?? [];
  const counts: Record<ConversationStatus, number> = {
    unassigned: conversations.filter((c) => c.status === "unassigned").length,
    assigned: conversations.filter((c) => c.status === "assigned").length,
    closed: conversations.filter((c) => c.status === "closed").length,
  };

  const filtered = filter === "all" ? conversations : conversations.filter((c) => c.status === filter);

  return { conversationsQuery, filter, setFilter, counts, filtered };
}
