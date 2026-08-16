import type { Metadata } from "next";
import "@novacore/frontend-next-shadcn/styles.css";
import "@/app/globals.css";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Nova WCM",
  description: "Website content, catalog, media, and SEO management for small business and landing-page sites.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
