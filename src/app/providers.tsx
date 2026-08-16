"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AdminProvider } from "@novacore/frontend-next-shadcn";

import { createQueryClient } from "@/shared/lib/query/client";
import { AppTranslationProvider } from "@/shared/i18n";
import { WCM_ADMIN_THEME } from "@/shared/theme/wcm-theme";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AppTranslationProvider>
        {/* nova-wcm's own design identity — warm amber/orange on a neutral base, see
            docs/plan.md §5 and shared/theme/wcm-theme.ts. Deliberately not nova-console's
            NOVACORE_ADMIN_THEME: this is a different commercial product, not a "Console with
            hidden features." */}
        <AdminProvider theme={{ ...WCM_ADMIN_THEME, mode: "system" }}>{children}</AdminProvider>
      </AppTranslationProvider>
    </QueryClientProvider>
  );
}
