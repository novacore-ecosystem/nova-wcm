"use client";

import { Badge } from "@novacore/frontend-next-shadcn";

import type { ConversationPriority } from "@/services/support-chat";

const PRIORITY_CONFIG: Record<ConversationPriority, { label: string; variant: "outline" | "info" | "warning" | "destructive" }> = {
  low: { label: "Low", variant: "outline" },
  normal: { label: "Normal", variant: "outline" },
  high: { label: "High", variant: "warning" },
  urgent: { label: "Urgent", variant: "destructive" },
};

export function PriorityBadge({ priority }: { priority: ConversationPriority }) {
  const config = PRIORITY_CONFIG[priority];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
