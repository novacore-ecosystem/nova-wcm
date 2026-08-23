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
} as const;
