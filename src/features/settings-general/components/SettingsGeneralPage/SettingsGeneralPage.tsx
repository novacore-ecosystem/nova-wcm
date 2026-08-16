"use client";

import {
  Button,
  ErrorState,
  FormActions,
  FormField,
  FormSection,
  Input,
  PageContainer,
  PageHeader,
  SkeletonList,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useSettingsGeneralPage } from "@/features/settings-general/components/SettingsGeneralPage/useSettingsGeneralPage";

export function SettingsGeneralPage() {
  const { t } = useAppTranslation();
  const { isLoading, isError, refetch, form, onSubmit, isSubmitting } = useSettingsGeneralPage();
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const logoUrl = watch("logoUrl");
  const faviconUrl = watch("faviconUrl");

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("settingsGeneral.title", "Thông tin chung")}
          description={t("settingsGeneral.description", "Thông tin nhận diện và liên hệ hiển thị trên website.")}
        />

        {isLoading ? (
          <SkeletonList rows={6} />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
            <FormSection title={t("settingsGeneral.section.identity", "Nhận diện website")}>
              <FormField label={t("settingsGeneral.siteName", "Tên website")} htmlFor="siteName" required error={errors.siteName?.message}>
                <Input id="siteName" invalid={!!errors.siteName} {...register("siteName")} />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label={t("settingsGeneral.logoUrl", "URL logo")} htmlFor="logoUrl" error={errors.logoUrl?.message}>
                  <Input id="logoUrl" placeholder="https://…" invalid={!!errors.logoUrl} {...register("logoUrl")} />
                </FormField>
                <FormField label={t("settingsGeneral.faviconUrl", "URL favicon")} htmlFor="faviconUrl" error={errors.faviconUrl?.message}>
                  <Input id="faviconUrl" placeholder="https://…" invalid={!!errors.faviconUrl} {...register("faviconUrl")} />
                </FormField>
              </div>

              <div className="flex items-center gap-4">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external preview URL, next.config.ts image domains not modifiable here
                  <img src={logoUrl} alt={t("settingsGeneral.logoPreviewAlt", "Xem trước logo")} className="h-16 w-16 rounded-md border border-border object-contain bg-muted p-1" />
                ) : null}
                {faviconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external preview URL, next.config.ts image domains not modifiable here
                  <img src={faviconUrl} alt={t("settingsGeneral.faviconPreviewAlt", "Xem trước favicon")} className="h-8 w-8 rounded border border-border object-contain bg-muted p-0.5" />
                ) : null}
              </div>
            </FormSection>

            <FormSection title={t("settingsGeneral.section.contact", "Thông tin liên hệ")}>
              <FormField label={t("settingsGeneral.contactEmail", "Email")} htmlFor="contactEmail" error={errors.contactEmail?.message}>
                <Input id="contactEmail" type="email" placeholder="lienhe@example.com" invalid={!!errors.contactEmail} {...register("contactEmail")} />
              </FormField>
              <FormField label={t("settingsGeneral.contactPhone", "Số điện thoại")} htmlFor="contactPhone">
                <Input id="contactPhone" placeholder="1900 6868" {...register("contactPhone")} />
              </FormField>
              <FormField label={t("settingsGeneral.contactAddress", "Địa chỉ")} htmlFor="contactAddress">
                <Input id="contactAddress" {...register("contactAddress")} />
              </FormField>
            </FormSection>

            <FormActions>
              <Button type="submit" loading={isSubmitting}>
                {t("common.save", "Lưu thay đổi")}
              </Button>
            </FormActions>
          </Form>
        )}
      </div>
    </PageContainer>
  );
}
