"use client";

import { useParams, useRouter } from "next/navigation";
import { AccessControlPermissions, PermissionBoundary, RoleEditorPage } from "@novacore/frontend-next-shadcn";

import { wcmPermissionDefinitions } from "@/features/access-control";

export default function Page() {
  const params = useParams<{ roleId: string }>();
  const router = useRouter();

  return (
    <PermissionBoundary permission={AccessControlPermissions.role.manage}>
      <RoleEditorPage
        roleId={params.roleId}
        permissions={wcmPermissionDefinitions}
        onBack={() => router.push("/access-control/roles")}
        onSaved={() => {}}
      />
    </PermissionBoundary>
  );
}
