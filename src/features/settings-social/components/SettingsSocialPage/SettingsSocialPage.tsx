"use client";

import { Facebook, Linkedin, MessageCircle, Music2, Youtube } from "lucide-react";
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
import { useSettingsSocialPage } from "@/features/settings-social/components/SettingsSocialPage/useSettingsSocialPage";

export function SettingsSocialPage() {
  const { t } = useAppTranslation();
  const { isLoading, isError, refetch, form, onSubmit, isSubmitting } = useSettingsSocialPage();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("settingsSocial.title", "Liên kết mạng xã hội")}
          description={t("settingsSocial.description", "Đường dẫn đến các trang mạng xã hội của bạn, hiển thị ở chân trang website.")}
        />

        {isLoading ? (
          <SkeletonList rows={5} />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
            <FormSection>
              <FormField label={t("settingsSocial.facebook", "Facebook")} htmlFor="facebookUrl" error={errors.facebookUrl?.message}>
                <div className="flex items-center gap-2">
                  <Facebook className="size-4 shrink-0 text-muted-foreground" />
                  <Input id="facebookUrl" placeholder="https://facebook.com/yourpage" invalid={!!errors.facebookUrl} {...register("facebookUrl")} />
                </div>
              </FormField>
              <FormField label={t("settingsSocial.youtube", "YouTube")} htmlFor="youtubeUrl" error={errors.youtubeUrl?.message}>
                <div className="flex items-center gap-2">
                  <Youtube className="size-4 shrink-0 text-muted-foreground" />
                  <Input id="youtubeUrl" placeholder="https://youtube.com/@yourchannel" invalid={!!errors.youtubeUrl} {...register("youtubeUrl")} />
                </div>
              </FormField>
              <FormField label={t("settingsSocial.linkedin", "LinkedIn")} htmlFor="linkedinUrl" error={errors.linkedinUrl?.message}>
                <div className="flex items-center gap-2">
                  <Linkedin className="size-4 shrink-0 text-muted-foreground" />
                  <Input id="linkedinUrl" placeholder="https://linkedin.com/company/yourcompany" invalid={!!errors.linkedinUrl} {...register("linkedinUrl")} />
                </div>
              </FormField>
              <FormField label={t("settingsSocial.zalo", "Zalo")} htmlFor="zaloUrl" error={errors.zaloUrl?.message}>
                <div className="flex items-center gap-2">
                  <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
                  <Input id="zaloUrl" placeholder="https://zalo.me/yourpage" invalid={!!errors.zaloUrl} {...register("zaloUrl")} />
                </div>
              </FormField>
              <FormField label={t("settingsSocial.tiktok", "TikTok")} htmlFor="tiktokUrl" error={errors.tiktokUrl?.message}>
                <div className="flex items-center gap-2">
                  <Music2 className="size-4 shrink-0 text-muted-foreground" />
                  <Input id="tiktokUrl" placeholder="https://tiktok.com/@yourpage" invalid={!!errors.tiktokUrl} {...register("tiktokUrl")} />
                </div>
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
