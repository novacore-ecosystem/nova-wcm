"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InitialAuthState } from "@novacore/frontend-next-shadcn";

import { authService } from "@/features/auth/api/auth.service";
import { useSessionStore } from "@/shared/stores/session.store";
import { bootstrapCoordinator } from "@/shared/lib/bootstrap/bootstrap-client";
import type { LoginFormValues } from "@/features/auth/auth.schema";

export const sessionKeys = {
  all: ["session"] as const,
  bootstrap: () => [...sessionKeys.all, "bootstrap"] as const,
};

/**
 * Runs once per app load, gated by `initialAuthState` (computed server-side from request
 * cookies — see `(admin)/layout.tsx`) so it only calls `/auth/refresh-token` when actually
 * needed, not on every F5. See `authService.bootstrapSession`'s doc comment.
 *
 * Whenever a refresh happens and returns a `version`, immediately compares it against the
 * locally-cached Bootstrap (`bootstrapCoordinator.refreshBootstrap`) — closes the "offline long
 * enough for the access token to expire" gap that a SignalR connect-time check alone can't catch
 * (a refreshed token's own claim would already match the new version by the time the Hub sees it).
 */
export function useSessionBootstrapQuery(initialAuthState: InitialAuthState) {
  const setAuthenticated = useSessionStore((state) => state.setAuthenticated);
  const setUnauthenticated = useSessionStore((state) => state.setUnauthenticated);

  return useQuery({
    queryKey: sessionKeys.bootstrap(),
    queryFn: async () => {
      const { user, version } = await authService.bootstrapSession(initialAuthState);
      if (user) setAuthenticated(user);
      else setUnauthenticated();
      if (version !== null) void bootstrapCoordinator.refreshBootstrap(version);
      return user;
    },
    staleTime: Infinity,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuthenticated = useSessionStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: ({ values, tenantClientKey }: { values: LoginFormValues; tenantClientKey?: string }) =>
      authService.login(values, tenantClientKey),
    onSuccess: ({ user, version }) => {
      setAuthenticated(user);
      queryClient.setQueryData(sessionKeys.bootstrap(), user);
      if (version !== null) void bootstrapCoordinator.refreshBootstrap(version);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const setUnauthenticated = useSessionStore((state) => state.setUnauthenticated);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setUnauthenticated();
      queryClient.setQueryData(sessionKeys.bootstrap(), null);
    },
  });
}
