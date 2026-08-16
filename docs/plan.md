# nova-wcm — Product Plan

> Business / Landing Admin. Read this before touching architecture or scope. Update it when a
> decision below changes.

## 1. Product purpose

An admin control center for small business, corporate, and product-showcase websites: manage a
lightweight catalog, write articles, upload media, edit a handful of website pages/navigation, and
keep SEO in good shape — without any order/inventory/payment workflow.

## 2. Target users

Ordinary small-business owners and marketing staff, not technical administrators. They understand
"write an article," "add a product," "upload a photo" — not "publish workflow," "canonical URL
strategy," or "cache invalidation." Copy, error messages, and IA must read at that level.

## 3. Scope

Dashboard · Catalog (Products, Categories) · Content (Articles, Categories, Tags) · Media Library ·
Website (Pages, Navigation, SEO) · Settings (General, Social) · Account (existing auth/session UI).

## 4. Non-goals

Inventory, warehouse, orders, payments, promotions, customers, complex pricing rules, a page
builder (Webflow/Elementor-style), a generic CRUD/admin generator, multi-app split, a second auth
system, a real SEO crawler/engine.

## 5. Visual identity

Warm amber/orange accent, neutral (not zinc) base palette, generous whitespace, editorial/card
layouts, restrained accent use (primary actions, active nav, key states only — never a fully
orange UI). Communicates "website & brand management," not "enterprise operational system."

