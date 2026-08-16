"use client";

import { createContext, useMemo, type ReactNode } from "react";
import { createTranslator, TRANSLATION_RESOURCES, type Locale, type Translator } from "@novacore/frontend-foundation";

import { useLocaleStore } from "@/shared/stores/locale.store";
import { APP_DICTIONARY } from "@/shared/i18n/dictionary";

export interface AppTranslate {
  (key: string, fallback?: string, values?: Record<string, string | number>): string;
}

export const AppTranslationContext = createContext<AppTranslate | null>(null);

/**
 * Resolution chain: application dictionary (APP_DICTIONARY) -> fallback (frontend-foundation's
 * TRANSLATION_RESOURCES) -> explicit call-site default -> the raw key as a last resort. No
 * tenant-override layer — nova-wcm has no Translation Management feature (see docs/plan.md §14).
 */
export function AppTranslationProvider({ children }: { children: ReactNode }) {
  const locale = useLocaleStore((state) => state.locale);

  const translate = useMemo<AppTranslate>(() => {
    const base: Translator = createTranslator(
      { application: APP_DICTIONARY, fallback: TRANSLATION_RESOURCES },
      { locale: locale as Locale, onMissingKey: "key" },
    );

    return (key, fallback, values) => {
      const resolved = base(key, values);
      return resolved === key && fallback !== undefined ? fallback : resolved;
    };
  }, [locale]);

  return <AppTranslationContext.Provider value={translate}>{children}</AppTranslationContext.Provider>;
}
