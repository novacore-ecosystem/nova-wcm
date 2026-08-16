"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  EmptyState,
  ErrorState,
  FormActions,
  FormField,
  HowTo,
  Input,
  PageContainer,
  PageHeader,
  SearchInput,
  SkeletonList,
  Toolbar,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useTagListPage } from "@/features/tag/components/TagListPage/useTagListPage";

export function TagListPage() {
  const { t } = useAppTranslation();
  const page = useTagListPage();

  const {
    register,
    watch,
    formState: { errors },
  } = page.form;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("tag.title", "Tags")}
          description={t("tag.description", "Fine-grained labels readers can use to find related articles.")}
          actions={
            <Button size="sm" onClick={page.openCreate}>
              {t("tag.new", "New tag")}
            </Button>
          }
        />

        <Toolbar>
          <SearchInput value={page.keyword} onValueChange={page.setKeyword} placeholder={t("tag.search", "Search tags…")} className="max-w-xs" />
        </Toolbar>

        {page.isLoading ? (
          <SkeletonList rows={5} />
        ) : page.isError ? (
          <ErrorState onRetry={() => page.refetch()} />
        ) : page.data.length === 0 ? (
          <EmptyState description={t("tag.empty", "No tags yet. Create one to start labeling articles.")} />
        ) : (
          <div className="flex flex-wrap gap-2">
            {page.data.map((tag) => (
              <div key={tag.id} className="group flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-3 pr-1.5 text-sm">
                <span className="font-medium">{tag.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {tag.articleCount}
                </Badge>
                <button
                  type="button"
                  onClick={() => page.openEdit(tag)}
                  aria-label={t("tag.edit", "Edit tag")}
                  className="ml-1 rounded-full p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100"
                >
                  <Pencil className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => page.openDeleteConfirm(tag)}
                  aria-label={t("tag.delete", "Delete tag")}
                  className="rounded-full p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <HowTo title={t("tag.howToTitle", "How to use tags")}>
          {t(
            "tag.howToBody",
            "Categories are broad topics; tags are specific details (a material, a room, a style). A few tags per article help readers find related content without over-labeling.",
          )}
        </HowTo>
      </div>

      <Dialog open={page.dialogOpen} onOpenChange={page.setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{page.isEditing ? t("tag.editTitle", "Edit tag") : t("tag.newTitle", "New tag")}</DialogTitle>
          </DialogHeader>
          <Form form={page.form} onSubmit={page.onSubmit} className="grid gap-4">
            <FormField label={t("tag.name", "Name")} htmlFor="tag-name" required error={errors.name?.message}>
              <Input id="tag-name" invalid={!!errors.name} {...register("name")} onChange={(e) => page.onNameChange(e.target.value)} value={watch("name")} />
            </FormField>
            <FormField label={t("tag.slug", "Slug")} htmlFor="tag-slug" required error={errors.slug?.message}>
              <Input id="tag-slug" invalid={!!errors.slug} {...register("slug")} />
            </FormField>
            <FormActions>
              <Button variant="outline" type="button" onClick={() => page.setDialogOpen(false)}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" loading={page.isSubmitting}>
                {t("common.save", "Save")}
              </Button>
            </FormActions>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!page.deleteTarget}
        onOpenChange={(open) => !open && page.closeDeleteConfirm()}
        title={t("tag.deleteTitle", "Delete tag?")}
        description={t("tag.deleteDescription", `"${page.deleteTarget?.name}" will be removed from every article that uses it.`)}
        confirmLabel={t("tag.deleteConfirm", "Delete")}
        loading={page.deleteMutation.isPending}
        onConfirm={page.confirmDelete}
      />
    </PageContainer>
  );
}
