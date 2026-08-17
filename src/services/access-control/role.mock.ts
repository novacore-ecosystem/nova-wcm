import { createMockCollection } from "@/shared/lib/mock/mockCollection";

export interface MockRole {
  id: string;
  name: string;
  description?: string;
}

const SEED: MockRole[] = [
  { id: "role-admin", name: "Quản trị viên", description: "Toàn quyền quản lý nội dung, danh mục và cài đặt website." },
  { id: "role-content-editor", name: "Biên tập viên nội dung", description: "Quản lý bài viết, chuyên mục và thư viện ảnh." },
  { id: "role-catalog-manager", name: "Quản lý danh mục sản phẩm", description: "Quản lý sản phẩm và danh mục sản phẩm." },
  { id: "role-viewer", name: "Người xem", description: "Chỉ xem, không có quyền chỉnh sửa." },
];

export const roleCollection = createMockCollection(SEED, { entityName: "Role", keywordFields: ["name", "description"] });
