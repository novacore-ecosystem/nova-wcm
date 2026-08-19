"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue, type DataTablePaginationState } from "@novacore/frontend-next-shadcn";
import { CriteriaOperators, type CriteriaRequest } from "@novacore/frontend-foundation";

import { useAppForm } from "@/shared/forms";
import {
  useCreateMediaAssetMutation,
  useDeleteMediaAssetMutation,
  useDownloadMediaAssetMutation,
  useMediaAssetsQuery,
  useUpdateMediaAssetMutation,
} from "@/features/media/api/media.queries";
import {
  editMediaMetadataSchema,
  editMediaSeoSchema,
  uploadMediaSchema,
  type EditMediaMetadataFormValues,
  type EditMediaSeoFormValues,
  type UploadMediaFormValues,
} from "@/features/media/media.schema";
import { buildTypeMetadata } from "@/features/media/lib/buildTypeMetadata";
import type { MediaAsset, MediaKind } from "@/services/media";

export type MediaTypeFilter = "all" | MediaKind;

export function useMediaLibraryPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>("all");
  const [pagination, setPagination] = useState<DataTablePaginationState>({ pageNumber: 1, pageSize: 12, totalRows: 0 });

  const criteriaRequest = useMemo<CriteriaRequest>(
    () => ({
      keyword: debouncedSearch,
      filters: typeFilter === "all" ? [] : [{ field: "kind", operator: CriteriaOperators.Eq, value: typeFilter }],
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
    }),
    [debouncedSearch, typeFilter, pagination.pageNumber, pagination.pageSize],
  );

  const assetsQuery = useMediaAssetsQuery(criteriaRequest);

  useEffect(() => {
    setPagination((prev) => ({ pageNumber: 1, pageSize: prev.pageSize, totalRows: prev.totalRows }));
  }, [debouncedSearch, typeFilter]);

  const createMutation = useCreateMediaAssetMutation();
  const updateMutation = useUpdateMediaAssetMutation();
  const deleteMutation = useDeleteMediaAssetMutation();
  const downloadMutation = useDownloadMediaAssetMutation();

  function downloadAsset(asset: MediaAsset) {
    downloadMutation.mutate(asset.id);
  }

  const [uploadOpen, setUploadOpen] = useState(false);
  const uploadForm = useAppForm(uploadMediaSchema, { defaultValues: { fileName: "", altText: "" } });

  function openUploadDialog() {
    uploadForm.reset({ fileName: "", altText: "" });
    setUploadOpen(true);
  }

  async function submitUpload(values: UploadMediaFormValues) {
    await createMutation.mutateAsync({ fileName: values.fileName, altText: values.altText || undefined });
    setUploadOpen(false);
  }

  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const seoForm = useAppForm(editMediaSeoSchema, { defaultValues: { altText: "", title: "", description: "" } });
  const metadataForm = useAppForm(editMediaMetadataSchema, {
    defaultValues: { author: "", copyright: "", rating: undefined, durationSeconds: undefined, pageCount: undefined },
  });

  function openPreview(asset: MediaAsset) {
    seoForm.reset({
      altText: asset.altText ?? "",
      title: asset.title ?? "",
      description: asset.description ?? "",
    });
    metadataForm.reset({
      author: asset.author ?? "",
      copyright: asset.copyright ?? "",
      rating: asset.rating,
      durationSeconds: asset.typeMetadata && "durationSeconds" in asset.typeMetadata ? asset.typeMetadata.durationSeconds : undefined,
      pageCount: asset.typeMetadata && "pageCount" in asset.typeMetadata ? asset.typeMetadata.pageCount : undefined,
    });
    setPreviewAsset(asset);
  }

  /** Independent PATCH #1 — General/SEO fields only. Mirrors the future `PATCH /media/{id}/seo`. */
  async function submitSeo(values: EditMediaSeoFormValues) {
    if (!previewAsset) return;
    const updated = await updateMutation.mutateAsync({
      id: previewAsset.id,
      patch: {
        altText: values.altText || undefined,
        title: values.title || undefined,
        description: values.description || undefined,
      },
    });
    setPreviewAsset(updated);
  }

  /** Independent PATCH #2 — descriptive + type-specific metadata. Mirrors the future `PATCH /media/{id}/metadata`. */
  async function submitMetadata(values: EditMediaMetadataFormValues) {
    if (!previewAsset) return;
    const updated = await updateMutation.mutateAsync({
      id: previewAsset.id,
      patch: {
        author: values.author || undefined,
        copyright: values.copyright || undefined,
        rating: values.rating,
        typeMetadata: buildTypeMetadata(previewAsset.kind, values),
      },
    });
    setPreviewAsset(updated);
  }

  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
    if (previewAsset?.id === deleteTarget.id) setPreviewAsset(null);
  }

  return {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    pagination: assetsQuery.data
      ? { pageNumber: assetsQuery.data.pageNumber, pageSize: assetsQuery.data.pageSize, totalRows: assetsQuery.data.totalCount }
      : pagination,
    setPagination,
    assetsQuery,
    uploadOpen,
    setUploadOpen,
    openUploadDialog,
    uploadForm,
    submitUpload,
    isUploading: createMutation.isPending,
    previewAsset,
    setPreviewAsset,
    openPreview,
    seoForm,
    submitSeo,
    metadataForm,
    submitMetadata,
    isSavingMetadata: updateMutation.isPending,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    downloadAsset,
    isDownloading: downloadMutation.isPending,
  };
}
