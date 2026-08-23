const ALLOWED_TAGS = new Set(["b", "strong", "i", "em", "u", "mark", "code", "br", "a"]);

/**
 * Editor.js's inline toolbar (Bold/Italic/Marker/Inline Code/Link) writes small HTML fragments
 * directly into a block's `data.text`/`data.items[]`/`data.caption` — there is no separate
 * "rich text" type, the string itself carries the markup. Rendering that with
 * `dangerouslySetInnerHTML` needs an allowlist boundary even though this content comes from
 * authenticated editors (not public submissions), since Editor.js round-trips whatever a paste
 * operation puts in the DOM. No sanitizer library exists anywhere in this monorepo (checked) —
 * this is a small, deliberately conservative regex allowlist rather than a full HTML parser: it
 * strips any tag not in {@link ALLOWED_TAGS} (both open and close), drops all attributes except a
 * validated `href` on `<a>`, and works identically in SSR and the browser (no `DOMParser`
 * dependency). Not intended to handle malformed/deeply nested markup perfectly — only to keep
 * `<script>`/event-handler-bearing/arbitrary-attribute markup out of the rendered DOM.
 */
export function sanitizeInlineHtml(html: string): string {
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, rawTag: string, attrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";

    if (match.startsWith("</")) return `</${tag}>`;

    if (tag === "a") {
      const hrefMatch = /href\s*=\s*"([^"]*)"/i.exec(attrs) ?? /href\s*=\s*'([^']*)'/i.exec(attrs);
      const href = hrefMatch?.[1] ?? "";
      const safeHref = /^(https?:|mailto:|\/)/i.test(href) ? href : "#";
      return `<a href="${safeHref.replace(/"/g, "&quot;")}" target="_blank" rel="noopener noreferrer">`;
    }

    return `<${tag}>`;
  });
}
