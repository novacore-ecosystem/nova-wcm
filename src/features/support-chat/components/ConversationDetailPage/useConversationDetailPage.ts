"use client";

import { useState } from "react";

import { useAssignConversationMutation, useCloseConversationMutation, useConversationQuery, useSendMessageMutation } from "@/features/support-chat/api/support-chat.queries";
import { useSessionStore } from "@/shared/stores/session.store";

export function useConversationDetailPage(conversationId: string) {
  const conversationQuery = useConversationQuery(conversationId);
  const currentUser = useSessionStore((state) => state.user);
  const assignMutation = useAssignConversationMutation();
  const closeMutation = useCloseConversationMutation();
  const sendMutation = useSendMessageMutation();
  const [draft, setDraft] = useState("");

  const conversation = conversationQuery.data;
  const isOwnedByMe = conversation?.assignedAgentId === currentUser?.id;

  async function assignToMe() {
    if (!currentUser) return;
    await assignMutation.mutateAsync({ id: conversationId, agentId: currentUser.id, agentName: currentUser.name });
  }

  async function closeConversation() {
    await closeMutation.mutateAsync(conversationId);
  }

  async function sendMessage() {
    if (!currentUser || !draft.trim()) return;
    await sendMutation.mutateAsync({ id: conversationId, senderName: currentUser.name, body: draft.trim() });
    setDraft("");
  }

  return {
    conversationQuery,
    conversation,
    currentUser,
    isOwnedByMe,
    assignToMe,
    isAssigning: assignMutation.isPending,
    closeConversation,
    isClosing: closeMutation.isPending,
    draft,
    setDraft,
    sendMessage,
    isSending: sendMutation.isPending,
  };
}
