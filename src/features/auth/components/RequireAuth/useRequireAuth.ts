"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { InitialAuthState } from "@novacore/frontend-next-shadcn";

import { useSessionBootstrapQuery } from "@/features/auth/api/auth.queries";
import { useSessionStore } from "@/shared/stores/session.store";
import {
  ensureNotificationHubStarted,
  onBootstrapVersionChanged,
  onReceiveNotification,
  stopNotificationHub,
} from "@/shared/lib/realtime/notification-hub";
import { notificationKeys } from "@/features/notifications/api/notification.queries";
import { bootstrapCoordinator } from "@/shared/lib/bootstrap/bootstrap-client";

export function useRequireAuth(initialAuthState: InitialAuthState) {
  const router = useRouter();
  const { isLoading } = useSessionBootstrapQuery(initialAuthState);
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
   *
   * Also subscribes to `BootstrapVersionChanged` — the same connection catches both a live
   * tenant-wide push (Bootstrap changed while connected) and a connect-time mismatch (Bootstrap
   * changed while this session was briefly offline but its access token stayed valid, so no
   * refresh happened to surface the new version another way). Either way, the payload is the new
   * version; `bootstrapCoordinator.refreshBootstrap` itself no-ops if already on that version.
   */
  useEffect(() => {
    if (status !== "authenticated") return;
    ensureNotificationHubStarted().catch(() => undefined);
    const unsubscribeNotifications = onReceiveNotification(() => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    });
    const unsubscribeBootstrap = onBootstrapVersionChanged((version) => {
      void bootstrapCoordinator.refreshBootstrap(version);
    });
    return () => {
      unsubscribeNotifications();
      unsubscribeBootstrap();
      stopNotificationHub().catch(() => undefined);
    };
  }, [status, queryClient]);

  return {
    isChecking: isLoading || status === "unknown",
    isAuthenticated: status === "authenticated",
  };
}
