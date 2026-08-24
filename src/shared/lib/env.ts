const DEFAULT_API_BASE_URL = "http://localhost:5000/api";

/** Strips a trailing `/api` (or `/api/`) so a hub URL can be built off the gateway's bare origin. */
function gatewayOrigin(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/api\/?$/, "");
}

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  /**
   * nova-wcm's TenantClient public key (X-Tenant-Client-Key header). Deployment config, not a
   * per-user secret — see .env.example and docs/plan.md's auth note.
   */
  tenantClientKey: process.env.NEXT_PUBLIC_TENANT_CLIENT_KEY ?? "",
  /**
   * `ChatHub`'s SignalR endpoint. The YARP gateway forwards hub routes at their untouched path
   * (no `/api` prefix — stripping would 404 the negotiate/connect handshake, see the gateway's
   * own `IsSignalRHub` transform), so this is derived off the gateway's bare origin plus the
   * Chat service's hub route (`ChatHub.Path` in Chat.Infrastructure), not off `apiBaseUrl`.
   */
  chatHubUrl: process.env.NEXT_PUBLIC_CHAT_HUB_URL ?? `${gatewayOrigin(process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL)}/hubs/chat`,
  /**
   * `GlobalHub`'s SignalR endpoint (Notification service). Unlike `chatHubUrl`, this is derived
   * off the gateway's own `/ws/v1/notification/` route rather than the bare origin: the gateway
   * only skips its path-stripping transform when a route's *configured* Path contains the literal
   * `/hubs` segment (see YarpApiGateway's `IsSignalRHub`/`BuildRoutes`), and the `NotificationHub`
   * route's Path is `/ws/v1/notification/` — no `/hubs` substring — so YARP strips that prefix
   * and forwards the remainder untouched. Calling straight through to `/hubs/global` (the pattern
   * `chatHubUrl` uses) would 404 at the gateway since no route matches that path; going through
   * `/ws/v1/notification/hubs/global` does, mirroring the same transform already verified working
   * for the REST `Content` route.
   */
  notificationHubUrl:
    process.env.NEXT_PUBLIC_NOTIFICATION_HUB_URL ??
    `${gatewayOrigin(process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL)}/ws/v1/notification/hubs/global`,
} as const;
