"use client";

import { useEffect, useId, useRef } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import { cn } from "@novacore/frontend-next-shadcn";

import type { EditorJsDocument } from "@/services/content";

const EDITOR_TOOLS = {
  header: { class: Header, config: { levels: [2, 3, 4], defaultLevel: 2 } },
  list: { class: List, inlineToolbar: true },
  quote: { class: Quote, inlineToolbar: true },
};

/**
 * Interactive Editor.js surface. Content stays a real Editor.js `OutputData` document
 * end-to-end — `onChange` fires the same shape Content Service's `Body` field expects
 * (`content.mappers.ts` handles the JSON-string wire encoding at the service boundary, not here).
 *
 * Mounts Editor.js **once** and never re-syncs from an external `value` change in place — Editor.js
 * has no reliable "hot swap the document" API, and forcing a remount is the same fix already
 * established for this codebase's other prop-initialized-form-state components (see
 * `AiModeControl`'s `key` requirement in `.wolf/cerebrum.md`). **Callers switching which
 * content/version/language is being edited MUST change this component's `key`** (e.g.
 * `key={`${contentId}:${versionId}:${language}`}`) so React remounts a fresh instance instead of
 * reusing this one with stale internal state.
 */
export function ContentEditor({
  value,
  onChange,
  placeholder,
  invalid,
  readOnly,
}: {
  value: EditorJsDocument;
  onChange: (document: EditorJsDocument) => void;
  placeholder?: string;
  invalid?: boolean;
  readOnly?: boolean;
}) {
  const holderId = useId().replace(/:/g, "-");
  const editorRef = useRef<EditorJS | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const editor = new EditorJS({
      holder: holderId,
      tools: EDITOR_TOOLS,
      data: value.blocks.length > 0 ? (value as OutputData) : undefined,
      placeholder: placeholder ?? "Start writing…",
      readOnly,
      minHeight: 0,
      onChange: async () => {
        if (!editorRef.current) return;
        const output = await editorRef.current.save();
        onChangeRef.current(output as EditorJsDocument);
      },
    });
    editorRef.current = editor;

    return () => {
      editor.isReady
        .then(() => editor.destroy())
        .catch(() => undefined);
      editorRef.current = null;
    };
    // Mount-once by design — see the doc comment above on why external `value` changes are
    // handled via a `key` change at the call site, not a re-sync effect here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holderId]);

  return (
    <div className={cn("rounded-md border border-border px-3 py-2", invalid && "border-destructive")}>
      <div id={holderId} className="min-h-[280px]" />
    </div>
  );
}
