import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { createMockCollection } from "@/shared/lib/mock/mockCollection";
import { simulateLatency } from "@/shared/lib/mock/simulateLatency";
import type { AiContextGroup, PersonalAiContext } from "@/services/ai-context/ai-context.types";

const seed: AiContextGroup[] = [
  {
    id: "ctx-brand-voice",
    name: "Brand voice",
    category: "brand",
    scope: "global",
    content:
      "Nova Home nói chuyện thân thiện, thực tế, không dùng ngôn ngữ quảng cáo cường điệu. Ưu tiên câu ngắn, ví dụ cụ thể. Xưng \"chúng tôi\", gọi khách là \"bạn\".",
    assignedCount: 12,
    updatedAt: "2026-08-05T09:00:00+07:00",
  },
  {
    id: "ctx-product-line",
    name: "Product line context",
    category: "products",
    scope: "global",
    content: "Dòng sản phẩm chính: nội thất gỗ tự nhiên (sồi, thông), ghế công thái học, và phụ kiện trang trí. Phân khúc: hộ gia đình trẻ, 65-120m².",
    assignedCount: 12,
    updatedAt: "2026-08-01T10:30:00+07:00",
  },
  {
    id: "ctx-seo-rules",
    name: "SEO rules",
    category: "seoRules",
    scope: "group",
    content: "Meta title dưới 60 ký tự, meta description 120-160 ký tự. Luôn chèn từ khóa chính trong H1 và đoạn mở đầu. Không nhồi nhét từ khóa.",
    assignedCount: 4,
    updatedAt: "2026-07-20T14:00:00+07:00",
  },
  {
    id: "ctx-support-style",
    name: "Customer support tone",
    category: "customerSupport",
    scope: "group",
    content: "Luôn xác nhận vấn đề của khách trước khi đề xuất giải pháp. Không hứa thời gian giao hàng cụ thể nếu chưa xác nhận với kho.",
    assignedCount: 3,
    updatedAt: "2026-08-10T11:15:00+07:00",
  },
];

const collection = createMockCollection<AiContextGroup>(seed, { entityName: "AI context group", keywordFields: ["name", "content"] });

let personalContext: PersonalAiContext = { content: "", updatedAt: "2026-08-01T00:00:00+07:00" };

export const aiContextService = {
  listGroups: (request?: CriteriaRequest) => collection.list(request),
  listAllGroups: () => collection.listAll(),
  getGroup: (id: string) => collection.get(id),
  createGroup: (row: AiContextGroup) => collection.create(row),
  updateGroup: (id: string, patch: Partial<AiContextGroup>) => collection.update(id, patch),
  removeGroup: (id: string) => collection.remove(id),

  async getPersonalContext(): Promise<PersonalAiContext> {
    return simulateLatency(personalContext);
  },
  async updatePersonalContext(content: string): Promise<PersonalAiContext> {
    personalContext = { content, updatedAt: new Date().toISOString() };
    return simulateLatency(personalContext);
  },
};
