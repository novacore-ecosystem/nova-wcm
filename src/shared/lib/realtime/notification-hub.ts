import * as signalR from "@microsoft/signalr";

import { env } from "@/shared/lib/env";
import { mapNotification, type RawNotificationDto } from "@/services/notification/notification.mappers";
import type { NotificationEvent } from "@/services/notification/notification.types";

/**
 * Single module-level connection to `GlobalHub` (`/hubs/global` on Notification.API) — one
 * WebSocket for the whole admin session, not one per page (mirrors `chat-hub.ts`). Auth rides
 * the same `AccessToken` httpOnly cookie every REST call uses (`withCredentials: true` below).
 * No `JoinX`/`LeaveX` call is needed here: `GlobalHub.OnConnectedAsync` auto-joins the caller's
 * Root/Admin/Member + tenant SignalR groups from the JWT's role claims server-side, so simply
 * connecting is enough to start receiving this user's pushes. The hub also carries `OrderCreated`/
 * `OrderStatusUpdated` events for Order Service's own admin/customer flows — irrelevant to WCM's
 * domain, deliberately not exposed here.
 */
let connection: signalR.HubConnection | null = null;
let startPromise: Promise<void> | null = null;

function getConnection(): signalR.HubConnection {
  connection ??= new signalR.HubConnectionBuilder().withUrl(env.notificationHubUrl, { withCredentials: true }).withAutomaticReconnect().build();
  return connection;
}

export async function ensureNotificationHubStarted(): Promise<signalR.HubConnection> {
  const conn = getConnection();
  if (conn.state === signalR.HubConnectionState.Connected) return conn;
  startPromise ??= conn.start().finally(() => {
    startPromise = null;
  });
  await startPromise;
  return conn;
}

/** Called once the session ends (logout / unauthenticated) — scopes the connection to an active login. */
export async function stopNotificationHub(): Promise<void> {
  if (startPromise) await startPromise.catch(() => undefined);
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) await connection.stop();
}

/** `GlobalHub.MarkNotificationAsRead` */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const conn = await ensureNotificationHubStarted();
  await conn.invoke("MarkNotificationAsRead", notificationId);
}

/** `IGlobalHubBase.ReceiveNotification` — pushed only to the caller's own `member:{userId}` group. */
export function onReceiveNotification(handler: (notification: NotificationEvent) => void): () => void {
  const conn = getConnection();
  const wrapped = (raw: RawNotificationDto) => handler(mapNotification(raw));
  conn.on("ReceiveNotification", wrapped);
  return () => conn.off("ReceiveNotification", wrapped);
}

/**
 * `IGlobalHubBase.BootstrapVersionChanged` — backend foundation for a future "tenant bootstrap
 * data changed, refetch" flow (see the backend's doc comment on `GlobalHub.BootstrapVersionChanged`).
 * No client-side refetch orchestration exists yet; exposed so a future feature can subscribe
 * without touching this module.
 */
export function onBootstrapVersionChanged(handler: (version: number) => void): () => void {
  const conn = getConnection();
  conn.on("BootstrapVersionChanged", handler);
  return () => conn.off("BootstrapVersionChanged", handler);
}

/** `IAppHub.UserKicked` — the server aborts the connection immediately after sending this. */
export function onUserKicked(handler: () => void): () => void {
  const conn = getConnection();
  conn.on("UserKicked", handler);
  return () => conn.off("UserKicked", handler);
}
