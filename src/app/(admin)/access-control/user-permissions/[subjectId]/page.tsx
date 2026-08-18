"use client";

import { useParams } from "next/navigation";
import { AccessControlPermissions, PermissionBoundary, UserAuthorizationDetail } from "@novacore/frontend-next-shadcn";

import { wcmPermissionDefinitions, wcmSubjectSearchProvider } from "@/features/access-control";

export default function Page() {
  const params = useParams<{ subjectId: string }>();

  return (
    <PermissionBoundary permission={AccessControlPermissions.permission.manage}>
      <UserAuthorizationDetail
        subjectId={params.subjectId}
        permissions={wcmPermissionDefinitions}
        subjectProvider={wcmSubjectSearchProvider}
      />
    </PermissionBoundary>
  );
}
