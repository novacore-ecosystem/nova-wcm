import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { createMockCollection } from "@/shared/lib/mock/mockCollection";
import type { MediaAsset } from "@/services/media/media.types";

/**
 * Seed content mirrors a small Vietnamese furniture/home-goods business (see docs/plan.md's
 * "furniture/home-goods" seed direction used across WCM services). `url`/`thumbnailUrl` point
 * at picsum.photos with a unique seed per asset so thumbnails render distinct real images;
 * document rows have no thumbnail (rendered with a file icon in the UI instead).
 */
const seed: MediaAsset[] = [
  {
    id: "media-1",
    fileName: "logo-cong-ty-2026.png",
    url: "https://picsum.photos/seed/nova-logo-2026/480/320",
    thumbnailUrl: "https://picsum.photos/seed/nova-logo-2026/480/320",
    mimeType: "image/png",
    sizeBytes: 184_320,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Logo công ty nội thất Nova Home",
    uploadedAt: "2026-06-02T08:15:00+07:00",
  },
  {
    id: "media-2",
    fileName: "banner-khuyen-mai-thang-8.jpg",
    url: "https://picsum.photos/seed/banner-km-t8/480/320",
    thumbnailUrl: "https://picsum.photos/seed/banner-km-t8/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 742_500,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Banner khuyến mãi tháng 8 giảm giá đến 30%",
    uploadedAt: "2026-08-10T09:00:00+07:00",
  },
  {
    id: "media-3",
    fileName: "banner-trang-chu-slide-1.jpg",
    url: "https://picsum.photos/seed/banner-home-1/480/320",
    thumbnailUrl: "https://picsum.photos/seed/banner-home-1/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 1_180_000,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Không gian phòng khách với sofa và bàn trà gỗ sồi",
    uploadedAt: "2026-05-20T14:30:00+07:00",
  },
  {
    id: "media-4",
    fileName: "banner-trang-chu-slide-2.jpg",
    url: "https://picsum.photos/seed/banner-home-2/480/320",
    thumbnailUrl: "https://picsum.photos/seed/banner-home-2/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 1_050_200,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Phòng ngủ trang trí theo phong cách tối giản",
    uploadedAt: "2026-05-20T14:32:00+07:00",
  },
  {
    id: "media-5",
    fileName: "ban-an-go-soi-6-cho-01.jpg",
    url: "https://picsum.photos/seed/ban-an-go-soi-01/480/320",
    thumbnailUrl: "https://picsum.photos/seed/ban-an-go-soi-01/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 612_800,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Bàn ăn gỗ sồi tự nhiên 6 chỗ ngồi, góc chụp chính diện",
    uploadedAt: "2026-07-14T10:05:00+07:00",
  },
  {
    id: "media-6",
    fileName: "ban-an-go-soi-6-cho-02.jpg",
    url: "https://picsum.photos/seed/ban-an-go-soi-02/480/320",
    thumbnailUrl: "https://picsum.photos/seed/ban-an-go-soi-02/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 598_100,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Bàn ăn gỗ sồi tự nhiên 6 chỗ ngồi, góc chụp cận vân gỗ",
    uploadedAt: "2026-07-14T10:07:00+07:00",
  },
  {
    id: "media-7",
    fileName: "ghe-sofa-vai-boc-mau-xam.jpg",
    url: "https://picsum.photos/seed/ghe-sofa-xam/480/320",
    thumbnailUrl: "https://picsum.photos/seed/ghe-sofa-xam/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 887_400,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Ghế sofa băng bọc vải màu xám đặt trong phòng khách",
    uploadedAt: "2026-07-18T16:20:00+07:00",
  },
  {
    id: "media-8",
    fileName: "ghe-lam-viec-cong-thai-hoc-ergoflex.jpg",
    url: "https://picsum.photos/seed/ghe-ergoflex/480/320",
    thumbnailUrl: "https://picsum.photos/seed/ghe-ergoflex/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 455_900,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Ghế làm việc công thái học ErgoFlex Pro màu đen",
    uploadedAt: "2026-08-01T11:45:00+07:00",
  },
  {
    id: "media-9",
    fileName: "tu-quan-ao-3-canh-go-cong-nghiep.jpg",
    url: "https://picsum.photos/seed/tu-quan-ao-3canh/480/320",
    thumbnailUrl: "https://picsum.photos/seed/tu-quan-ao-3canh/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 703_300,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Tủ quần áo 3 cánh gỗ công nghiệp phủ melamine",
    uploadedAt: "2026-06-25T09:10:00+07:00",
  },
  {
    id: "media-10",
    fileName: "giuong-ngu-go-tu-nhien-1m8.jpg",
    url: "https://picsum.photos/seed/giuong-ngu-1m8/480/320",
    thumbnailUrl: "https://picsum.photos/seed/giuong-ngu-1m8/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 964_700,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Giường ngủ gỗ tự nhiên 1m8 kèm đầu giường bọc nệm",
    uploadedAt: "2026-06-28T13:50:00+07:00",
  },
  {
    id: "media-11",
    fileName: "ke-sach-go-thong-5-tang.jpg",
    url: "https://picsum.photos/seed/ke-sach-go-thong/480/320",
    thumbnailUrl: "https://picsum.photos/seed/ke-sach-go-thong/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 389_600,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Kệ sách gỗ thông 5 tầng đặt cạnh cửa sổ",
    uploadedAt: "2026-07-02T15:00:00+07:00",
  },
  {
    id: "media-12",
    fileName: "den-tran-phong-khach-hien-dai.jpg",
    url: "https://picsum.photos/seed/den-tran-phong-khach/480/320",
    thumbnailUrl: "https://picsum.photos/seed/den-tran-phong-khach/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 512_000,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Đèn trần phòng khách kiểu dáng hiện đại",
    uploadedAt: "2026-07-05T08:40:00+07:00",
  },
  {
    id: "media-13",
    fileName: "tham-trai-san-phong-khach.jpg",
    url: "https://picsum.photos/seed/tham-trai-san/480/320",
    thumbnailUrl: "https://picsum.photos/seed/tham-trai-san/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 421_800,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Thảm trải sàn họa tiết hình học cho phòng khách",
    uploadedAt: "2026-07-08T10:25:00+07:00",
  },
  {
    id: "media-14",
    fileName: "showroom-mat-tien-quan-1.jpg",
    url: "https://picsum.photos/seed/showroom-mat-tien/480/320",
    thumbnailUrl: "https://picsum.photos/seed/showroom-mat-tien/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 1_320_400,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Mặt tiền showroom nội thất tại Quận 1",
    uploadedAt: "2026-04-12T09:00:00+07:00",
  },
  {
    id: "media-15",
    fileName: "showroom-noi-that-tang-2.jpg",
    url: "https://picsum.photos/seed/showroom-tang2/480/320",
    thumbnailUrl: "https://picsum.photos/seed/showroom-tang2/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 1_205_900,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Không gian trưng bày nội thất tầng 2 của showroom",
    uploadedAt: "2026-04-12T09:05:00+07:00",
  },
  {
    id: "media-16",
    fileName: "doi-ngu-nhan-vien.jpg",
    url: "https://picsum.photos/seed/doi-ngu-nhan-vien/480/320",
    thumbnailUrl: "https://picsum.photos/seed/doi-ngu-nhan-vien/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 678_300,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Đội ngũ nhân viên cửa hàng chụp ảnh tập thể",
    uploadedAt: "2026-03-30T16:00:00+07:00",
  },
  {
    id: "media-17",
    fileName: "doi-ngu-tu-van-thiet-ke.jpg",
    url: "https://picsum.photos/seed/doi-ngu-tu-van/480/320",
    thumbnailUrl: "https://picsum.photos/seed/doi-ngu-tu-van/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 590_100,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Đội ngũ tư vấn thiết kế nội thất đang trao đổi với khách hàng",
    uploadedAt: "2026-03-30T16:05:00+07:00",
  },
  {
    id: "media-18",
    fileName: "hinh-anh-khach-hang-nhan-hang.jpg",
    url: "https://picsum.photos/seed/khach-hang-nhan-hang/480/320",
    thumbnailUrl: "https://picsum.photos/seed/khach-hang-nhan-hang/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 534_700,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Khách hàng nhận bàn giao sản phẩm tại showroom",
    uploadedAt: "2026-08-05T14:15:00+07:00",
  },
  {
    id: "media-19",
    fileName: "anh-bia-facebook-fanpage.jpg",
    url: "https://picsum.photos/seed/anh-bia-fanpage/480/320",
    thumbnailUrl: "https://picsum.photos/seed/anh-bia-fanpage/480/320",
    mimeType: "image/jpeg",
    sizeBytes: 812_600,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Ảnh bìa trang Facebook giới thiệu bộ sưu tập mùa hè",
    uploadedAt: "2026-08-12T10:30:00+07:00",
  },
  {
    id: "media-20",
    fileName: "icon-favicon-website.png",
    url: "https://picsum.photos/seed/favicon-icon/480/320",
    thumbnailUrl: "https://picsum.photos/seed/favicon-icon/480/320",
    mimeType: "image/png",
    sizeBytes: 102_600,
    kind: "image",
    width: 480,
    height: 320,
    altText: "Biểu tượng favicon của website",
    uploadedAt: "2026-06-02T08:20:00+07:00",
  },
  {
    id: "media-21",
    fileName: "bao-gia-noi-that-2026.pdf",
    url: "https://example-files.novawcm.dev/documents/bao-gia-noi-that-2026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1_842_300,
    kind: "document",
    uploadedAt: "2026-07-22T09:00:00+07:00",
  },
  {
    id: "media-22",
    fileName: "catalogue-san-pham-thu-dong-2026.pdf",
    url: "https://example-files.novawcm.dev/documents/catalogue-san-pham-thu-dong-2026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 2_950_100,
    kind: "document",
    uploadedAt: "2026-08-03T11:10:00+07:00",
  },
  {
    id: "media-23",
    fileName: "chinh-sach-bao-hanh-noi-that.pdf",
    url: "https://example-files.novawcm.dev/documents/chinh-sach-bao-hanh-noi-that.pdf",
    mimeType: "application/pdf",
    sizeBytes: 386_400,
    kind: "document",
    typeMetadata: { kind: "document", pageCount: 4 },
    uploadedAt: "2026-02-18T08:30:00+07:00",
  },
  {
    id: "media-24",
    fileName: "gioi-thieu-showroom-quan-1.mp4",
    url: "https://example-files.novawcm.dev/videos/gioi-thieu-showroom-quan-1.mp4",
    mimeType: "video/mp4",
    sizeBytes: 18_420_000,
    kind: "video",
    typeMetadata: { kind: "video", durationSeconds: 96 },
    altText: "Video giới thiệu showroom nội thất tại Quận 1",
    uploadedAt: "2026-05-02T10:00:00+07:00",
  },
  {
    id: "media-25",
    fileName: "huong-dan-lap-rap-ban-an.mp4",
    url: "https://example-files.novawcm.dev/videos/huong-dan-lap-rap-ban-an.mp4",
    mimeType: "video/mp4",
    sizeBytes: 24_680_000,
    kind: "video",
    typeMetadata: { kind: "video", durationSeconds: 214 },
    altText: "Video hướng dẫn lắp ráp bàn ăn gỗ sồi tại nhà",
    uploadedAt: "2026-07-11T15:40:00+07:00",
  },
  {
    id: "media-26",
    fileName: "nhac-nen-video-quang-cao.mp3",
    url: "https://example-files.novawcm.dev/audio/nhac-nen-video-quang-cao.mp3",
    mimeType: "audio/mpeg",
    sizeBytes: 3_140_000,
    kind: "audio",
    typeMetadata: { kind: "audio", durationSeconds: 128 },
    uploadedAt: "2026-06-15T09:30:00+07:00",
  },
];

