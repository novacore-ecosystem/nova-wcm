"use client";

import { useContext } from "react";

import { AppTranslationContext } from "@/shared/i18n/AppTranslationProvider";

/** The one app-level translation hook. Never use next-intl. */
export function useAppTranslation() {
  const t = useContext(AppTranslationContext);
  if (!t) throw new Error("useAppTranslation must be used within AppTranslationProvider");
  return { t };
}
