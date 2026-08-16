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
  },
};
