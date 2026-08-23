"use client";

import { HttpError } from "@novacore/frontend-foundation";
import { LoadingState } from "@novacore/frontend-next-shadcn";

import { usePublishedContentQuery } from "@/features/content/api/content.queries";
import { ContentBlocksRenderer } from "@/features/content/components/ContentBlocksRenderer";

/**
 * Public reader — `GET /contents/published/{slug}`, anonymous-allowed on the service. Read-only:
 * no editor controls, renders through `ContentBlocksRenderer` (not `ContentEditor`) so the editor
 * runtime never loads for anonymous visitors.
 *
 * Note: the gateway's Content route config applies a blanket `RequireAuth: true` with no
 * per-route exception for the service's three `AllowAnonymous` endpoints (confirmed by reading
 * `YarpApiGateway/appsettings.json` alongside `AuthorizationMiddleware.cs`) — until that's fixed
 * on the backend, this page will get a 401 from the gateway for a signed-out visitor even though
 * Content Service itself would allow the request. Flagged in this task's final report; not
 * something the frontend can work around.
 */
export function PublishedContentPage({ slug, language }: { slug: string; language?: string }) {
  const { data, isLoading, isError, error } = usePublishedContentQuery(slug, language);

  if (isLoading) return <LoadingState />;

  if (isError) {
    const notFound = error instanceof HttpError && error.status === 404;
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 px-6 py-24 text-center">
        <h1 className="text-lg font-semibold">{notFound ? "Not found" : "Something went wrong"}</h1>
        <p className="text-sm text-muted-foreground">{notFound ? "This content isn't published, or doesn't exist." : "Please try again later."}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{data.title}</h1>
        <p className="text-muted-foreground">{data.summary}</p>
        <time dateTime={data.publishedAt} className="text-xs text-muted-foreground">
          {new Date(data.publishedAt).toLocaleDateString()}
        </time>
      </header>
      <ContentBlocksRenderer value={data.body} />
    </article>
  );
}
