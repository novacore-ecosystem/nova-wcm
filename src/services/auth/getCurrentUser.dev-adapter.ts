import { Permissions } from "@novacore/frontend-foundation";

export interface CurrentUser {
  id: string;
  name: string;
  email?: string;
  roles: string[];
  permissions: string[];
}

/**
 * DEV ADAPTER — isolated by design, same limitation nova-console documents for its own
 * identical stub. No backend endpoint returns current-user identity/permissions yet (no `/me`),
 * and no granular WCM permission keys exist in the shared `Permissions` registry either (see
 * docs/plan.md §15) — this assumes an authenticated session implies Root, matching every nav/
 * route guard in this app, which also gates on `Permissions.Root`.
 *
 * MUST be replaced with a real service call once the backend exposes a session/`/me` endpoint
 * and WCM-specific permission keys exist — do not extend this stub with more invented fields.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  return {
    id: "root",
    name: "Root",
    roles: ["root"],
    permissions: [Permissions.Root],
  };
}
