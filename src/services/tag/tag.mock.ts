import { createMockCollection } from "@/shared/lib/mock/mockCollection";
import type { Tag } from "@/services/tag/types";

const SEED: Tag[] = [
  { id: "tag-noi-that-go", name: "Nội thất gỗ", slug: "noi-that-go", articleCount: 7 },
  { id: "tag-phong-khach", name: "Phòng khách", slug: "phong-khach", articleCount: 5 },
  { id: "tag-phong-ngu", name: "Phòng ngủ", slug: "phong-ngu", articleCount: 4 },
  { id: "tag-tiet-kiem-dien-tich", name: "Tiết kiệm diện tích", slug: "tiet-kiem-dien-tich", articleCount: 6 },
  { id: "tag-phong-cach-toi-gian", name: "Phong cách tối giản", slug: "phong-cach-toi-gian", articleCount: 3 },
  { id: "tag-bao-quan-do-go", name: "Bảo quản đồ gỗ", slug: "bao-quan-do-go", articleCount: 4 },
  { id: "tag-mua-sam-thong-minh", name: "Mua sắm thông minh", slug: "mua-sam-thong-minh", articleCount: 2 },
];

export const tagCollection = createMockCollection(SEED, { entityName: "Tag", keywordFields: ["name", "slug"] });
