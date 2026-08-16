export function SeoResultPreview({ title, description, slug }: { title: string; description: string; slug: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Search result preview</p>
      <div className="max-w-xl">
        <p className="truncate text-[13px] text-muted-foreground">yourbusiness.vn › blog › {slug || "bai-viet"}</p>
        <p className="truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">{title || "Article title will appear here"}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{description || "Add a meta description so it shows up here, just like on Google."}</p>
      </div>
    </div>
  );
}
