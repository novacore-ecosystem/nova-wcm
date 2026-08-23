"use client";

import { MessageSquareDashed } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@novacore/frontend-next-shadcn";

import { ConversationHeader } from "@/features/support-chat/components/conversation-header/ConversationHeader";
import { ConversationBody } from "@/features/support-chat/components/conversation-body/ConversationBody";
import { MessageComposer } from "@/features/support-chat/components/message-composer/MessageComposer";
import { useConversationDetailPane } from "@/features/support-chat/components/conversation-detail/useConversationDetailPane";

function composerDisabledReason(needsClaim: boolean, isClosed: boolean): string | undefined {
  if (isClosed) return "This conversation is closed.";
  if (needsClaim) return "Claim this conversation before replying.";
  return undefined;
}

export function ConversationDetailPane({ conversationId }: { conversationId: string | null }) {
  const {
    conversationQuery,
    conversation,
    isOwnedByMe,
    canReply,
    needsClaim,
    messages,
    isLoadingMessages,
    typingCount,
    myMessageIds,
    sendMessage,
    isSending,
    notifyTyping,
    notifyStoppedTyping,
    claimConversation,
    isClaiming,
    closeConversation,
    isClosing,
    aiMode,
    enableAiMode,
    disableAiMode,
  } = useConversationDetailPane(conversationId);

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
        needsClaim={needsClaim}
        onClaim={claimConversation}
        isClaiming={isClaiming}
        onClose={closeConversation}
        isClosing={isClosing}
        aiMode={aiMode}
        onEnableAiMode={enableAiMode}
        onDisableAiMode={disableAiMode}
      />
      <ConversationBody conversationId={conversation.id} messages={messages} isLoading={isLoadingMessages} myMessageIds={myMessageIds} />
      {typingCount > 0 ? <p className="px-4 pb-1 text-xs italic text-muted-foreground">Someone is typing…</p> : null}
      <MessageComposer
        disabled={!canReply}
        disabledReason={composerDisabledReason(needsClaim, conversation.status === "closed")}
        onSend={sendMessage}
        isSending={isSending}
        onTyping={notifyTyping}
        onStopTyping={notifyStoppedTyping}
      />
    </div>
  );
}
