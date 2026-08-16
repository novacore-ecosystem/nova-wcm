"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useWebsitePageFormPage } from "@/features/website-page/components/WebsitePageFormPage/useWebsitePageFormPage";

export function WebsitePageFormPage({ pageId }: { pageId?: string }) {
  const { t } = useAppTranslation();
  const { isEditMode, isLoading, isError, refetch, form, onSubmit, handleSlugChange, isSubmitting } =
    useWebsitePageFormPage(pageId);
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={isEditMode ? t("websitePage.form.editTitle", "Chỉnh sửa trang") : t("websitePage.form.createTitle", "Thêm trang mới")}
          description={t("websitePage.form.description", "Nội dung này sẽ hiển thị trên trang website của bạn.")}
          breadcrumb={
            <Link href="/website/pages" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" />
              {t("websitePage.form.back", "Quay lại danh sách trang")}
            </Link>
          }
        />

        {isLoading ? (
          <SkeletonList rows={6} />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
            <FormSection title={t("websitePage.form.detailsTitle", "Thông tin trang")}>
              <FormField label={t("websitePage.form.pageTitle", "Tiêu đề")} htmlFor="title" required error={errors.title?.message}>
                <Input id="title" invalid={!!errors.title} {...register("title")} />
              </FormField>
              <FormField
                label={t("websitePage.form.slug", "Đường dẫn")}
                htmlFor="slug"
                required
                description={t("websitePage.form.slugHelp", "Tự động tạo từ tiêu đề — bạn có thể chỉnh sửa nếu cần.")}
                error={errors.slug?.message}
              >
                <Input
                  id="slug"
                  invalid={!!errors.slug}
                  {...register("slug", { onChange: handleSlugChange })}
                />
              </FormField>
            </FormSection>

            <FormSection
              title={t("websitePage.form.contentTitle", "Nội dung")}
              description={t("websitePage.form.contentHelp", "Viết ngắn gọn, dễ đọc lướt.")}
            >
              <FormField htmlFor="content" required error={errors.content?.message}>
                <Textarea id="content" rows={8} invalid={!!errors.content} {...register("content")} />
              </FormField>
            </FormSection>

            <FormSection title={t("websitePage.form.seoTitle", "SEO")}>
              <FormField
                label={t("websitePage.form.seoMetaTitle", "Tiêu đề SEO")}
                htmlFor="seoTitle"
                description={t("websitePage.form.seoMetaTitleHelp", "Hiển thị trên tab trình duyệt và kết quả tìm kiếm.")}
              >
                <Input id="seoTitle" {...register("seoTitle")} />
              </FormField>
              <FormField
                label={t("websitePage.form.seoMetaDescription", "Mô tả SEO")}
                htmlFor="seoDescription"
                description={t("websitePage.form.seoMetaDescriptionHelp", "Đoạn mô tả ngắn hiển thị dưới tiêu đề trên Google.")}
              >
                <Textarea id="seoDescription" rows={3} {...register("seoDescription")} />
              </FormField>
            </FormSection>

            <FormActions>
              <Button type="button" variant="outline" asChild>
                <Link href="/website/pages">{t("common.cancel", "Hủy")}</Link>
              </Button>
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
