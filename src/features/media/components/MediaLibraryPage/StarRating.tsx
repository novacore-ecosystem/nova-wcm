"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@novacore/frontend-next-shadcn";

/** A real interactive rating control — clickable stars with hover preview, not a bare number input. Keyboard-operable via native button focus + Enter/Space, arrow keys step the value. */
export function StarRating({
  value,
  onChange,
  max = 5,
  disabled,
}: {
  value: number | undefined;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value ?? 0;

  function handleKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;
    const current = value ?? 0;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      onChange(Math.min(max, current + 1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      onChange(Math.max(0, current - 1));
    }
  }

  return (
    <div role="radiogroup" aria-label="Rating" className="flex items-center gap-0.5" onKeyDown={handleKeyDown}>
      {Array.from({ length: max }, (_, index) => index + 1).map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          disabled={disabled}
          onClick={() => onChange(value === star ? 0 : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="rounded p-0.5 text-muted-foreground transition-colors hover:text-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <Star className={cn("size-5", star <= display && "fill-warning text-warning")} />
        </button>
      ))}
      {value ? <span className="ml-1.5 text-xs text-muted-foreground">{value}/{max}</span> : null}
    </div>
  );
}
