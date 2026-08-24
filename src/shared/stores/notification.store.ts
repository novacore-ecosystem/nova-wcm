import { create } from "zustand";
import type { NotificationEvent } from "@/services/notification/notification.types";

const MAX_RECENT = 50;

interface NotificationState {
  unreadCount: number;
  recent: NotificationEvent[];
  receive: (notification: NotificationEvent) => void;
  reset: () => void;
}

/**
 * Client-side cache of `GlobalHub.ReceiveNotification` pushes for the current browser session
 * only — no REST list/history endpoint is wired into WCM yet, so `recent` is what arrived while
 * this tab was connected, not a real notification-center history (same session-scoped caveat as
 * `chat-ownership.store.ts`).
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  recent: [],
  receive: (notification) =>
    set((s) => ({
      unreadCount: s.unreadCount + 1,
      recent: [notification, ...s.recent].slice(0, MAX_RECENT),
    })),
  reset: () => set({ unreadCount: 0, recent: [] }),
}));
