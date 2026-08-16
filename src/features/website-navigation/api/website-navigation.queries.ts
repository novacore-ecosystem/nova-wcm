"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getWebsiteNavigationMenu,
  updateWebsiteNavigationMenu,
  type WebsiteNavigationItem,
  type WebsiteNavigationMenuId,
} from "@/services/website-navigation";

export const websiteNavigationKeys = {
  all: ["website-navigation"] as const,
  menu: (menuId: WebsiteNavigationMenuId) => [...websiteNavigationKeys.all, menuId] as const,
};

export function useWebsiteNavigationMenuQuery(menuId: WebsiteNavigationMenuId) {
  return useQuery({
    queryKey: websiteNavigationKeys.menu(menuId),
    queryFn: () => getWebsiteNavigationMenu(menuId),
  });
}

export function useUpdateWebsiteNavigationMenuMutation(menuId: WebsiteNavigationMenuId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: WebsiteNavigationItem[]) => updateWebsiteNavigationMenu(menuId, items),
    onSuccess: (updated) => queryClient.setQueryData(websiteNavigationKeys.menu(menuId), updated),
  });
}
