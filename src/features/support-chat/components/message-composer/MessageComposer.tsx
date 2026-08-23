"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { Button, Textarea, Tooltip } from "@novacore/frontend-next-shadcn";

/**
 * Text-only today, but the slots for attachments/emoji are already here so the composer doesn't
 * need a redesign once those exist — they're visibly present (discoverable), just inert (no fake
 * upload API). `onTyping`/`onStopTyping` drive `ChatHub.StartTyping`/`StopTyping` — optional so
 * the guest widget (which never connects to the hub) can reuse this same component later if
 * needed without wiring anything.
 */
export function MessageComposer({
  disabled,
  disabledReason,
  onSend,
  isSending,
  onTyping,
  onStopTyping,
}: {
  disabled?: boolean;
  disabledReason?: string;
  onSend: (body: string) => void;
  isSending: boolean;
  onTyping?: () => void;
  onStopTyping?: () => void;
}) {
  const [draft, setDraft] = useState("");

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setDraft("");
    onStopTyping?.();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex shrink-0 flex-col gap-1.5 border-t border-border p-3">
      {disabled && disabledReason ? <p className="text-xs text-muted-foreground">{disabledReason}</p> : null}
      <div className="flex items-end gap-2">
        <Tooltip content="Attach a file (coming soon)">
          <span>
            <Button type="button" variant="ghost" size="icon" disabled>
              <Paperclip className="size-4" />
            </Button>
          </span>
        </Tooltip>
        <Tooltip content="Emoji / stickers (coming soon)">
          <span>
            <Button type="button" variant="ghost" size="icon" disabled>
              <Smile className="size-4" />
            </Button>
          </span>
        </Tooltip>
        <Textarea
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (event.target.value.trim()) onTyping?.();
            else onStopTyping?.();
          }}
          onBlur={() => onStopTyping?.()}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "You can't reply here" : "Type a message… (Enter to send, Shift+Enter for a new line)"}
          disabled={disabled}
          rows={1}
          className="max-h-32 min-h-9 flex-1 resize-none py-2"
        />
        <Button type="button" size="icon" disabled={disabled || !draft.trim()} loading={isSending} onClick={submit} aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
