import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES, buildInitialAuthState } from "@novacore/frontend-next-shadcn";
import "@novacore/frontend-next-shadcn/styles.css";
import "@/app/globals.css";
import { Providers } from "@/app/providers";
import { GuestChatWidget } from "@/features/guest-chat-widget/GuestChatWidget";

export const metadata: Metadata = {
  title: "Nova WCM",
  description: "Website content, catalog, media, and SEO management for small business and landing-page sites.",
};

/**
 * Reads the request's auth cookies once, server-side — the same render hint every route below
 * (`(admin)`, `(public)`, `(auth)`) derives its Bootstrap/session behavior from. See
 * `InitialAuthState`'s doc comment (`@novacore/frontend-next-shadcn`): a hint for skipping
 * unnecessary calls, never an authorization decision by itself.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialAuthState = buildInitialAuthState({
    accessToken: cookieStore.get(AUTH_COOKIE_NAMES.accessToken)?.value,
    refreshToken: cookieStore.get(AUTH_COOKIE_NAMES.refreshToken)?.value,
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers initialAuthState={initialAuthState}>{children}</Providers>
        {/* TEMPORARY dev/test-only entry point — see GuestChatWidget's doc comment. Remove this line + the component to retire it. */}
        <GuestChatWidget />
      </body>
    </html>
  );
}
