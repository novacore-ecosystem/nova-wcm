import * as signalR from "@microsoft/signalr";

import { env } from "@/shared/lib/env";
import { mapMessage, type RawChatMessageDto } from "@/services/support-chat/support-chat.service";
import type { ConversationMessage } from "@/services/support-chat/support-chat.types";

/**
 * Single module-level connection to `ChatHub` (`/hubs/chat`) — one WebSocket for the whole app,
 * not one per conversation. Auth rides the same `AccessToken` httpOnly cookie every REST call
 * uses (`withCredentials: true` below); Chat.API's JWT pipeline only special-cases that cookie,
 * not the `access_token` query string SignalR's `accessTokenFactory` would otherwise append for
 * WebSocket transport — see the backend audit's auth-transport note. Only meant for the admin
 * ChatWorkspace; the temporary guest widget never opens a hub connection (guest doesn't read
 * the conversation, see `features/guest-chat-widget`'s doc comment).
 */
let connection: signalR.HubConnection | null = null;
let startPromise: Promise<void> | null = null;

function getConnection(): signalR.HubConnection {
  connection ??= new signalR.HubConnectionBuilder().withUrl(env.chatHubUrl, { withCredentials: true }).withAutomaticReconnect().build();
  return connection;
}

export async function ensureChatHubStarted(): Promise<signalR.HubConnection> {
  const conn = getConnection();
  if (conn.state === signalR.HubConnectionState.Connected) return conn;
  startPromise ??= conn.start().finally(() => {
    startPromise = null;
  });
  await startPromise;
  return conn;
}

/** Called on `ChatWorkspace` unmount — scopes the connection to the one route that needs it. */
export async function stopChatHub(): Promise<void> {
  if (startPromise) await startPromise.catch(() => undefined);
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) await connection.stop();
}

/** `ChatHub.JoinConversation` — no membership check on the backend yet (documented gap), any authenticated/guest caller can join any conversation's group by id. */
export async function joinConversation(conversationId: string): Promise<void> {
  const conn = await ensureChatHubStarted();
  await conn.invoke("JoinConversation", conversationId);
}

export async function leaveConversation(conversationId: string): Promise<void> {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) return;
  await connection.invoke("LeaveConversation", conversationId);
}

/**
 * `ChatHub.RecoverMessages` — the *only* message-retrieval path (no REST history endpoint
 * exists). `afterSequence: 0` doubles as "initial load" and "resume after reconnect"; capped
 * server-side at 200 messages. A conversation with more than 200 messages has no way to load
 * anything earlier than that cap today — this is a backend gap, not a paging bug here.
 */
export async function recoverMessages(conversationId: string, afterSequence: number): Promise<ConversationMessage[]> {
  const conn = await ensureChatHubStarted();
  const raw = await conn.invoke<RawChatMessageDto[]>("RecoverMessages", conversationId, afterSequence);
  return raw.map(mapMessage);
}

export async function startTyping(conversationId: string): Promise<void> {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) return;
  await connection.invoke("StartTyping", conversationId);
}

export async function stopTyping(conversationId: string): Promise<void> {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) return;
  await connection.invoke("StopTyping", conversationId);
}

/** `IChatHubClient.ReceiveMessage` — pushed to the whole group including the sender; the REST send response is not the source of truth, this event is (see `support-chat.service.ts`'s `sendMessage` doc comment). */
export function onReceiveMessage(handler: (message: RawChatMessageDto) => void): () => void {
  const conn = getConnection();
  conn.on("ReceiveMessage", handler);
  return () => conn.off("ReceiveMessage", handler);
}

/** `IChatHubClient.ConversationClosed` */
export function onConversationClosed(handler: (conversationId: string, closedAt: string) => void): () => void {
  const conn = getConnection();
  conn.on("ConversationClosed", handler);
  return () => conn.off("ConversationClosed", handler);
}

/** `IChatHubClient.UserTyping` / `UserStoppedTyping` — sent only to `OthersInGroup`, never echoed back to the typist. */
export function onUserTyping(handler: (conversationId: string, userId: string) => void): () => void {
  const conn = getConnection();
  conn.on("UserTyping", handler);
  return () => conn.off("UserTyping", handler);
}

export function onUserStoppedTyping(handler: (conversationId: string, userId: string) => void): () => void {
  const conn = getConnection();
  conn.on("UserStoppedTyping", handler);
  return () => conn.off("UserStoppedTyping", handler);
}
