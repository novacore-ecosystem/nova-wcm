import { AccessControlPermissions, PermissionBoundary, PositionManagement } from "@novacore/frontend-next-shadcn";

import { wcmPermissionDefinitions } from "@/features/access-control";

export default function Page() {
  return (
    <PermissionBoundary permission={AccessControlPermissions.position.view}>
      <PositionManagement permissions={wcmPermissionDefinitions} />
    </PermissionBoundary>
  );
}
