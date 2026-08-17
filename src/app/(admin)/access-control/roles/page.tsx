import { AccessControlPermissions, PermissionBoundary, RoleManagement } from "@novacore/frontend-next-shadcn";

export default function Page() {
  return (
    <PermissionBoundary permission={AccessControlPermissions.role.view}>
      <RoleManagement />
    </PermissionBoundary>
  );
}
