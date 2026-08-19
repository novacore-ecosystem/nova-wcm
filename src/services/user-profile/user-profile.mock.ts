import type { UserProfileCapabilities, UserProfileData, UserProfileUpdateInput } from "@novacore/frontend-next-shadcn";
import { useSessionStore } from "@/shared/stores/session.store";

/**
 * DEV ADAPTER — mirrors `getCurrentUser.dev-adapter.ts`'s own limitation. No backend `/me`
 * endpoint exists yet (read or write), so this reads/writes the in-memory session store instead
 * of a real API. Only the fields `CurrentUser` actually carries (`id`, `name`, `email`) are
 * surfaced — no avatar, username, status, or tenant, since those aren't in the real session
 * payload and inventing them here would misrepresent what the backend supports. Avatar upload
 * capability is reported as unsupported for the same reason.
 *
 * MUST be replaced with a real service call once the backend exposes a profile read/update
 * endpoint and richer identity fields — do not extend this stub with more invented fields.
 */
export function getMockCapabilities(): UserProfileCapabilities {
  return { avatarUpload: false };
}

export async function getMockProfile(): Promise<UserProfileData> {
  const user = useSessionStore.getState().user;
  if (!user) throw new Error("No authenticated user in session");
  return { id: user.id, displayName: user.name, email: user.email };
}

export async function updateMockProfile(patch: UserProfileUpdateInput): Promise<UserProfileData> {
  const { user, setAuthenticated } = useSessionStore.getState();
  if (!user) throw new Error("No authenticated user in session");
  const updated = {
    ...user,
    name: patch.displayName ?? user.name,
    email: patch.email !== undefined ? patch.email : user.email,
  };
  setAuthenticated(updated);
  return { id: updated.id, displayName: updated.name, email: updated.email };
}
