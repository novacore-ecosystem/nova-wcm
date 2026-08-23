"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { conversationKeys, useClaimConversationMutation, useCloseConversationMutation, useConversationDetailQuery } from "@/features/support-chat/api/support-chat.queries";
import { useChatOwnershipStore } from "@/shared/stores/chat-ownership.store";
import { joinConversation, leaveConversation, onConversationClosed, onReceiveMessage, onUserStoppedTyping, onUserTyping, recoverMessages, startTyping, stopTyping } from "@/shared/lib/realtime/chat-hub";
import { mapMessage, supportChatService } from "@/services/support-chat/support-chat.service";
import type { AiModeFormValues } from "@/features/support-chat/support-chat.schema";
import type { AiModeConfig, ConversationMessage } from "@/services/support-chat";

function noAiMode(): AiModeConfig {
  return { state: "disabled", skills: [] };
}

/**
 * Owns everything the right pane needs for whichever conversation is currently opened.
 *
 * Messages are NOT TanStack Query state — Chat Service has no REST list-messages endpoint (see
 * the backend audit), only `ChatHub.RecoverMessages` (capped at 200, live-connection only). So
 * this hook: joins the conversation's SignalR group, calls `RecoverMessages(id, 0)` once to
 * hydrate, then keeps the list in sync purely from the `ReceiveMessage` push (which the backend
 * also sends back to the sender — see `sendMessage`'s doc comment — so the REST send call itself
 * never appends a message, only the event does).
 *
 * "Mine" bubble styling can't reliably compare `senderUserId` to the signed-in user's id: no
 * real `/me` endpoint exists yet, so `getCurrentUser()` returns a fixed dev-adapter stub, not the
 * real authenticated GUID (see `services/auth/getCurrentUser.dev-adapter.ts`). Instead this
 * tracks the ids of messages *this session actually sent* — correct for the current session,
 * honest best-effort for history loaded from elsewhere.
 */
export function useConversationDetailPane(conversationId: string | null) {
  const conversationQuery = useConversationDetailQuery(conversationId);
  const ownedIds = useChatOwnershipStore((state) => state.ownedConversationIds);
  const queryClient = useQueryClient();

  const claimMutation = useClaimConversationMutation();
  const closeMutation = useCloseConversationMutation();

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [typingUserIds, setTypingUserIds] = useState<Set<string>>(new Set());
  const [myMessageIds, setMyMessageIds] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [aiMode, setAiMode] = useState<AiModeConfig>(noAiMode());

  useEffect(() => {
    setMessages([]);
    setTypingUserIds(new Set());
    setMyMessageIds(new Set());
    setAiMode(noAiMode());
    if (!conversationId) return;

    let cancelled = false;
    setIsLoadingMessages(true);
    joinConversation(conversationId)
      .then(() => recoverMessages(conversationId, 0))
      .then((history) => {
        if (!cancelled) setMessages(history);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoadingMessages(false);
      });

    const offReceive = onReceiveMessage((raw) => {
      if (raw.conversationId !== conversationId) return;
      const message = mapMessage(raw);
      setMessages((current) => (current.some((existing) => existing.id === message.id) ? current : [...current, message]));
    });
    const offClosed = onConversationClosed((closedConversationId) => {
      if (closedConversationId !== conversationId) return;
      queryClient.invalidateQueries({ queryKey: conversationKeys.detail(closedConversationId) });
    });
    const offTyping = onUserTyping((typingConversationId, userId) => {
      if (typingConversationId !== conversationId) return;
      setTypingUserIds((current) => new Set(current).add(userId));
    });
    const offStoppedTyping = onUserStoppedTyping((typingConversationId, userId) => {
      if (typingConversationId !== conversationId) return;
      setTypingUserIds((current) => {
        const next = new Set(current);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      cancelled = true;
      offReceive();
      offClosed();
      offTyping();
      offStoppedTyping();
      void leaveConversation(conversationId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const conversation = conversationQuery.data;
  const isOwnedByMe = !!conversationId && ownedIds.includes(conversationId);
  const canReply = !!conversation && conversation.status !== "closed" && isOwnedByMe;
  const needsClaim = !!conversation && conversation.status !== "closed" && !isOwnedByMe;

  async function sendMessage(content: string) {
    if (!conversationId || !canReply) return;
    setIsSending(true);
    try {
      const { messageId } = await supportChatService.sendMessage(conversationId, content);
      setMyMessageIds((current) => new Set(current).add(messageId));
      void stopTyping(conversationId);
    } finally {
      setIsSending(false);
    }
  }

  function claimConversation() {
    if (!conversationId) return;
    claimMutation.mutate(conversationId);
  }

  function closeConversation() {
    if (!conversationId) return;
    closeMutation.mutate(conversationId);
  }

  function notifyTyping() {
    if (conversationId && canReply) void startTyping(conversationId);
  }

  function notifyStoppedTyping() {
    if (conversationId && canReply) void stopTyping(conversationId);
  }

  function enableAiMode(values: AiModeFormValues) {
    setAiMode({ state: "holding", skills: values.skills, context: values.context || undefined, enabledAt: new Date().toISOString() });
  }

  function disableAiMode() {
    setAiMode(noAiMode());
  }

  return {
    conversationQuery,
    conversation,
    isOwnedByMe,
    canReply,
    needsClaim,
    messages,
    isLoadingMessages,
    typingCount: typingUserIds.size,
    myMessageIds,
    sendMessage,
    isSending,
    notifyTyping,
    notifyStoppedTyping,
    claimConversation,
    isClaiming: claimMutation.isPending,
    closeConversation,
    isClosing: closeMutation.isPending,
    aiMode,
    enableAiMode,
    disableAiMode,
  };
}
