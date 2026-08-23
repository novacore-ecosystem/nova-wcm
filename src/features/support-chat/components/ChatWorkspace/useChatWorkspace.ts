"use client";

import { useEffect, useState } from "react";

import { ensureChatHubStarted, stopChatHub } from "@/shared/lib/realtime/chat-hub";
import type { ConversationListTab } from "@/services/support-chat";

/**
 * Owns the cross-cutting UI state both panes need to coordinate on, plus the one `ChatHub`
 * connection's lifecycle — scoped to this workspace (started on mount, stopped on unmount) since
 * it's the only route in the app that needs a realtime connection.
 */
export function useChatWorkspace() {
  const [activeTab, setActiveTab] = useState<ConversationListTab>("unassigned");
  const [searchQuery, setSearchQuery] = useState("");
  const [openedConversationId, setOpenedConversationId] = useState<string | null>(null);

  useEffect(() => {
    void ensureChatHubStarted();
    return () => void stopChatHub();
  }, []);

  function openConversation(id: string) {
    setOpenedConversationId(id);
  }

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    openedConversationId,
    openConversation,
  };
}
