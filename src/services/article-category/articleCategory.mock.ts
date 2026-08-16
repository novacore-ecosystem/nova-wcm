import { createMockCollection } from "@/shared/lib/mock/mockCollection";
import type { ArticleCategory } from "@/services/article-category/types";

const SEED: ArticleCategory[] = [
  {
    id: "cat-meo-trang-tri",
    name: "Mẹo trang trí nhà cửa",
    slug: "meo-trang-tri-nha-cua",
    description: "Ý tưởng bài trí không gian sống đẹp và tiện nghi.",
    status: "active",
    articleCount: 9,
    updatedAt: "2026-08-14T10:12:00+07:00",
  },
  {
    id: "cat-xu-huong-noi-that",
    name: "Xu hướng nội thất",
    slug: "xu-huong-noi-that",
    description: "Cập nhật phong cách và chất liệu nội thất mới nhất.",
    status: "active",
    articleCount: 6,
    updatedAt: "2026-08-12T08:40:00+07:00",
  },
  {
    id: "cat-cham-soc-bao-quan",
    name: "Chăm sóc & bảo quản",
    slug: "cham-soc-bao-quan",
    description: "Hướng dẫn giữ đồ nội thất bền đẹp theo thời gian.",
    status: "active",
    articleCount: 4,
    updatedAt: "2026-08-10T14:00:00+07:00",
  },
  {
    id: "cat-cau-chuyen-khach-hang",
    name: "Câu chuyện khách hàng",
    slug: "cau-chuyen-khach-hang",
    description: "Không gian thực tế của khách hàng đã sử dụng sản phẩm.",
    status: "active",
    articleCount: 3,
    updatedAt: "2026-08-05T09:30:00+07:00",
  },
  {
    id: "cat-tin-tuc-cong-ty",
    name: "Tin tức công ty",
    slug: "tin-tuc-cong-ty",
    description: "Thông báo, sự kiện và cập nhật từ cửa hàng.",
    status: "inactive",
    articleCount: 2,
    updatedAt: "2026-07-28T16:15:00+07:00",
  },
];

export const articleCategoryCollection = createMockCollection(SEED, {
  entityName: "ArticleCategory",
  keywordFields: ["name", "slug"],
});
