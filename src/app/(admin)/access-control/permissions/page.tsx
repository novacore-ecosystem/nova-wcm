import { AccessControlPermissions, PermissionBoundary, PermissionManagement } from "@novacore/frontend-next-shadcn";

import { wcmPermissionDefinitions } from "@/features/access-control";

export default function Page() {
  return (
    <PermissionBoundary permission={AccessControlPermissions.permission.view}>
      <PermissionManagement permissions={wcmPermissionDefinitions} />
    </PermissionBoundary>
  );
}
