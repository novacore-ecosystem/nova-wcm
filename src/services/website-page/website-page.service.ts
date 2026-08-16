import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { createMockCollection } from "@/shared/lib/mock/mockCollection";
import type { WebsitePage, WebsitePageStatus } from "@/services/website-page/website-page.types";

/** Realistic page set for a small Vietnamese furniture/home-goods business site (see docs/plan.md — landing/business admin, not a page builder). */
const seed: WebsitePage[] = [
  {
    id: "wpage-home",
    title: "Trang chủ",
    slug: "trang-chu",
    status: "published",
    content:
      "Nova Home là cửa hàng nội thất gỗ tự nhiên và phụ kiện trang trí cho gia đình Việt. Chúng tôi mang đến những sản phẩm bền đẹp, thiết kế tối giản và giá cả hợp lý. Ghé thăm showroom hoặc đặt hàng trực tuyến để nhận tư vấn miễn phí ngay hôm nay.",
    seoTitle: "Nova Home — Nội thất gỗ tự nhiên cho gia đình Việt",
    seoDescription: "Cửa hàng nội thất gỗ tự nhiên: bàn ghế, giường tủ, phụ kiện trang trí. Thiết kế tối giản, bền đẹp, giá hợp lý, giao hàng toàn quốc.",
    updatedAt: "2026-08-14T09:00:00+07:00",
  },
  {
    id: "wpage-about",
    title: "Giới thiệu",
    slug: "gioi-thieu",
    status: "published",
    content:
      "Thành lập từ năm 2016, Nova Home đã phục vụ hơn 5.000 gia đình trên khắp cả nước. Đội ngũ thiết kế của chúng tôi luôn đặt sự thoải mái và thẩm mỹ lên hàng đầu trong từng sản phẩm. Chúng tôi cam kết sử dụng gỗ tự nhiên có nguồn gốc rõ ràng và quy trình sản xuất thân thiện với môi trường.",
    seoTitle: "Giới thiệu về Nova Home",
    seoDescription: "Tìm hiểu về hành trình phát triển và giá trị cốt lõi của Nova Home — thương hiệu nội thất gỗ tự nhiên uy tín.",
    updatedAt: "2026-08-10T15:30:00+07:00",
  },
  {
    id: "wpage-services",
    title: "Dịch vụ",
    slug: "dich-vu",
    status: "published",
    content:
      "Chúng tôi cung cấp dịch vụ tư vấn thiết kế nội thất trọn gói, đo đạc tại nhà miễn phí và lắp đặt chuyên nghiệp. Đội ngũ kỹ thuật viên giàu kinh nghiệm sẽ hỗ trợ bạn từ khâu lựa chọn sản phẩm đến hoàn thiện không gian sống.",
    seoTitle: "Dịch vụ tư vấn & lắp đặt nội thất — Nova Home",
    seoDescription: "Tư vấn thiết kế nội thất trọn gói, đo đạc miễn phí, lắp đặt chuyên nghiệp trên toàn quốc.",
    updatedAt: "2026-07-30T11:20:00+07:00",
  },
  {
    id: "wpage-contact",
    title: "Liên hệ",
    slug: "lien-he",
    status: "published",
    content:
      "Bạn có thể ghé thăm showroom của chúng tôi tại 123 Nguyễn Trãi, Quận 1, TP.HCM hoặc liên hệ hotline 1900 6868 để được tư vấn. Chúng tôi phục vụ từ 8h00 đến 20h00 tất cả các ngày trong tuần, kể cả cuối tuần và ngày lễ.",
    seoTitle: "Liên hệ với Nova Home",
    seoDescription: "Địa chỉ showroom, hotline và giờ làm việc của Nova Home — sẵn sàng tư vấn nội thất cho gia đình bạn.",
    updatedAt: "2026-08-01T08:45:00+07:00",
  },
  {
    id: "wpage-warranty",
    title: "Chính sách bảo hành",
    slug: "chinh-sach-bao-hanh",
    status: "draft",
    content:
      "Tất cả sản phẩm nội thất tại Nova Home được bảo hành từ 12 đến 24 tháng tùy loại sản phẩm. Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm bị lỗi do nhà sản xuất. Vui lòng giữ hóa đơn mua hàng để được hỗ trợ nhanh chóng.",
    seoTitle: "Chính sách bảo hành sản phẩm — Nova Home",
    seoDescription: "Thông tin chi tiết về thời hạn bảo hành và điều kiện đổi trả sản phẩm nội thất tại Nova Home.",
    updatedAt: "2026-06-18T13:10:00+07:00",
  },
  {
    id: "wpage-careers",
    title: "Tuyển dụng",
    slug: "tuyen-dung",
    status: "draft",
    content:
      "Nova Home đang tìm kiếm nhân viên tư vấn bán hàng và kỹ thuật viên lắp đặt nội thất tại TP.HCM. Ứng viên yêu thích ngành nội thất, nhiệt tình và có tinh thần trách nhiệm cao. Vui lòng gửi hồ sơ về email tuyendung@novahome.vn.",
    seoTitle: "Tuyển dụng — Nova Home",
    seoDescription: "Cơ hội việc làm tại Nova Home — cùng chúng tôi mang nội thất đẹp đến từng gia đình Việt.",
    updatedAt: "2026-05-22T10:00:00+07:00",
  },
];

const collection = createMockCollection<WebsitePage>(seed, {
  entityName: "Website page",
  keywordFields: ["title", "slug"],
});

export const listWebsitePages = (request?: CriteriaRequest) => collection.list(request);
export const getWebsitePage = (id: string) => collection.get(id);
export const removeWebsitePage = (id: string) => collection.remove(id);

export interface WebsitePageInput {
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
}

export async function createWebsitePage(input: WebsitePageInput): Promise<WebsitePage> {
  const row: WebsitePage = {
    id: `wpage-${crypto.randomUUID()}`,
    status: "draft",
    updatedAt: new Date().toISOString(),
    ...input,
  };
  return collection.create(row);
}

export async function updateWebsitePage(id: string, patch: Partial<WebsitePageInput>): Promise<WebsitePage> {
  return collection.update(id, { ...patch, updatedAt: new Date().toISOString() });
}

export async function setWebsitePageStatus(id: string, status: WebsitePageStatus): Promise<WebsitePage> {
  return collection.update(id, { status, updatedAt: new Date().toISOString() });
}
