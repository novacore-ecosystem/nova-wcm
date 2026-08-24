"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSessionBootstrapQuery } from "@/features/auth/api/auth.queries";
import { useSessionStore } from "@/shared/stores/session.store";
import { ensureNotificationHubStarted, onReceiveNotification, stopNotificationHub } from "@/shared/lib/realtime/notification-hub";
import { useNotificationStore } from "@/shared/stores/notification.store";

export function useRequireAuth() {
  const router = useRouter();
  const { isLoading } = useSessionBootstrapQuery();
  const status = useSessionStore((state) => state.status);
  const receiveNotification = useNotificationStore((state) => state.receive);
  const resetNotifications = useNotificationStore((state) => state.reset);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  /** Connection lifecycle tied to the session, not to any one route — notifications must arrive regardless of which admin page is open. Fire-and-forget: a failed connection attempt must never block the auth flow (no live Notification Service instance is guaranteed in every environment). */
  useEffect(() => {
    if (status !== "authenticated") return;
    ensureNotificationHubStarted().catch(() => undefined);
    const unsubscribe = onReceiveNotification(receiveNotification);
    return () => {
      unsubscribe();
      stopNotificationHub().catch(() => undefined);
      resetNotifications();
    };
  }, [status, receiveNotification, resetNotifications]);

  return {
    isChecking: isLoading || status === "unknown",
    isAuthenticated: status === "authenticated",
  };
}
