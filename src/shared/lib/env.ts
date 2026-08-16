const DEFAULT_API_BASE_URL = "http://localhost:5000/api";

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  /**
   * nova-wcm's TenantClient public key (X-Tenant-Client-Key header). Deployment config, not a
   * per-user secret — see .env.example and docs/plan.md's auth note.
   */
  tenantClientKey: process.env.NEXT_PUBLIC_TENANT_CLIENT_KEY ?? "",
} as const;
