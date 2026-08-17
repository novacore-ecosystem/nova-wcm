import { AccessControlPermissions, PermissionBoundary, RoleManagement } from "@novacore/frontend-next-shadcn";

import { wcmPermissionDefinitions } from "@/features/access-control";

export default function Page() {
  return (
    <PermissionBoundary permission={AccessControlPermissions.role.view}>
      <RoleManagement permissions={wcmPermissionDefinitions} />
    </PermissionBoundary>
  );
}
