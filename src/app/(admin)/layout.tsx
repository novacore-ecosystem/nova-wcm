import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES, buildInitialAuthState } from "@novacore/frontend-next-shadcn";

import { RequireAuth } from "@/features/auth";
import { AdminShell } from "@/shared/layout/AdminShell";

/** See `RootLayout`'s doc comment — same cookie read, scoped here so `RequireAuth`'s session-bootstrap gating works even if this layout is ever reached without the root layout's value in scope. */
export default async function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialAuthState = buildInitialAuthState({
    accessToken: cookieStore.get(AUTH_COOKIE_NAMES.accessToken)?.value,
    refreshToken: cookieStore.get(AUTH_COOKIE_NAMES.refreshToken)?.value,
  });

  return (
    <RequireAuth initialAuthState={initialAuthState}>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
