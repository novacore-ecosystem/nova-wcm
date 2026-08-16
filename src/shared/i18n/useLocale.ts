"use client";

import { getSupportedLocales, type Locale } from "@novacore/frontend-foundation";
import { useLocaleStore } from "@/shared/stores/locale.store";

export interface LocaleOption {
  code: Locale;
  label: string;
}

/** Thin, typed wrapper around `useLocaleStore` — the public API surface UI code should use. */
export function useLocale() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const availableLocales: LocaleOption[] = getSupportedLocales().map((metadata) => ({
    code: metadata.code,
    label: metadata.nativeName,
  }));

  return { locale, setLocale, availableLocales };
}
