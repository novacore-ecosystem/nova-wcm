/** Public route group — no `RequireAuth`/`AdminShell` (unlike `(admin)`). Providers (react-query, i18n, ...) already wrap everything from the root layout. */
export default function PublicRouteLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
