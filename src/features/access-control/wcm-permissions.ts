import { AccessControlPermissions, type PermissionDefinition } from "@novacore/frontend-next-shadcn";

/**
 * WCM's own permission keys — one View/Manage pair per WCM module. No WCM backend exists yet
 * (see docs/plan.md §15), so these are forward-looking placeholders, following the same
 * `module:action` convention the platform's real `Permissions` catalog uses — the same honesty
 * standard already established for the shared Access Control module's own `position:*` keys
 * (see @novacore/frontend-next-shadcn's docs/access-control.md). They are NOT wired into
 * navigation.tsx's existing route gating yet — that still deliberately gates on `Permissions.Root`
 * per the scope boundary agreed for this task; rewiring it is the pre-existing plan.md §15 decision.
 */
export const WcmPermissions = {
  Content: { View: "content:view", Manage: "content:manage" },
  Catalog: { View: "catalog:view", Manage: "catalog:manage" },
  Media: { View: "media:view", Manage: "media:manage" },
  Website: { View: "website:view", Manage: "website:manage" },
  Settings: { View: "settings:view", Manage: "settings:manage" },
} as const;

/**
 * WCM's permission catalog — the subset of the platform's permission surface this application
 * actually exposes through Permission/Role/Position/User Management. Two sources:
 *
 * 1. WCM's own 5 modules (`WcmPermissions` above) — 10 keys.
 * 2. The Access Control module's own real/placeholder keys, re-exposed here so an admin can
 *    grant "who manages Roles/Positions/Permissions" through the same catalog — 6 keys.
 *
 * Deliberately NOT the platform's full ~40-key `Permissions` catalog from
 * `@novacore/frontend-foundation` (Inventory/Warehouse/Order/Notification/Users/Tenant/System) —
 * WCM doesn't use those modules, so they're excluded rather than padded in (see
 * @novacore/frontend-next-shadcn's docs/access-control.md's "Permission catalog" section).
 */
export const wcmPermissionDefinitions: PermissionDefinition[] = [
  {
    id: WcmPermissions.Content.View,
    translationKey: "accessControlCatalog.permissions.content.view",
    descriptionTranslationKey: "accessControlCatalog.descriptions.content.view",
    group: "content",
    groupTranslationKey: "accessControlCatalog.groups.content",
    order: 1,
  },
  {
    id: WcmPermissions.Content.Manage,
    translationKey: "accessControlCatalog.permissions.content.manage",
    descriptionTranslationKey: "accessControlCatalog.descriptions.content.manage",
    group: "content",
    groupTranslationKey: "accessControlCatalog.groups.content",
    order: 2,
  },
  {
    id: WcmPermissions.Catalog.View,
    translationKey: "accessControlCatalog.permissions.catalog.view",
    descriptionTranslationKey: "accessControlCatalog.descriptions.catalog.view",
    group: "catalog",
    groupTranslationKey: "accessControlCatalog.groups.catalog",
    order: 1,
  },
  {
    id: WcmPermissions.Catalog.Manage,
    translationKey: "accessControlCatalog.permissions.catalog.manage",
    descriptionTranslationKey: "accessControlCatalog.descriptions.catalog.manage",
    group: "catalog",
    groupTranslationKey: "accessControlCatalog.groups.catalog",
    order: 2,
  },
  {
    id: WcmPermissions.Media.View,
    translationKey: "accessControlCatalog.permissions.media.view",
    descriptionTranslationKey: "accessControlCatalog.descriptions.media.view",
    group: "media",
    groupTranslationKey: "accessControlCatalog.groups.media",
    order: 1,
  },
  {
    id: WcmPermissions.Media.Manage,
    translationKey: "accessControlCatalog.permissions.media.manage",
    descriptionTranslationKey: "accessControlCatalog.descriptions.media.manage",
    group: "media",
    groupTranslationKey: "accessControlCatalog.groups.media",
    order: 2,
  },
  {
    id: WcmPermissions.Website.View,
    translationKey: "accessControlCatalog.permissions.website.view",
    descriptionTranslationKey: "accessControlCatalog.descriptions.website.view",
    group: "website",
    groupTranslationKey: "accessControlCatalog.groups.website",
    order: 1,
  },
  {
    id: WcmPermissions.Website.Manage,
    translationKey: "accessControlCatalog.permissions.website.manage",
    descriptionTranslationKey: "accessControlCatalog.descriptions.website.manage",
    group: "website",
    groupTranslationKey: "accessControlCatalog.groups.website",
    order: 2,
  },
  {
    id: WcmPermissions.Settings.View,
    translationKey: "accessControlCatalog.permissions.settings.view",
    descriptionTranslationKey: "accessControlCatalog.descriptions.settings.view",
    group: "settings",
    groupTranslationKey: "accessControlCatalog.groups.settings",
    order: 1,
  },
  {
    id: WcmPermissions.Settings.Manage,
    translationKey: "accessControlCatalog.permissions.settings.manage",
    descriptionTranslationKey: "accessControlCatalog.descriptions.settings.manage",
    group: "settings",
    groupTranslationKey: "accessControlCatalog.groups.settings",
    order: 2,
  },
  {
    id: AccessControlPermissions.permission.view,
    translationKey: "accessControlCatalog.permissions.accessControl.permissionView",
    descriptionTranslationKey: "accessControlCatalog.descriptions.accessControl.permissionView",
    group: "accessControl",
    groupTranslationKey: "accessControlCatalog.groups.accessControl",
    order: 1,
  },
  {
    id: AccessControlPermissions.permission.manage,
    translationKey: "accessControlCatalog.permissions.accessControl.permissionManage",
    descriptionTranslationKey: "accessControlCatalog.descriptions.accessControl.permissionManage",
    group: "accessControl",
    groupTranslationKey: "accessControlCatalog.groups.accessControl",
    order: 2,
  },
  {
    id: AccessControlPermissions.role.view,
    translationKey: "accessControlCatalog.permissions.accessControl.roleView",
    descriptionTranslationKey: "accessControlCatalog.descriptions.accessControl.roleView",
    group: "accessControl",
    groupTranslationKey: "accessControlCatalog.groups.accessControl",
    order: 3,
  },
  {
    id: AccessControlPermissions.role.manage,
    translationKey: "accessControlCatalog.permissions.accessControl.roleManage",
    descriptionTranslationKey: "accessControlCatalog.descriptions.accessControl.roleManage",
    group: "accessControl",
    groupTranslationKey: "accessControlCatalog.groups.accessControl",
    order: 4,
  },
  {
    id: AccessControlPermissions.position.view,
    translationKey: "accessControlCatalog.permissions.accessControl.positionView",
    descriptionTranslationKey: "accessControlCatalog.descriptions.accessControl.positionView",
    group: "accessControl",
    groupTranslationKey: "accessControlCatalog.groups.accessControl",
    order: 5,
  },
  {
    id: AccessControlPermissions.position.manage,
    translationKey: "accessControlCatalog.permissions.accessControl.positionManage",
    descriptionTranslationKey: "accessControlCatalog.descriptions.accessControl.positionManage",
    group: "accessControl",
    groupTranslationKey: "accessControlCatalog.groups.accessControl",
    order: 6,
  },
];
