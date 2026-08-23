import type { Metadata } from "next";
import "@novacore/frontend-next-shadcn/styles.css";
import "@/app/globals.css";
import { Providers } from "@/app/providers";
import { GuestChatWidget } from "@/features/guest-chat-widget/GuestChatWidget";

export const metadata: Metadata = {
  title: "Nova WCM",
  description: "Website content, catalog, media, and SEO management for small business and landing-page sites.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        {/* TEMPORARY dev/test-only entry point — see GuestChatWidget's doc comment. Remove this line + the component to retire it. */}
        <GuestChatWidget />
      </body>
    </html>
  );
}
