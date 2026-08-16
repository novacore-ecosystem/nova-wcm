import { RequireAuth } from "@/features/auth";
import { AdminShell } from "@/shared/layout/AdminShell";

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
