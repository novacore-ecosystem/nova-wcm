"use client";

import { Info } from "lucide-react";
import {
  ErrorState,
  FormActions,
  FormField,
  FormSection,
  HowTo,
  Button,
  Input,
  PageContainer,
  PageHeader,
  SkeletonList,
  Switch,
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useWebsiteSeoPage } from "@/features/website-seo/components/WebsiteSeoPage/useWebsiteSeoPage";
import { SearchResultPreview } from "@/features/website-seo/components/WebsiteSeoPage/SearchResultPreview";

export function WebsiteSeoPage() {
  const { t } = useAppTranslation();
  const { isLoading, isError, refetch, form, onSubmit, isSubmitting } = useWebsiteSeoPage();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const title = watch("defaultMetaTitle") ?? "";
  const description = watch("defaultMetaDescription") ?? "";
  const socialImageUrl = watch("defaultSocialImageUrl") ?? "";
  const robotsIndexable = watch("robotsIndexable");

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("websiteSeo.title", "SEO website")}
          description={t("websiteSeo.description", "Thiết lập mặc định giúp website hiển thị tốt trên công cụ tìm kiếm.")}
        />

        <HowTo title={t("websiteSeo.howTo.title", "Cách viết tiêu đề và mô tả SEO tốt")} icon={<Info className="size-4" />}>
          {t(
            "websiteSeo.howTo.body",
            "Tiêu đề nên nêu rõ bạn là ai và bán gì, khoảng 50-60 ký tự. Mô tả nên tóm tắt hấp dẫn trong 150-160 ký tự để không bị cắt bớt trên Google.",
          )}
        </HowTo>

        {isLoading ? (
          <SkeletonList rows={6} />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
            <FormSection title={t("websiteSeo.section.search", "Hiển thị trên tìm kiếm")}>
              <FormField
                label={t("websiteSeo.metaTitle", "Tiêu đề mặc định")}
                htmlFor="defaultMetaTitle"
                required
                description={t("websiteSeo.metaTitleHelp", `${title.length}/60 ký tự — nên trong khoảng 50-60 ký tự.`)}
                error={errors.defaultMetaTitle?.message}
              >
                <Input id="defaultMetaTitle" invalid={!!errors.defaultMetaTitle} {...register("defaultMetaTitle")} />
              </FormField>
              <FormField
                label={t("websiteSeo.metaDescription", "Mô tả mặc định")}
                htmlFor="defaultMetaDescription"
                required
                description={t("websiteSeo.metaDescriptionHelp", `${description.length}/160 ký tự — nên trong khoảng 150-160 ký tự.`)}
                error={errors.defaultMetaDescription?.message}
              >
                <Textarea id="defaultMetaDescription" rows={3} invalid={!!errors.defaultMetaDescription} {...register("defaultMetaDescription")} />
              </FormField>

              <SearchResultPreview title={title} description={description} />
            </FormSection>

            <FormSection title={t("websiteSeo.section.social", "Chia sẻ mạng xã hội")}>
              <FormField
                label={t("websiteSeo.socialImage", "URL ảnh chia sẻ mặc định")}
                htmlFor="defaultSocialImageUrl"
                required
                description={t("websiteSeo.socialImageHelp", "Ảnh hiển thị khi trang được chia sẻ trên Facebook, Zalo…")}
                error={errors.defaultSocialImageUrl?.message}
              >
                <Input id="defaultSocialImageUrl" invalid={!!errors.defaultSocialImageUrl} {...register("defaultSocialImageUrl")} />
              </FormField>
              {socialImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- external preview URL, next.config.ts image domains not modifiable here
                <img
                  src={socialImageUrl}
                  alt={t("websiteSeo.socialImageAlt", "Ảnh chia sẻ mặc định")}
                  className="h-40 w-full max-w-md rounded-lg border border-border object-cover"
                />
              ) : null}
            </FormSection>

            <FormSection title={t("websiteSeo.section.visibility", "Hiển thị với công cụ tìm kiếm")}>
              <FormField label={t("websiteSeo.robotsIndexable", "Cho phép công cụ tìm kiếm lập chỉ mục website này")}>
                <Switch checked={robotsIndexable} onCheckedChange={(checked) => setValue("robotsIndexable", checked)} />
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
