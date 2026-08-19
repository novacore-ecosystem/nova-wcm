"use client";

import { Layers, Plus, Trash2, UserCog } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  EmptyState,
  FormField,
  PageContainer,
  PageHeader,
  SkeletonList,
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useAiContextPage } from "@/features/ai-context/components/AiContextPage/useAiContextPage";
import { ContextGroupSheet } from "@/features/ai-context/components/AiContextPage/ContextGroupSheet";

export function AiContextPage() {
  const { t } = useAppTranslation();
  const {
    groupsQuery,
    groups,
    globalGroups,
    teamGroups,
    sheetOpen,
    setSheetOpen,
    editingGroup,
    openCreate,
    openEdit,
    groupForm,
    submitGroup,
    isSavingGroup,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting,
    personalForm,
    submitPersonal,
    isSavingPersonal,
    personalContent,
  } = useAiContextPage();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("aiContext.title", "AI context")}
          description={t("aiContext.description", "Configurable business/context knowledge supplied to AI actions — not model training.")}
          actions={
            <Button onClick={openCreate}>
              <Plus className="mr-2 size-4" />
              {t("aiContext.newGroup", "New context group")}
            </Button>
          }
        />

        {groupsQuery.isLoading ? (
          <SkeletonList rows={3} />
        ) : groups.length === 0 ? (
          <EmptyState icon={<Layers className="h-8 w-8" />} title={t("aiContext.empty", "No context groups yet")} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <Card key={group.id}>
                <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
                  <div>
                    <CardTitle className="text-sm">{group.name}</CardTitle>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Badge variant="outline">{group.category}</Badge>
                      <Badge variant={group.scope === "global" ? "default" : "secondary"}>{group.scope}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(group)}>
                      {t("common.edit", "Edit")}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(group)} aria-label={t("common.delete", "Delete")}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{group.content}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{t("aiContext.assignedCount", `Applies to ${group.assignedCount} accounts`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserCog className="size-4 text-primary" />
              {t("aiContext.personal", "My personal context")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form form={personalForm} onSubmit={submitPersonal} className="grid gap-3">
              <FormField description={t("aiContext.personalHelp", "Added on top of any Global/Group context that applies to you.")}>
                <Textarea rows={4} {...personalForm.register("content")} />
              </FormField>
              <Button type="submit" size="sm" loading={isSavingPersonal} className="self-start">
                {t("common.save", "Save")}
              </Button>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("aiContext.effective", "Effective context preview")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              { label: t("aiContext.effectiveGlobal", "Global context"), items: globalGroups },
              { label: t("aiContext.effectiveGroup", "Group context"), items: teamGroups },
            ].map((section) => (
              <div key={section.label} className="grid gap-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{section.label}</p>
                {section.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">—</p>
                ) : (
                  section.items.map((group) => (
                    <p key={group.id} className="rounded-md border border-border bg-muted/30 p-2 text-sm">
                      {group.content}
                    </p>
                  ))
                )}
              </div>
            ))}
            <div className="grid gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("aiContext.effectivePersonal", "Personal context")}</p>
              <p className="rounded-md border border-border bg-muted/30 p-2 text-sm text-muted-foreground">{personalContent || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ContextGroupSheet open={sheetOpen} onOpenChange={setSheetOpen} isEditing={!!editingGroup} form={groupForm} onSubmit={submitGroup} isSaving={isSavingGroup} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("aiContext.deleteTitle", "Delete this context group?")}
        description={t("aiContext.deleteDescription", "AI actions will no longer receive this context.")}
        confirmLabel={t("common.delete", "Delete")}
        cancelLabel={t("common.cancel", "Cancel")}
        loading={isDeleting}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}
