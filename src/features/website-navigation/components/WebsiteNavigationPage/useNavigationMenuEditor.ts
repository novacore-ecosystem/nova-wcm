"use client";

import { useEffect, useState } from "react";

import { useAppForm } from "@/shared/forms";
import {
  useUpdateWebsiteNavigationMenuMutation,
  useWebsiteNavigationMenuQuery,
} from "@/features/website-navigation/api/website-navigation.queries";
import { navigationItemSchema, type NavigationItemFormValues } from "@/features/website-navigation/website-navigation.schema";
import type { WebsiteNavigationItem, WebsiteNavigationMenuId } from "@/services/website-navigation";

export function useNavigationMenuEditor(menuId: WebsiteNavigationMenuId) {
  const menuQuery = useWebsiteNavigationMenuQuery(menuId);
  const updateMutation = useUpdateWebsiteNavigationMenuMutation(menuId);

  const [items, setItems] = useState<WebsiteNavigationItem[]>([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (menuQuery.data) {
      setItems(menuQuery.data.items);
      setDirty(false);
    }
  }, [menuQuery.data]);

  const addForm = useAppForm(navigationItemSchema, { defaultValues: { label: "", url: "" } });

  function moveItem(id: string, direction: "up" | "down") {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((item, i) => ({ ...item, order: i + 1 }));
    });
    setDirty(true);
  }

  function toggleVisible(id: string) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)));
    setDirty(true);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id).map((item, i) => ({ ...item, order: i + 1 })));
    setDirty(true);
  }

  function addItem(values: NavigationItemFormValues) {
    setItems((prev) => [
      ...prev,
      { id: `nav-${crypto.randomUUID()}`, label: values.label, url: values.url, order: prev.length + 1, visible: true },
    ]);
    addForm.reset({ label: "", url: "" });
    setDirty(true);
  }

  async function save() {
    await updateMutation.mutateAsync(items);
    setDirty(false);
  }

  return {
    menuQuery,
    items,
    moveItem,
    toggleVisible,
    removeItem,
    addForm,
    addItem,
    save,
    dirty,
    isSaving: updateMutation.isPending,
  };
}
