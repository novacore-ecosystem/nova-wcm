import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

export interface DashboardStat {
  totalProducts: number;
  publishedProducts: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  mediaCount: number;
}

export type RecentActivityKind = "article" | "product" | "media" | "page";

export interface RecentActivityItem {
  id: string;
  kind: RecentActivityKind;
  title: string;
  detail: string;
  updatedAt: string;
}

/**
 * Mirrors what a real `GET /wcm/dashboard/summary` aggregation endpoint would return — a
 * dedicated stats read model, not a client-side join across Catalog/Content/Media's own
 * collections (see docs/plan.md §7 — module boundaries). Swapping this for a real call is a
 * one-file change with no UI impact.
 */
export async function getDashboardSummary(): Promise<DashboardStat> {
  return simulateLatency({
    totalProducts: 48,
    publishedProducts: 41,
    totalArticles: 26,
    publishedArticles: 19,
    draftArticles: 7,
    mediaCount: 132,
  });
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  return simulateLatency([
    {
      id: "act-1",
      kind: "article",
      title: "5 mẹo giữ nhà cửa gọn gàng mùa mưa",
      detail: "Xuất bản bởi Minh Anh",
      updatedAt: "2026-08-16T09:20:00+07:00",
    },
    {
      id: "act-2",
      kind: "product",
      title: "Ghế làm việc công thái học ErgoFlex Pro",
      detail: "Cập nhật giá và mô tả",
      updatedAt: "2026-08-15T15:05:00+07:00",
    },
    {
      id: "act-3",
      kind: "media",
      title: "Bộ ảnh sản phẩm bàn gỗ sồi tự nhiên",
      detail: "8 ảnh mới được tải lên",
      updatedAt: "2026-08-15T11:40:00+07:00",
    },
    {
      id: "act-4",
      kind: "article",
      title: "Hướng dẫn chọn nệm phù hợp cho gia đình",
      detail: "Bản nháp đang chờ duyệt",
      updatedAt: "2026-08-14T17:10:00+07:00",
    },
    {
      id: "act-5",
      kind: "page",
      title: "Trang Giới thiệu",
      detail: "Cập nhật nội dung đội ngũ",
      updatedAt: "2026-08-13T08:30:00+07:00",
    },
  ]);
}
