"use client";

import { useChatWorkspace } from "@/features/support-chat/components/ChatWorkspace/useChatWorkspace";
import { ConversationListPane } from "@/features/support-chat/components/conversation-list/ConversationListPane";
import { ConversationDetailPane } from "@/features/support-chat/components/conversation-detail/ConversationDetailPane";

/**
 * Two independent vertical areas: left = conversation selection (its own search/tab header),
 * right = the actual messaging workspace (its own header). No "start a new conversation" action
 * here — real conversations are only ever created by a guest (via the temporary
 * `features/guest-chat-widget`) or, eventually, an authenticated storefront customer; there's no
 * legitimate real-backend action for an admin to originate one on someone else's behalf.
 *
 * Height is derived from the admin shell's known constants (14 header + AdminPage's `p-4 md:p-6`
 * padding) rather than the shared AdminLayout/AdminPage components — changing those would affect
 * every page in the app, which is out of scope for this one workspace's layout need.
 */
export function ChatWorkspace() {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, openedConversationId, openConversation } = useChatWorkspace();

  return (
    <div className="flex h-[calc(100dvh-5.5rem)] flex-col gap-3 md:h-[calc(100dvh-6.5rem)]">
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Conversations</h1>
          <p className="text-sm text-muted-foreground">Chat with customers in real time.</p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[340px_minmax(0,1fr)]">
        <ConversationListPane
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          openedConversationId={openedConversationId}
          onSelectConversation={openConversation}
        />
        <ConversationDetailPane conversationId={openedConversationId} />
      </div>
    </div>
  );
}
