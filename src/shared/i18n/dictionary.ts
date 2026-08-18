import type { TranslationDictionary } from "@novacore/frontend-foundation";

/**
 * nova-wcm's own application dictionary, layered above frontend-foundation's
 * TRANSLATION_RESOURCES fallback. Namespaced per feature as features are added. Values here
 * take priority over the fallback bundle.
 */
export const APP_DICTIONARY: Record<string, TranslationDictionary> = {
  en: {
    app: {
      name: "Nova WCM",
      description: "Website content, catalog, media, and SEO management",
    },
    nav: {
      dashboard: "Dashboard",
      catalog: "Catalog",
      products: "Products",
      productsNew: "New product",
      categories: "Categories",
      content: "Content",
      articles: "Articles",
      articlesNew: "Write article",
      contentCategories: "Categories",
      tags: "Tags",
      media: "Media",
      website: "Website",
      pages: "Pages",
      navigation: "Navigation",
      seo: "SEO",
      settings: "Settings",
      settingsGeneral: "General",
      settingsSocial: "Social links",
    },
    accessControlCatalog: {
      groups: {
        content: "Content",
        catalog: "Catalog",
        media: "Media",
        website: "Website",
        settings: "Settings",
        accessControl: "Access Control",
      },
      permissions: {
        content: { view: "View content", manage: "Manage content" },
        catalog: { view: "View catalog", manage: "Manage catalog" },
        media: { view: "View media", manage: "Manage media" },
        website: { view: "View website", manage: "Manage website" },
        settings: { view: "View settings", manage: "Manage settings" },
        accessControl: {
          permissionView: "View permissions",
          permissionManage: "Manage permission assignments",
          roleView: "View roles",
          roleManage: "Manage roles",
          positionView: "View positions",
          positionManage: "Manage positions",
        },
      },
      descriptions: {
        content: {
          view: "Allows the user to view articles, categories, and tags.",
          manage: "Allows the user to create, edit, and publish content.",
        },
        catalog: {
          view: "Allows the user to view products and product categories.",
          manage: "Allows the user to create, edit, and publish products and categories.",
        },
        media: {
          view: "Allows the user to view files in the Media Library.",
          manage: "Allows the user to upload, edit, and delete media files.",
        },
        website: {
          view: "Allows the user to view website pages, navigation, and SEO settings.",
          manage: "Allows the user to edit website pages, navigation, and SEO settings.",
        },
        settings: {
          view: "Allows the user to view site and social settings.",
          manage: "Allows the user to edit site and social settings.",
        },
        accessControl: {
          permissionView: "Allows the user to view the permission catalog.",
          permissionManage: "Allows the user to assign permissions directly to users.",
          roleView: "Allows the user to view roles and their permissions.",
          roleManage: "Allows the user to create, edit, and delete roles.",
          positionView: "Allows the user to view positions and the org chart.",
          positionManage: "Allows the user to create, edit, and delete positions.",
        },
      },
    },
  },
  vi: {
    app: {
      name: "Nova WCM",
      description: "Quản lý nội dung, danh mục, thư viện ảnh và SEO cho website",
    },
    nav: {
      dashboard: "Tổng quan",
      catalog: "Danh mục sản phẩm",
      products: "Sản phẩm",
      productsNew: "Thêm sản phẩm",
      categories: "Danh mục",
      content: "Nội dung",
      articles: "Bài viết",
      articlesNew: "Viết bài",
      contentCategories: "Chuyên mục",
      tags: "Thẻ",
      media: "Thư viện ảnh",
      website: "Website",
      pages: "Trang",
      navigation: "Menu điều hướng",
      seo: "SEO",
      settings: "Cài đặt",
      settingsGeneral: "Chung",
      settingsSocial: "Mạng xã hội",
    },
    accessControlCatalog: {
      groups: {
        content: "Nội dung",
        catalog: "Danh mục sản phẩm",
        media: "Thư viện ảnh",
        website: "Website",
        settings: "Cài đặt",
        accessControl: "Kiểm soát truy cập",
      },
      permissions: {
        content: { view: "Xem nội dung", manage: "Quản lý nội dung" },
        catalog: { view: "Xem danh mục sản phẩm", manage: "Quản lý danh mục sản phẩm" },
        media: { view: "Xem thư viện ảnh", manage: "Quản lý thư viện ảnh" },
        website: { view: "Xem website", manage: "Quản lý website" },
        settings: { view: "Xem cài đặt", manage: "Quản lý cài đặt" },
        accessControl: {
          permissionView: "Xem quyền hạn",
          permissionManage: "Quản lý việc gán quyền hạn",
          roleView: "Xem vai trò",
          roleManage: "Quản lý vai trò",
          positionView: "Xem vị trí",
          positionManage: "Quản lý vị trí",
        },
      },
      descriptions: {
        content: {
          view: "Cho phép người dùng xem bài viết, chuyên mục và thẻ.",
          manage: "Cho phép người dùng tạo, chỉnh sửa và đăng nội dung.",
        },
        catalog: {
          view: "Cho phép người dùng xem sản phẩm và danh mục sản phẩm.",
          manage: "Cho phép người dùng tạo, chỉnh sửa và đăng sản phẩm và danh mục.",
        },
        media: {
          view: "Cho phép người dùng xem tệp trong Thư viện ảnh.",
          manage: "Cho phép người dùng tải lên, chỉnh sửa và xóa tệp phương tiện.",
        },
        website: {
          view: "Cho phép người dùng xem trang web, menu điều hướng và cài đặt SEO.",
          manage: "Cho phép người dùng chỉnh sửa trang web, menu điều hướng và cài đặt SEO.",
        },
        settings: {
          view: "Cho phép người dùng xem cài đặt trang web và mạng xã hội.",
          manage: "Cho phép người dùng chỉnh sửa cài đặt trang web và mạng xã hội.",
        },
        accessControl: {
          permissionView: "Cho phép người dùng xem danh mục quyền hạn.",
          permissionManage: "Cho phép người dùng gán quyền hạn trực tiếp cho người dùng khác.",
          roleView: "Cho phép người dùng xem vai trò và các quyền hạn của vai trò.",
          roleManage: "Cho phép người dùng tạo, chỉnh sửa và xóa vai trò.",
          positionView: "Cho phép người dùng xem vị trí và sơ đồ tổ chức.",
          positionManage: "Cho phép người dùng tạo, chỉnh sửa và xóa vị trí.",
        },
      },
    },
  },
  "zh-CN": {
    app: {
      name: "Nova WCM",
      description: "网站内容、产品目录、媒体与 SEO 管理",
    },
    nav: {
      dashboard: "仪表盘",
      catalog: "产品目录",
      products: "产品",
      productsNew: "新建产品",
      categories: "分类",
      content: "内容",
      articles: "文章",
      articlesNew: "撰写文章",
      contentCategories: "分类",
      tags: "标签",
      media: "媒体库",
      website: "网站",
      pages: "页面",
      navigation: "导航菜单",
      seo: "SEO",
      settings: "设置",
      settingsGeneral: "通用",
      settingsSocial: "社交链接",
    },
    accessControlCatalog: {
      groups: {
        content: "内容",
        catalog: "产品目录",
        media: "媒体库",
        website: "网站",
        settings: "设置",
        accessControl: "访问控制",
      },
      permissions: {
        content: { view: "查看内容", manage: "管理内容" },
        catalog: { view: "查看产品目录", manage: "管理产品目录" },
        media: { view: "查看媒体库", manage: "管理媒体库" },
        website: { view: "查看网站", manage: "管理网站" },
        settings: { view: "查看设置", manage: "管理设置" },
        accessControl: {
          permissionView: "查看权限",
          permissionManage: "管理权限分配",
          roleView: "查看角色",
          roleManage: "管理角色",
          positionView: "查看职位",
          positionManage: "管理职位",
        },
      },
      descriptions: {
        content: {
          view: "允许用户查看文章、分类和标签。",
          manage: "允许用户创建、编辑和发布内容。",
        },
        catalog: {
          view: "允许用户查看产品和产品分类。",
          manage: "允许用户创建、编辑和发布产品与分类。",
        },
        media: {
          view: "允许用户查看媒体库中的文件。",
          manage: "允许用户上传、编辑和删除媒体文件。",
        },
        website: {
          view: "允许用户查看网站页面、导航菜单和 SEO 设置。",
          manage: "允许用户编辑网站页面、导航菜单和 SEO 设置。",
        },
        settings: {
          view: "允许用户查看网站与社交设置。",
          manage: "允许用户编辑网站与社交设置。",
        },
        accessControl: {
          permissionView: "允许用户查看权限目录。",
          permissionManage: "允许用户直接为其他用户分配权限。",
          roleView: "允许用户查看角色及其权限。",
          roleManage: "允许用户创建、编辑和删除角色。",
          positionView: "允许用户查看职位与组织架构。",
          positionManage: "允许用户创建、编辑和删除职位。",
        },
      },
    },
  },
};
