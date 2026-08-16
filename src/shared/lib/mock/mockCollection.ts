import {
  applyCriteriaFilters,
  applyCriteriaSorts,
  PAGINATION_DEFAULTS,
  type CriteriaRequest,
  type PaginatedResult,
} from "@novacore/frontend-foundation";

import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

export class MockNotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} "${id}" was not found.`);
    this.name = "MockNotFoundError";
  }
}

interface MockCollectionOptions<T> {
  /** Entity label used in not-found errors, e.g. "Product". */
  entityName: string;
  /** Fields matched (case-insensitive substring) against `keyword`. */
  keywordFields: (keyof T)[];
}

/**
 * An in-memory stand-in for a real search/list backend, deliberately speaking the same
 * `CriteriaRequest` / `PaginatedResult<T>` wire contract a live NovaCore service would (see
 * frontend-foundation's `src/api`). List pages, DataTable, and query hooks built against this
 * are written exactly as they will be against a real API — see docs/plan.md §9-10. Swapping a
 * feature's `api/*.service.ts` mock body for `httpClient` calls is the entire future migration.
 */
export function createMockCollection<T extends { id: string }>(seed: T[], options: MockCollectionOptions<T>) {
  let rows: T[] = [...seed];

  function matchesKeyword(row: T, keyword: string): boolean {
    const needle = keyword.trim().toLowerCase();
    if (!needle) return true;
    return options.keywordFields.some((field) => String(row[field] ?? "").toLowerCase().includes(needle));
  }

  return {
    async list(request: CriteriaRequest = {}): Promise<PaginatedResult<T>> {
      const keyword = request.keyword ?? "";
      let matched = keyword ? rows.filter((row) => matchesKeyword(row, keyword)) : rows;
      matched = applyCriteriaFilters(matched, request.filters ?? []);
      matched = applyCriteriaSorts(matched, request.sorts ?? []);

      const pageSize = request.pageSize ?? PAGINATION_DEFAULTS.pageSize;
      const pageNumber = request.page ?? PAGINATION_DEFAULTS.page;
      const totalCount = matched.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
      const start = (pageNumber - 1) * pageSize;
      const items = matched.slice(start, start + pageSize);

      return simulateLatency({
        items,
        pageNumber,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      });
    },

    async listAll(): Promise<T[]> {
      return simulateLatency([...rows], 80, 200);
    },

    async get(id: string): Promise<T> {
      const row = rows.find((item) => item.id === id);
      await simulateLatency(undefined);
      if (!row) throw new MockNotFoundError(options.entityName, id);
      return row;
    },

    async create(row: T): Promise<T> {
      rows = [row, ...rows];
      return simulateLatency(row);
    },

    async update(id: string, patch: Partial<T>): Promise<T> {
      const index = rows.findIndex((item) => item.id === id);
      if (index === -1) throw new MockNotFoundError(options.entityName, id);
      const updated = { ...rows[index], ...patch };
      rows = [...rows.slice(0, index), updated, ...rows.slice(index + 1)];
      return simulateLatency(updated);
    },

    async remove(id: string): Promise<void> {
      rows = rows.filter((item) => item.id !== id);
      return simulateLatency(undefined);
    },
  };
}
