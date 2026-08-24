"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useSessionBootstrapQuery } from "@/features/auth/api/auth.queries";
import { useSessionStore } from "@/shared/stores/session.store";
import { ensureNotificationHubStarted, onReceiveNotification, stopNotificationHub } from "@/shared/lib/realtime/notification-hub";
import { notificationKeys } from "@/features/notifications/api/notification.queries";

export function useRequireAuth() {
  const router = useRouter();
  const { isLoading } = useSessionBootstrapQuery();
  const status = useSessionStore((state) => state.status);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  /**
   * Connection lifecycle tied to the session, not to any one route — notifications must arrive
   * regardless of which admin page is open. Fire-and-forget: a failed connection attempt must
   * never block the auth flow (no live Notification Service instance is guaranteed in every
   * environment). On push, invalidates the Notification Center list query (`NotificationBell`,
   * always mounted in `AdminShell`) rather than appending the push payload directly — `NotificationDto`
   * carries no `Id`, so only a real REST refetch gives the new item something `markAsRead` can use.
   */
  useEffect(() => {
    if (status !== "authenticated") return;
    ensureNotificationHubStarted().catch(() => undefined);
    const unsubscribe = onReceiveNotification(() => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    });
    return () => {
      unsubscribe();
      stopNotificationHub().catch(() => undefined);
    };
  }, [status, queryClient]);

  return {
    isChecking: isLoading || status === "unknown",
    isAuthenticated: status === "authenticated",
  };
}