const collection = createMockCollection<MediaAsset>(seed, {
  entityName: "Media asset",
  keywordFields: ["fileName", "altText"],
});

export const listMediaAssets = (request?: CriteriaRequest) => collection.list(request);
export const getMediaAsset = (id: string) => collection.get(id);
export const updateMediaAsset = (id: string, patch: Partial<MediaAsset>) => collection.update(id, patch);
export const removeMediaAsset = (id: string) => collection.remove(id);

export interface CreateMediaAssetInput {
  fileName: string;
  altText?: string;
}

const DOCUMENT_EXTENSIONS = new Set(["pdf", "doc", "docx", "xls", "xlsx"]);
const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "webm"]);
const AUDIO_EXTENSIONS = new Set(["mp3", "wav", "ogg"]);

function inferAssetShape(fileName: string): { mimeType: string; kind: MediaAsset["kind"] } {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (DOCUMENT_EXTENSIONS.has(extension)) return { mimeType: "application/pdf", kind: "document" };
  if (VIDEO_EXTENSIONS.has(extension)) return { mimeType: "video/mp4", kind: "video" };
  if (AUDIO_EXTENSIONS.has(extension)) return { mimeType: "audio/mpeg", kind: "audio" };
  if (extension === "png") return { mimeType: "image/png", kind: "image" };
  return { mimeType: "image/jpeg", kind: "image" };
}

/** Mocked "upload": no real storage exists yet (docs/plan.md §13), so this fabricates a plausible URL/size from the given file name. */
export async function createMediaAsset(input: CreateMediaAssetInput): Promise<MediaAsset> {
  const id = `media-${crypto.randomUUID()}`;
  const { mimeType, kind } = inferAssetShape(input.fileName);
  const isImage = kind === "image";
  const picsumUrl = `https://picsum.photos/seed/${id}/480/320`;
  const assetFolder = { video: "videos", audio: "audio", document: "documents", image: "images" }[kind];

  const row: MediaAsset = {
    id,
    fileName: input.fileName,
    url: isImage ? picsumUrl : `https://example-files.novawcm.dev/${assetFolder}/${input.fileName}`,
    thumbnailUrl: isImage ? picsumUrl : undefined,
    mimeType,
    sizeBytes: Math.round(120_000 + Math.random() * 2_800_000),
    kind,
    width: isImage ? 480 : undefined,
    height: isImage ? 320 : undefined,
    altText: input.altText,
    uploadedAt: new Date().toISOString(),
  };

  return collection.create(row);
}
