import { simulateLatency } from "@/shared/lib/mock/simulateLatency";
import { getMediaAsset } from "@/services/media/media.service";

export interface MediaDownloadResult {
  url: string;
  fileName: string;
}

/**
 * Isolated so a future real endpoint (e.g. a signed/short-lived download URL, or a proxy that
 * streams the original file) is a one-function swap — no UI component hardcodes a media URL for
 * downloading. Today there is no real file storage (see `createMediaAsset`'s own doc comment), so
 * this just resolves the asset's existing `url` after a mock delay.
 */
export const mediaDownloadService = {
  async getDownloadUrl(id: string): Promise<MediaDownloadResult> {
    const asset = await getMediaAsset(id);
    await simulateLatency(undefined, 150, 400);
    return { url: asset.url, fileName: asset.fileName };
  },
};
