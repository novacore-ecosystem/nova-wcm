"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "tiptap-markdown";
import { Code2, Eye } from "lucide-react";
import { cn, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "@novacore/frontend-next-shadcn";

import { EditorToolbar } from "@/features/article/components/ArticleWorkspace/writing/EditorToolbar";

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  invalid,
}: {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  const [mode, setMode] = useState<"visual" | "code">("visual");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
      Markdown.configure({ html: false, tightLists: true, linkify: true }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose-sm min-h-[280px] max-w-none px-3 py-2 focus:outline-none [&_p]:my-2 [&_h2]:mt-3 [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_a]:text-primary [&_a]:underline",
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.storage.markdown.getMarkdown()),
    immediatelyRender: false,
  });

  // Keep the editor in sync when `value` changes from outside (e.g. loading an existing article, or an AI suggestion being accepted).
  useEffect(() => {
    if (!editor) return;
    const currentMarkdown = editor.storage.markdown.getMarkdown();
    if (value !== currentMarkdown) editor.commands.setContent(value, false);
  }, [value, editor]);

  return (
    <Tabs value={mode} onValueChange={(next) => setMode(next as "visual" | "code")}>
      <TabsList>
        <TabsTrigger value="visual">
          <Eye className="mr-1.5 size-3.5" />
          Visual
        </TabsTrigger>
        <TabsTrigger value="code">
          <Code2 className="mr-1.5 size-3.5" />
          Code
        </TabsTrigger>
      </TabsList>

      <TabsContent value="visual">
        {editor ? <EditorToolbar editor={editor} /> : null}
        <div className={cn("rounded-b-md border border-border", invalid && "border-destructive")}>
          <EditorContent editor={editor} />
        </div>
      </TabsContent>

      <TabsContent value="code">
        <Textarea
          rows={14}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn("font-mono text-xs", invalid && "border-destructive")}
          placeholder={placeholder}
        />
      </TabsContent>
    </Tabs>
  );
}
