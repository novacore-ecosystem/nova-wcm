import type { ReactNode } from "react";

/**
 * A tiny, dependency-free block-level renderer for the article editor's Preview tab —
 * headings (`# `), bullet lists (`- `), and paragraphs (blank-line separated). No inline
 * emphasis parsing and no `dangerouslySetInnerHTML` — every token becomes a plain React
 * element, so there is no HTML-injection surface. Good enough for a lightweight business
 * blog; a full markdown/rich-text engine is out of scope here (see docs/plan.md).
 */
export function renderMarkdownLite(content: string): ReactNode {
  const blocks: ReactNode[] = [];
  const lines = content.split("\n");
  let listBuffer: string[] = [];

  function flushList() {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="ml-5 list-disc space-y-1">
        {listBuffer.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>,
    );
    listBuffer = [];
  }

  let paragraphBuffer: string[] = [];
  function flushParagraph() {
    if (paragraphBuffer.length === 0) return;
    blocks.push(<p key={`p-${blocks.length}`}>{paragraphBuffer.join(" ")}</p>);
    paragraphBuffer = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("# ")) {
      flushList();
      flushParagraph();
      blocks.push(
        <h2 key={`h-${blocks.length}`} className="text-lg font-semibold">
          {line.slice(2)}
        </h2>,
      );
    } else if (line.startsWith("- ")) {
      flushParagraph();
      listBuffer.push(line.slice(2));
    } else if (line === "") {
      flushList();
      flushParagraph();
    } else {
      flushList();
      paragraphBuffer.push(line);
    }
  }
  flushList();
  flushParagraph();

  return <div className="prose-sm flex flex-col gap-3 text-sm leading-relaxed">{blocks}</div>;
}
