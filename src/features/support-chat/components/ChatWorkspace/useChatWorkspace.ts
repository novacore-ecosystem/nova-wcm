"use client";

import { useState } from "react";

import type { ConversationListTab } from "@/services/support-chat";

/**
 * Owns only the cross-cutting UI state that both panes need to coordinate on:
 * - `activeTab`/`searchQuery` drive the left list's query.
 * - `openedConversationId` drives the right pane — deliberately independent of `activeTab`, so
 *   switching the left filter never resets what's open on the right (see `openConversation` vs.
 *   `activeTab` below: nothing here ever derives one from the other).
 *
 * Everything else (message history, composer draft, per-conversation mutations) lives in the
 * component that actually owns that concern, not here.
 */
export function useChatWorkspace() {
  const [activeTab, setActiveTab] = useState<ConversationListTab>("unassigned");
  const [searchQuery, setSearchQuery] = useState("");
  const [openedConversationId, setOpenedConversationId] = useState<string | null>(null);

  function openConversation(id: string) {
    setOpenedConversationId(id);
  }

  /** Called after a reply auto-assigns a previously-unassigned conversation: switch the list filter to Assigned and keep the same conversation focused — one natural transition, not a manual multi-step flow. */
  function focusAfterAutoAssign(id: string) {
    setActiveTab("assigned");
    setOpenedConversationId(id);
  }

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    openedConversationId,
    openConversation,
    focusAfterAutoAssign,
  };
}
