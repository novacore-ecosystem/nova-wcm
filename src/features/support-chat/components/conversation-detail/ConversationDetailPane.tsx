"use client";

import { MessageSquareDashed } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@novacore/frontend-next-shadcn";

import { ConversationHeader } from "@/features/support-chat/components/conversation-header/ConversationHeader";
import { ConversationBody } from "@/features/support-chat/components/conversation-body/ConversationBody";
import { MessageComposer } from "@/features/support-chat/components/message-composer/MessageComposer";
import { HandoverDialog } from "@/features/support-chat/components/handover/HandoverDialog";
import { useConversationDetailPane } from "@/features/support-chat/components/conversation-detail/useConversationDetailPane";

function composerDisabledReason(conversation: { status: string; assignedAgentName?: string }, isOwnedByMe: boolean): string | undefined {
  if (conversation.status === "closed") return "This conversation is closed.";
  if (!isOwnedByMe && conversation.status === "assigned") return `Owned by ${conversation.assignedAgentName} — you can't reply here.`;
  return undefined;
}

export function ConversationDetailPane({ conversationId, onAutoAssigned }: { conversationId: string | null; onAutoAssigned: (id: string) => void }) {
  const {
    conversationQuery,
    conversation,
    isOwnedByMe,
    canReply,
    sendMessage,
    isSending,
    changePriority,
    closeConversation,
    handoverOpen,
    setHandoverOpen,
    submitHandover,
    isSubmittingHandover,
    agents,
    enableAiMode,
    disableAiMode,
    isSavingAiMode,
  } = useConversationDetailPane(conversationId, onAutoAssigned);

  if (!conversationId) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState icon={<MessageSquareDashed className="h-8 w-8" />} title="Select a conversation" description="Choose a conversation from the list to start viewing it." />
      </div>
    );
  }

  if (conversationQuery.isLoading) return <LoadingState />;
  if (conversationQuery.isError || !conversation) return <ErrorState onRetry={() => conversationQuery.refetch()} />;

  return (
    <div className="flex h-full min-w-0 flex-col">
      <ConversationHeader
        conversation={conversation}
        isOwnedByMe={isOwnedByMe}
        onChangePriority={changePriority}
        onRequestHandover={() => setHandoverOpen(true)}
        onClose={closeConversation}
        onEnableAiMode={enableAiMode}
        onDisableAiMode={disableAiMode}
        isSavingAiMode={isSavingAiMode}
      />
      <ConversationBody conversationId={conversation.id} />
      <MessageComposer disabled={!canReply} disabledReason={composerDisabledReason(conversation, isOwnedByMe)} onSend={sendMessage} isSending={isSending} />
      <HandoverDialog open={handoverOpen} onOpenChange={setHandoverOpen} agents={agents.filter((agent) => agent.id !== conversation.assignedAgentId)} onSubmit={submitHandover} isSubmitting={isSubmittingHandover} />
    </div>
  );
}
