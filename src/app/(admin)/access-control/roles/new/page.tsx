"use client";

import { useRouter } from "next/navigation";
import { AccessControlPermissions, PermissionBoundary, RoleEditorPage } from "@novacore/frontend-next-shadcn";

import { wcmPermissionDefinitions } from "@/features/access-control";

export default function Page() {
  const router = useRouter();

  return (
    <PermissionBoundary permission={AccessControlPermissions.role.manage}>
      <RoleEditorPage
        permissions={wcmPermissionDefinitions}
        onBack={() => router.push("/access-control/roles")}
        onSaved={(role) => router.replace(`/access-control/roles/${role.id}`)}
      />
    </PermissionBoundary>
  );
}
