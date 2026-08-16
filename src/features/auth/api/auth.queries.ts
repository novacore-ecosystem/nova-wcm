"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/features/auth/api/auth.service";
import { useSessionStore } from "@/shared/stores/session.store";
import type { LoginFormValues } from "@/features/auth/auth.schema";

export const sessionKeys = {
  all: ["session"] as const,
  bootstrap: () => [...sessionKeys.all, "bootstrap"] as const,
};

/** Runs once per app load. */
export function useSessionBootstrapQuery() {
  const setAuthenticated = useSessionStore((state) => state.setAuthenticated);
  const setUnauthenticated = useSessionStore((state) => state.setUnauthenticated);

  return useQuery({
    queryKey: sessionKeys.bootstrap(),
    queryFn: async () => {
      const user = await authService.bootstrapSession();
      if (user) setAuthenticated(user);
      else setUnauthenticated();
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
    mutationFn: (values: LoginFormValues) => authService.login(values),
    onSuccess: (user) => {
      setAuthenticated(user);
      queryClient.setQueryData(sessionKeys.bootstrap(), user);
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
