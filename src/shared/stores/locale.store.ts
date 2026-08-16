import { create } from "zustand";
import { DEFAULT_LOCALE, type Locale } from "@novacore/frontend-foundation";

const LOCALE_STORAGE_KEY = "nova-wcm.locale";

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE as Locale;
  return (window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null) ?? (DEFAULT_LOCALE as Locale);
}

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/** Cross-route client state — not server data, so Query doesn't own it. */
export const useLocaleStore = create<LocaleState>((set) => ({
  locale: readStoredLocale(),
  setLocale: (locale) => {
    if (typeof window !== "undefined") window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    set({ locale });
  },
}));
