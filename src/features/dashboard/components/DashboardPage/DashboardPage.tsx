"use client";

import Link from "next/link";
import { FileText, Image as ImageIcon, Newspaper, Package, PenLine, Search, Upload } from "lucide-react";
import { ErrorState, PageContainer, PageHeader, RelativeTime, SkeletonList, StatCard, StatCardRow } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useDashboardSummaryQuery, useRecentActivityQuery } from "@/features/dashboard/api/dashboard.queries";
import type { RecentActivityKind } from "@/services/dashboard/getDashboardSummary";

const ACTIVITY_ICON: Record<RecentActivityKind, React.ReactNode> = {
  article: <Newspaper className="size-4" />,
  product: <Package className="size-4" />,
  media: <ImageIcon className="size-4" />,
  page: <FileText className="size-4" />,
};

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</span>
      {label}
    </Link>
  );
}

export function DashboardPage() {
  const { t } = useAppTranslation();
  const summary = useDashboardSummaryQuery();
  const activity = useRecentActivityQuery();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("dashboard.title", "Chào mừng trở lại")}
          description={t("dashboard.description", "Tổng quan nội dung và tình trạng website của bạn.")}
        />

        {summary.isLoading ? (
          <SkeletonList rows={2} />
        ) : summary.isError ? (
          <ErrorState onRetry={() => summary.refetch()} />
        ) : summary.data ? (
          <StatCardRow>
            <StatCard label={t("dashboard.totalProducts", "Sản phẩm")} value={summary.data.totalProducts} tone="brand" icon={<Package />} />
            <StatCard
              label={t("dashboard.publishedProducts", "Đang hiển thị")}
              value={summary.data.publishedProducts}
              tone="success"
              icon={<Package />}
            />
            <StatCard label={t("dashboard.totalArticles", "Bài viết")} value={summary.data.totalArticles} tone="info" icon={<Newspaper />} />
            <StatCard
              label={t("dashboard.draftArticles", "Bản nháp")}
              value={summary.data.draftArticles}
              tone="warning"
              icon={<PenLine />}
            />
            <StatCard label={t("dashboard.mediaCount", "Tệp trong thư viện")} value={summary.data.mediaCount} icon={<ImageIcon />} />
          </StatCardRow>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold">{t("dashboard.recentActivity", "Hoạt động gần đây")}</h2>
            {activity.isLoading ? (
              <SkeletonList rows={5} />
            ) : activity.isError ? (
              <ErrorState onRetry={() => activity.refetch()} />
            ) : (
              <ul className="divide-y divide-border">
                {activity.data?.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      {ACTIVITY_ICON[item.kind]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <RelativeTime date={item.updatedAt} className="shrink-0 text-xs" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">{t("dashboard.quickActions", "Thao tác nhanh")}</h2>
            <QuickAction href="/catalog/products/new" icon={<Package className="size-4" />} label={t("dashboard.addProduct", "Thêm sản phẩm")} />
            <QuickAction href="/content/articles/new" icon={<PenLine className="size-4" />} label={t("dashboard.writeArticle", "Viết bài mới")} />
            <QuickAction href="/media" icon={<Upload className="size-4" />} label={t("dashboard.uploadMedia", "Tải ảnh lên")} />
            <QuickAction href="/website/seo" icon={<Search className="size-4" />} label={t("dashboard.manageSeo", "Quản lý SEO")} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
