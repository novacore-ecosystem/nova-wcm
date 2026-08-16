"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button, EmptyState, ErrorState, FormField, Input, SkeletonList, Switch } from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useNavigationMenuEditor } from "@/features/website-navigation/components/WebsiteNavigationPage/useNavigationMenuEditor";
import type { WebsiteNavigationMenuId } from "@/services/website-navigation";

export function NavigationMenuEditor({ menuId }: { menuId: WebsiteNavigationMenuId }) {
  const { t } = useAppTranslation();
  const { menuQuery, items, moveItem, toggleVisible, removeItem, addForm, addItem, save, dirty, isSaving } =
    useNavigationMenuEditor(menuId);
  const {
    register,
    formState: { errors },
  } = addForm;

  if (menuQuery.isLoading) return <SkeletonList rows={4} />;
  if (menuQuery.isError) return <ErrorState onRetry={() => menuQuery.refetch()} />;

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <EmptyState description={t("websiteNavigation.empty", "Chưa có mục nào trong menu này.")} />
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  disabled={index === 0}
                  onClick={() => moveItem(item.id, "up")}
                  aria-label={t("websiteNavigation.moveUp", "Di chuyển lên")}
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  disabled={index === items.length - 1}
                  onClick={() => moveItem(item.id, "down")}
                  aria-label={t("websiteNavigation.moveDown", "Di chuyển xuống")}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.label}</p>
                <p className="truncate text-xs text-muted-foreground">{item.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={item.visible} onCheckedChange={() => toggleVisible(item.id)} aria-label={t("websiteNavigation.visible", "Hiển thị")} />
                <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => removeItem(item.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Form form={addForm} onSubmit={addItem} className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-3 sm:flex-row sm:items-end">
        <FormField label={t("websiteNavigation.addLabel", "Tên mục")} htmlFor={`${menuId}-label`} className="flex-1" error={errors.label?.message}>
          <Input id={`${menuId}-label`} placeholder="Ví dụ: Khuyến mãi" invalid={!!errors.label} {...register("label")} />
        </FormField>
        <FormField label={t("websiteNavigation.addUrl", "Đường dẫn")} htmlFor={`${menuId}-url`} className="flex-1" error={errors.url?.message}>
          <Input id={`${menuId}-url`} placeholder="/khuyen-mai" invalid={!!errors.url} {...register("url")} />
        </FormField>
        <Button type="submit" variant="outline">
          <Plus className="mr-2 size-4" />
          {t("websiteNavigation.addItem", "Thêm mục")}
        </Button>
      </Form>

      <div className="flex justify-end">
        <Button onClick={save} loading={isSaving} disabled={!dirty}>
          {t("common.save", "Lưu thay đổi")}
        </Button>
      </div>
    </div>
  );
}
