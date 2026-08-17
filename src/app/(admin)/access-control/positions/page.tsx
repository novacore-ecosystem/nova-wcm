import { AccessControlPermissions, PermissionBoundary, PositionManagement } from "@novacore/frontend-next-shadcn";

export default function Page() {
  return (
    <PermissionBoundary permission={AccessControlPermissions.position.view}>
      <PositionManagement />
    </PermissionBoundary>
  );
}
