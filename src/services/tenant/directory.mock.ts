import type { TenantOption } from "@novacore/frontend-next-shadcn";
import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

/**
 * Mock tenant directory — stands in for a future tenant-discovery endpoint, since no such
 * endpoint exists anywhere in this codebase yet. WCM's real deployment model is a single
 * env-configured `NEXT_PUBLIC_TENANT_CLIENT_KEY` per instance (see `.env.example`), so this
 * only matters for the "not yet configured" login path — exercised in dev/demo, not production.
 */
const MOCK_TENANTS: TenantOption[] = [
  { id: "t-nova-home", name: "Nova Home & Furniture", clientKey: "nova-home-demo" },
  { id: "t-nova-retail", name: "Nova Retail Group", clientKey: "nova-retail-demo" },
  { id: "t-nova-hospitality", name: "Nova Hospitality", clientKey: "nova-hospitality-demo" },
];

export async function searchMockTenants(query: string): Promise<TenantOption[]> {
  const normalized = query.trim().toLowerCase();
  const results = normalized ? MOCK_TENANTS.filter((tenant) => tenant.name.toLowerCase().includes(normalized)) : MOCK_TENANTS;
  return simulateLatency(results, 150, 350);
}
