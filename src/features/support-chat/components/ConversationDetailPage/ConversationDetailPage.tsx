"use client";

import Link from "next/link";
import { ArrowLeft, Check, Send, UserPlus } from "lucide-react";
import { Badge, Button, ErrorState, LoadingState, PageContainer, PageHeader, Textarea } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useConversationDetailPage } from "@/features/support-chat/components/ConversationDetailPage/useConversationDetailPage";
import { MessageBubble } from "@/features/support-chat/components/ConversationDetailPage/MessageBubble";

export function ConversationDetailPage({ conversationId }: { conversationId: string }) {
  const { t } = useAppTranslation();
  const { conversationQuery, conversation, isOwnedByMe, assignToMe, isAssigning, closeConversation, isClosing, draft, setDraft, sendMessage, isSending } =
    useConversationDetailPage(conversationId);

  if (conversationQuery.isLoading) return <LoadingState />;
  if (conversationQuery.isError || !conversation) return <ErrorState onRetry={() => conversationQuery.refetch()} />;

  return (
    <PageContainer>
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Link href="/support/conversations" className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          {t("supportChat.back", "Back to conversations")}
        </Link>

        <PageHeader
          title={conversation.customerName}
          description={conversation.customerEmail}
          actions={
            conversation.status === "closed" ? (
              <Badge variant="outline">{t("supportChat.closed", "Closed")}</Badge>
            ) : conversation.status === "unassigned" ? (
              <Button size="sm" onClick={assignToMe} loading={isAssigning}>
                <UserPlus className="mr-1.5 size-3.5" />
                {t("supportChat.assignToMe", "Assign to me")}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{t("supportChat.ownedBy", `Owned by ${conversation.assignedAgentName}`)}</Badge>
                {isOwnedByMe ? (
                  <Button size="sm" variant="outline" onClick={closeConversation} loading={isClosing}>
                    <Check className="mr-1.5 size-3.5" />
                    {t("supportChat.close", "Close")}
                  </Button>
                ) : null}
              </div>
            )
          }
        />

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        {conversation.status !== "closed" ? (
          <div className="flex flex-col gap-2">
            {!isOwnedByMe ? (
              <p className="text-xs text-muted-foreground">
                {conversation.status === "unassigned"
                  ? t("supportChat.assignFirst", "Assign this conversation to yourself before replying.")
                  : t("supportChat.ownedByOther", "This conversation is owned by another agent.")}
              </p>
            ) : null}
            <Textarea
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t("supportChat.composerPlaceholder", "Type a reply…")}
              disabled={!isOwnedByMe}
            />
            <Button onClick={sendMessage} loading={isSending} disabled={!isOwnedByMe || !draft.trim()} className="self-end">
              <Send className="mr-1.5 size-3.5" />
              {t("supportChat.send", "Send")}
            </Button>
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}
