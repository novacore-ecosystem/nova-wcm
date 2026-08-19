import type { TenantDirectoryService } from "@novacore/frontend-next-shadcn";
import { searchMockTenants } from "@/services/tenant/directory.mock";

/** WCM's adapter over `TenantDirectoryService` — see `services/tenant/directory.mock.ts` for why it's mocked, not a real API call. */
export const tenantDirectoryService: TenantDirectoryService = {
  searchTenants: searchMockTenants,
};
