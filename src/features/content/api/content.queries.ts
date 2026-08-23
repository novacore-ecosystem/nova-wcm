"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { contentService, contentTypeService } from "@/services/content";
import type {
  CreateContentInput,
  CreateContentVersionInput,
  TranslateContentVersionInput,
  UpdateContentDraftInput,
} from "@/services/content";

export const contentTypeKeys = {
  all: ["content-types"] as const,
};

export const contentKeys = {
  all: ["contents"] as const,
  adminSearch: (criteria: CriteriaRequest, limit: number, language?: string) => [...contentKeys.all, "admin-search", criteria, limit, language ?? ""] as const,
  detail: (contentId: string) => [...contentKeys.all, "detail", contentId] as const,
  version: (contentId: string, versionId: string) => [...contentKeys.all, "version", contentId, versionId] as const,
  publishedAll: () => [...contentKeys.all, "published"] as const,
  published: (slug: string, language?: string) => [...contentKeys.publishedAll(), slug, language ?? ""] as const,
};

/** No GET/list endpoint exists for content types — see `contentTypeService.listKnownContentTypes`'s doc comment. Long `staleTime` since this rarely changes within a session. */
export function useContentTypesQuery() {
  return useQuery({ queryKey: contentTypeKeys.all, queryFn: () => contentTypeService.listKnownContentTypes(), staleTime: 5 * 60 * 1000 });
}

/**
 * Admin/WCM content list — real cursor-paginated `POST /contents/admin/search`. `criteria`
 * (filters/sorts/keyword) is part of the query key so a filter change starts a fresh cursor
 * session rather than reusing a stale cache entry (see docs/plan.md-equivalent WCM spec §14).
 */
export function useAdminContentSearchQuery(criteria: CriteriaRequest, limit: number, language?: string) {
  return useInfiniteQuery({
    queryKey: contentKeys.adminSearch(criteria, limit, language),
    queryFn: ({ pageParam }) => contentService.searchAdmin({ criteria, cursor: pageParam, limit, language }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}

export function useContentDetailQuery(contentId: string | undefined) {
  return useQuery({
    queryKey: contentKeys.detail(contentId ?? ""),
    queryFn: () => contentService.getById(contentId as string),
    enabled: !!contentId,
  });
}

export function useContentVersionQuery(contentId: string | undefined, versionId: string | undefined) {
  return useQuery({
    queryKey: contentKeys.version(contentId ?? "", versionId ?? ""),
    queryFn: () => contentService.getVersion(contentId as string, versionId as string),
    enabled: !!contentId && !!versionId,
  });
}

/** Public reader — `GET /contents/published/{slug}`, anonymous-allowed on the service. */
export function usePublishedContentQuery(slug: string, language?: string) {
  return useQuery({
    queryKey: contentKeys.published(slug, language),
    queryFn: () => contentService.getPublishedBySlug(slug, language),
    enabled: !!slug,
  });
}

function useInvalidateAdminSearch() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [...contentKeys.all, "admin-search"] });
}

export function useCreateContentMutation() {
  const invalidateList = useInvalidateAdminSearch();
  return useMutation({
    mutationFn: (input: CreateContentInput) => contentService.create(input),
    onSuccess: () => invalidateList(),
  });
}

export function useCreateContentVersionMutation(contentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateContentVersionInput) => contentService.createVersion(contentId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) }),
  });
}

export function useUpdateContentDraftMutation(contentId: string, versionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateContentDraftInput) => contentService.updateDraft(contentId, versionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
      queryClient.invalidateQueries({ queryKey: contentKeys.version(contentId, versionId) });
    },
  });
}

export function useTranslateContentVersionMutation(contentId: string, versionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TranslateContentVersionInput) => contentService.translateVersion(contentId, versionId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
      queryClient.invalidateQueries({ queryKey: contentKeys.version(contentId, versionId) });
    },
  });
}

export function useRestoreContentVersionMutation(contentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (versionId: string) => contentService.restoreVersion(contentId, versionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) }),
  });
}

export function usePublishContentMutation(contentId: string) {
  const queryClient = useQueryClient();
  const invalidateList = useInvalidateAdminSearch();
  return useMutation({
    mutationFn: (versionId: string) => contentService.publish(contentId, versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
      queryClient.invalidateQueries({ queryKey: contentKeys.publishedAll() });
      invalidateList();
    },
  });
}

export function useDeleteContentMutation() {
  const queryClient = useQueryClient();
  const invalidateList = useInvalidateAdminSearch();
  return useMutation({
    mutationFn: (contentId: string) => contentService.deleteContent(contentId),
    onSuccess: (_result, contentId) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
      invalidateList();
    },
  });
}

export function useRestoreContentMutation() {
  const queryClient = useQueryClient();
  const invalidateList = useInvalidateAdminSearch();
  return useMutation({
    mutationFn: (contentId: string) => contentService.restoreContent(contentId),
    onSuccess: (_result, contentId) => {
      queryClient.invalidateQueries({ queryKey: contentKeys.detail(contentId) });
      invalidateList();
    },
  });
}
