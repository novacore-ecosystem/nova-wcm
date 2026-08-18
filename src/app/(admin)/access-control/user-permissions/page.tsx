"use client";

import { AccessControlPermissions, PermissionBoundary, UserPermissionAssignment } from "@novacore/frontend-next-shadcn";

import { wcmPermissionDefinitions, wcmSubjectSearchProvider } from "@/features/access-control";
import { UserPermissionsFilters } from "@/features/access-control/components/UserPermissionsFilters";

export default function Page() {
  return (
    <PermissionBoundary permission={AccessControlPermissions.permission.manage}>
      <UserPermissionAssignment
        permissions={wcmPermissionDefinitions}
        subjectProvider={wcmSubjectSearchProvider}
        renderFilters={(props) => <UserPermissionsFilters {...props} />}
        getDetailHref={(subjectId) => `/access-control/user-permissions/${subjectId}`}
      />
    </PermissionBoundary>
  );
}