Implementation: `frontend-next-shadcn`'s theme system already ships a `neutral-orange` preset
(`base: "neutral", color: "orange", style: "modern", radius: "large"`, see
`packages/shadcn/src/theme/presets.ts`) — this is the exact direction requested, so nova-wcm
defines its own `WCM_ADMIN_THEME` (app-local, mirroring `NOVACORE_ADMIN_THEME`'s shape) instead of
inventing new tokens. Sidebar chrome stays a distinct warm-neutral (not nova-console's navy) via
`overrides`, keeping product identity distinct while both apps still share one token engine.

## 6. Navigation structure

```
Dashboard
Catalog        → Products, Categories
Content        → Articles, Categories, Tags
Media
Website        → Pages, Navigation, SEO
Settings       → General, Social Links
```

Account/session lives in the header user-menu (reused `UserProfile`), not a sidebar item —
consistent with nova-console.

## 7. Module boundaries

Each module is `features/<name>/` (schema + api + components) backed by `services/<name>/` (mock
repository calls behind the same envelope shapes a real API would return). No module imports
another module's internals — cross-module references (e.g. an Article referencing a Category) go
through the other module's public `index.ts` types only.

## 8. UX principles

Plain language over technical terms · sectioned forms over one giant form · inline validation ·
real empty/loading/error states everywhere (never a blank screen) · confirmation only for
destructive actions · a short "How to" box (existing `HowTo` component) on the pages most likely to
confuse a non-technical user (Article editor, SEO, Media, Product, Navigation) · multi-step backend
work presented as one action (e.g. "Publish" does create+SEO+publish in one click, one loading
state).

## 9. Mock API/data strategy

Every module except Auth is mocked in `shared/lib/mock/`: an in-memory `mockCollection<T>` seeded
with realistic data, exposing `list/get/create/update/remove`, artificial latency
(`simulateLatency`), and occasional simulated failure hooks for error-state testing. Search/filter/
sort/pagination go through `frontend-foundation`'s real `CriteriaRequest` /
`applyCriteriaFilters` / `applyCriteriaSorts` / `PaginatedResult` contracts — the exact shapes a
real backend already speaks elsewhere in the ecosystem — so list pages, `DataTable`, and query
hooks are written exactly as they will be against a live API. Each feature's `api/*.service.ts` is
the single seam: swapping its mock body for real `httpClient` calls is the entire migration, no UI
changes required.

## 10. Future API integration strategy

Replace `services/<feature>/*.ts` mock bodies with `httpClient` calls returning the same
`ApiResponse<T>` / `PaginatedResult<T>` envelopes (see `frontend-foundation`'s `src/api`) — the
`features/<feature>/api/*.queries.ts` TanStack Query hooks, component code, and forms do not
change. `unwrapApiResponse` (copied from nova-console's `shared/lib/api/client.ts`) stays the
single unwrap boundary.

## 11. Reused from nova-console (Root Admin reference)

Layout shell composition (`AdminShell` wiring `AdminLayout`/`AdminSidebar`/`AdminHeader`/
`CommandPalette`/`AboutDialog`), config-driven `navigationConfig`, `useSidebarPreferences`, the
`useAppForm`/`Form` wrapper, `AppTranslationProvider`/`useAppTranslation`/`useLocale` + app
dictionary pattern, `useSessionStore`/`useLocaleStore` zustand pattern, `shared/lib/api/client.ts`
(`httpClient` + `unwrapApiResponse`), `shared/lib/query/client.ts`, the entire `features/auth` +
`services/auth` real-auth wiring (login/logout/session-bootstrap against the real Auth service),
`RequireAuth`/`RequirePermission`, ESLint/Prettier/TS config, `next.config.ts`
(`transpilePackages`).

## 12. From frontend-foundation

`http` (Axios wrapper + `HttpError`), `authorization` (`Permissions`, `hasPermission`/
`hasAnyPermission`), `i18n` (`createTranslator`, `TRANSLATION_RESOURCES`, locale metadata),
`api` (`ApiResponse`, `PaginatedResult`, `CriteriaRequest` + criteria builders/evaluators),
`validation` (slug/email predicates for forms).

## 13. Application-specific customization

Amber/orange theme + own `globals.css`/`tailwind.config.ts` (mirrors nova-console's, not modified
in the shared package) · own `APP_DICTIONARY` (en/vi/zh-CN) for every WCM-specific string · mock
data layer (does not exist anywhere shared — WCM-only) · SEO preview/health components (app-level;
generic enough to justify only if a second app needs them later — not promoted to shared now) ·
Article editor (rich text + SEO panel composition is domain-specific to this product) · dashboard
content-health cards.

## 14. Deferred (intentionally not built now)

Multi-language content, content scheduling/revisions, multiple authors with per-author
permissions, SEO scoring beyond a simple checklist, analytics, contact-form submissions,
testimonials, FAQ, services/case-study content types, a real page builder, real object
storage/CDN wiring, Translation Management (tenant-editable dictionary — nova-console-only
concept, not reused here since WCM has no such backend feature yet).

## 15. Potential backend API simplifications (to document, not build)

- A single `POST /articles/{id}/publish` (or a "publish" flag on `PUT /articles/{id}`) instead of
  requiring the client to sequence create → SEO metadata → media attach → publish, so the frontend
  never has to fake one workflow out of several calls.
- A `/me` endpoint returning real roles/permissions (nova-console already flags this gap; WCM's
  `getCurrentUser` dev-adapter has the identical limitation — see §16 below).
- Granular `content:*` / `catalog:*` / `website:*` permission keys in the shared `Permissions`
  registry — today only `Permissions.Root` exists for ungoverned domains, so WCM's nav/route
  guards gate on `Root` exactly like nova-console's `subscriptions`/`console` groups did before
  their backends existed. This is a known, precedented interim state, not a workaround invented
  here.
- A combined "create + upload cover image" endpoint for Article/Product create, avoiding a
  multipart-then-patch dance once Media storage is real.

## 16. How this differs from the Online Commerce Admin (nova-oms)

nova-oms is a full commerce operations product (inventory, orders, payments, customers). nova-wcm
deliberately excludes all of that — it is scoped to content and presentation, not transactions. It
is not nova-oms with features hidden: different navigation, different visual identity (warm
amber/editorial vs. nova-oms's operational styling), different information architecture (content-
and SEO-first), and a different mock/dev posture (nova-oms already targets a real backend; nova-wcm
mocks everything but auth because its backend does not exist yet).

## Auth note (real, not mocked)

`getCurrentUser` is a dev-adapter identical in spirit to nova-console's: since no `/me` endpoint
exists yet, an authenticated session is treated as `Permissions.Root`. Login/logout/session
bootstrap hit the real Auth service. Running the app locally requires a TenantClient public key for
nova-wcm's tenant (see `.env.example`) — this is an external pendency, not something this task can
provision; `.env` (gitignored) may reuse a locally available dev key for manual testing only.
