import { createMockCollection } from "@/shared/lib/mock/mockCollection";

export interface MockPosition {
  id: string;
  name: string;
  code?: string;
  description?: string;
  parentId: string | null;
}

const SEED: MockPosition[] = [
  {
    id: "pos-giam-doc",
    name: "Giám đốc điều hành",
    code: "CEO",
    description: "Điều hành toàn bộ hoạt động kinh doanh và nội dung website.",
    parentId: null,
  },
  {
    id: "pos-truong-phong-noi-dung",
    name: "Trưởng phòng Nội dung",
    code: "CONTENT-LEAD",
    description: "Phụ trách kế hoạch nội dung, bài viết và SEO.",
    parentId: "pos-giam-doc",
  },
  {
    id: "pos-truong-phong-kinh-doanh",
    name: "Trưởng phòng Kinh doanh",
    code: "SALES-LEAD",
    description: "Phụ trách danh mục sản phẩm và đơn hàng.",
    parentId: "pos-giam-doc",
  },
  {
    id: "pos-bien-tap-vien",
    name: "Biên tập viên",
    code: "EDITOR",
    description: "Viết và biên tập bài viết, quản lý thư viện ảnh.",
    parentId: "pos-truong-phong-noi-dung",
  },
  {
    id: "pos-nhan-vien-ban-hang",
    name: "Nhân viên bán hàng",
    code: "SALES",
    description: "Cập nhật thông tin sản phẩm và chăm sóc khách hàng.",
    parentId: "pos-truong-phong-kinh-doanh",
  },
];

export const positionCollection = createMockCollection(SEED, {
  entityName: "Position",
  keywordFields: ["name", "code", "description"],
});
