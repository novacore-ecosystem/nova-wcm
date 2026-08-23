import type { EditorJsBlock, EditorJsDocument } from "@/services/content";
import { sanitizeInlineHtml } from "@/features/content/lib/sanitizeInlineHtml";

function text(data: Record<string, unknown>, field: string): string {
  const value = data[field];
  return typeof value === "string" ? value : "";
}

function renderBlock(block: EditorJsBlock, index: number) {
  const key = block.id ?? index;

  switch (block.type) {
    case "header": {
      const level = Math.min(Math.max(Number(block.data.level) || 2, 2), 4);
      const Tag = `h${level}` as "h2" | "h3" | "h4";
      return <Tag key={key} className="font-semibold" dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(text(block.data, "text")) }} />;
    }

    case "paragraph":
      return <p key={key} dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(text(block.data, "text")) }} />;

    case "list": {
      const items = Array.isArray(block.data.items) ? (block.data.items as unknown[]) : [];
      const ordered = block.data.style === "ordered";
      const ListTag = ordered ? "ol" : "ul";
      return (
        <ListTag key={key} className={ordered ? "list-decimal pl-5" : "list-disc pl-5"}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(typeof item === "string" ? item : "") }} />
          ))}
        </ListTag>
      );
    }

    case "quote": {
      const caption = text(block.data, "caption");
      return (
        <blockquote key={key} className="border-l-2 border-border pl-3 text-muted-foreground">
          <p dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(text(block.data, "text")) }} />
          {caption ? <cite className="mt-1 block text-xs not-italic">{caption}</cite> : null}
        </blockquote>
      );
    }

    // Unknown block types (any tool not in this app's editor config) are skipped rather than
    // crashing the reader — a block this renderer doesn't understand yet shouldn't break the page.
    default:
      return null;
  }
}

/**
 * Read-only Editor.js renderer — deliberately does not instantiate `@editorjs/editorjs` itself
 * (see `ContentEditor`, the interactive counterpart): the public reader has no need for the
 * editor's toolbox/JS bundle, just a mapping from the same block JSON to plain JSX. Only the block
 * types this app's `ContentEditor` actually offers (header/paragraph/list/quote) are rendered.
 */
export function ContentBlocksRenderer({ value }: { value: EditorJsDocument }) {
  if (value.blocks.length === 0) {
    return <p className="text-sm text-muted-foreground">No content.</p>;
  }

  return <div className="flex flex-col gap-4 text-sm leading-relaxed">{value.blocks.map(renderBlock)}</div>;
}
