import { AccessControlPermissions, PermissionBoundary, PermissionManagement } from "@novacore/frontend-next-shadcn";

export default function Page() {
  return (
    <PermissionBoundary permission={AccessControlPermissions.permission.view}>
      <PermissionManagement />
    </PermissionBoundary>
  );
}
