"use client";

import type { UseFormReturn } from "react-hook-form";
import { Button, FormField, Select, Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, Textarea, Input } from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { AI_CONTEXT_CATEGORIES, type AiContextGroupFormValues } from "@/features/ai-context/ai-context.schema";

const CATEGORY_LABELS: Record<(typeof AI_CONTEXT_CATEGORIES)[number], string> = {
  brand: "Brand",
  company: "Company",
  products: "Products",
  writingStyle: "Writing style",
  customerSupport: "Customer support",
  seoRules: "SEO rules",
  businessRules: "Business rules",
  workflowRules: "Workflow rules",
  legal: "Legal / compliance",
  general: "General instructions",
};

export function ContextGroupSheet({
  open,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isSaving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: UseFormReturn<AiContextGroupFormValues>;
  onSubmit: (values: AiContextGroupFormValues) => void | Promise<void>;
  isSaving: boolean;
}) {
  const { t } = useAppTranslation();
  const { register, watch, formState } = form;
  const values = watch();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="wide">
        <SheetHeader>
          <SheetTitle>{isEditing ? t("aiContext.editGroup", "Edit context group") : t("aiContext.newGroup", "New context group")}</SheetTitle>
          <SheetDescription>{t("aiContext.sheetDescription", "Reusable business/context knowledge supplied to AI actions — not model training.")}</SheetDescription>
        </SheetHeader>
        <Form form={form} onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <FormField label={t("aiContext.name", "Name")} htmlFor="ctxName" required error={formState.errors.name?.message}>
            <Input id="ctxName" {...register("name")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("aiContext.category", "Category")} htmlFor="ctxCategory">
              <Select
                value={values.category}
                onValueChange={(value) => form.setValue("category", value as AiContextGroupFormValues["category"])}
                options={AI_CONTEXT_CATEGORIES.map((category) => ({ value: category, label: CATEGORY_LABELS[category] }))}
              />
            </FormField>
            <FormField
              label={t("aiContext.scope", "Scope")}
              htmlFor="ctxScope"
              description={t("aiContext.scopeHelp", "Global applies to every account; Group applies only to accounts assigned to it.")}
            >
              <Select
                value={values.scope}
                onValueChange={(value) => form.setValue("scope", value as AiContextGroupFormValues["scope"])}
                options={[
                  { value: "global", label: t("aiContext.scopeGlobal", "Global") },
                  { value: "group", label: t("aiContext.scopeGroup", "Group") },
                ]}
              />
            </FormField>
          </div>
          <FormField label={t("aiContext.content", "Context content")} htmlFor="ctxContent" required error={formState.errors.content?.message}>
            <Textarea id="ctxContent" rows={10} {...register("content")} />
          </FormField>
        </Form>
        <SheetFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} loading={isSaving}>
            {t("common.save", "Save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
