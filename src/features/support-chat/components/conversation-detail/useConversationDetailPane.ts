"use client";

import { useState } from "react";

import {
  useAgentsQuery,
  useCloseConversationMutation,
  useConversationQuery,
  useRequestHandoverMutation,
  useSendMessageMutation,
  useSetAiModeMutation,
  useSetPriorityMutation,
} from "@/features/support-chat/api/support-chat.queries";
import { useSessionStore } from "@/shared/stores/session.store";
import type { AiModeFormValues, HandoverRequestFormValues } from "@/features/support-chat/support-chat.schema";
import type { ConversationPriority } from "@/services/support-chat";

/** Owns everything the right pane needs for whichever conversation is currently opened. Knows nothing about the left pane's tab/search state. */
export function useConversationDetailPane(conversationId: string | null, onAutoAssigned: (id: string) => void) {
  const conversationQuery = useConversationQuery(conversationId);
  const currentUser = useSessionStore((state) => state.user);
  const agentsQuery = useAgentsQuery();

  const sendMutation = useSendMessageMutation();
  const priorityMutation = useSetPriorityMutation();
  const closeMutation = useCloseConversationMutation();
  const handoverMutation = useRequestHandoverMutation();
  const aiModeMutation = useSetAiModeMutation();

  const [handoverOpen, setHandoverOpen] = useState(false);

  const conversation = conversationQuery.data;
  const isOwnedByMe = !!conversation && !!currentUser && conversation.assignedAgentId === currentUser.id;
  const isUnassigned = conversation?.status === "unassigned";
  const canReply = !!conversation && conversation.status !== "closed" && (isUnassigned || isOwnedByMe);

  async function sendMessage(body: string) {
    if (!conversation || !currentUser) return;
    const result = await sendMutation.mutateAsync({ conversationId: conversation.id, agentId: currentUser.id, agentName: currentUser.name, body });
    if (result.autoAssigned) onAutoAssigned(conversation.id);
  }

  function changePriority(priority: ConversationPriority) {
    if (!conversation) return;
    priorityMutation.mutate({ id: conversation.id, priority });
  }

  function closeConversation() {
    if (!conversation) return;
    closeMutation.mutate(conversation.id);
  }

  function submitHandover(values: HandoverRequestFormValues) {
    if (!conversation || !currentUser) return;
    const agent = agentsQuery.data?.find((candidate) => candidate.id === values.toAgentId);
    if (!agent) return;
    handoverMutation.mutate(
      { conversationId: conversation.id, fromAgentId: currentUser.id, fromAgentName: currentUser.name, toAgentId: agent.id, toAgentName: agent.name, reason: values.reason || undefined },
      { onSuccess: () => setHandoverOpen(false) },
    );
  }

  function enableAiMode(values: AiModeFormValues) {
    if (!conversation) return;
    aiModeMutation.mutate({ id: conversation.id, config: { state: "holding", skills: values.skills, context: values.context || undefined, enabledAt: new Date().toISOString() } });
  }

  function disableAiMode() {
    if (!conversation) return;
    aiModeMutation.mutate({ id: conversation.id, config: { state: "disabled", skills: [] } });
  }

  return {
    conversationQuery,
    conversation,
    isOwnedByMe,
    canReply,
    sendMessage,
    isSending: sendMutation.isPending,
    changePriority,
    closeConversation,
    isClosing: closeMutation.isPending,
    handoverOpen,
    setHandoverOpen,
    submitHandover,
    isSubmittingHandover: handoverMutation.isPending,
    agents: agentsQuery.data ?? [],
    enableAiMode,
    disableAiMode,
    isSavingAiMode: aiModeMutation.isPending,
  };
}
