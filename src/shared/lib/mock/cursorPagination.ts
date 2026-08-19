import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

/** The shape a real cursor-paginated endpoint should return — `nextCursor` is opaque from the caller's point of view, never assumed to be a page number. */
export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Mock cursor pagination over an in-memory array, walking forward from the start. `cursor` is the
 * index to resume from — an implementation detail of this mock, not a contract the UI should rely
 * on (a real backend's cursor would be an opaque token). Simulates ~2s network delay per the
 * task's requirement so the loading state is actually visible while testing.
 */
export async function paginateForward<T>(all: T[], params: { cursor?: string | null; limit: number }): Promise<CursorPage<T>> {
  await simulateLatency(undefined, 1800, 2200);
  const startIndex = params.cursor ? Number(params.cursor) : 0;
  const items = all.slice(startIndex, startIndex + params.limit);
  const nextIndex = startIndex + items.length;
  const hasMore = nextIndex < all.length;
  return { items, nextCursor: hasMore ? String(nextIndex) : null, hasMore };
}

/**
 * Mock cursor pagination walking *backward* from the end — for message history, where the first
 * page is the most recent messages and "load more" means older ones. `cursor` is the exclusive
 * end index to resume from.
 */
export async function paginateBackward<T>(all: T[], params: { cursor?: string | null; limit: number }): Promise<CursorPage<T>> {
  await simulateLatency(undefined, 1800, 2200);
  const endIndex = params.cursor ? Number(params.cursor) : all.length;
  const startIndex = Math.max(0, endIndex - params.limit);
  const items = all.slice(startIndex, endIndex);
  const hasMore = startIndex > 0;
  return { items, nextCursor: hasMore ? String(startIndex) : null, hasMore };
}
