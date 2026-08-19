"use client";

import { BadgeCheck, UserRound, UserSearch } from "lucide-react";
import { Badge } from "@novacore/frontend-next-shadcn";

import type { CustomerIdentityKind } from "@/services/support-chat";

const CONFIG: Record<CustomerIdentityKind, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  anonymous: { label: "Anonymous visitor", icon: UserRound },
  known: { label: "Known contact", icon: UserSearch },
  authenticated: { label: "Authenticated customer", icon: BadgeCheck },
};

export function CustomerIdentityBadge({ kind }: { kind: CustomerIdentityKind }) {
  const { label, icon: Icon } = CONFIG[kind];
  return (
    <Badge variant={kind === "authenticated" ? "success" : "outline"} className="flex items-center gap-1">
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}
