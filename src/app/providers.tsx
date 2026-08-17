"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AccessControlProvider, AdminProvider, I18nProvider, PermissionProvider } from "@novacore/frontend-next-shadcn";
import type { Locale } from "@novacore/frontend-foundation";

import { createQueryClient } from "@/shared/lib/query/client";
import { AppTranslationProvider } from "@/shared/i18n";
import { APP_DICTIONARY } from "@/shared/i18n/dictionary";
import { WCM_ADMIN_THEME } from "@/shared/theme/wcm-theme";
import { useLocaleStore } from "@/shared/stores/locale.store";
import { NO_PERMISSIONS, useSessionStore } from "@/shared/stores/session.store";
import { accessControlServices } from "@/features/access-control";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const ownedPermissions = useSessionStore((state) => state.user?.permissions ?? NO_PERMISSIONS);

  return (
    <QueryClientProvider client={queryClient}>
      <AppTranslationProvider>
        {/* nova-wcm's own design identity — warm amber/orange on a neutral base, see
            docs/plan.md §5 and shared/theme/wcm-theme.ts. Deliberately not nova-console's
            NOVACORE_ADMIN_THEME: this is a different commercial product, not a "Console with
            hidden features." */}
        <AdminProvider theme={{ ...WCM_ADMIN_THEME, mode: "system" }}>
          {/* Sibling of AppTranslationProvider, not a replacement — the shared package's own
              components (e.g. the Access Control module) read translations through this one,
              kept in lockstep with the same locale store so the LocaleSwitcher drives both. */}
          <I18nProvider locale={locale as Locale} onLocaleChange={setLocale} translations={APP_DICTIONARY}>
            <PermissionProvider permissions={ownedPermissions}>
              <AccessControlProvider services={accessControlServices}>{children}</AccessControlProvider>
            </PermissionProvider>
          </I18nProvider>
        </AdminProvider>
      </AppTranslationProvider>
    </QueryClientProvider>
  );
}
