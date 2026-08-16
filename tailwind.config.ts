import type { Config } from "tailwindcss";

// nova-wcm's own Tailwind build — utilities only (see globals.css). The shared
// `@novacore/frontend-next-shadcn/styles.css` import already provides Preflight/base and every
// vendored component's own styles, precompiled from that package's own source only. Any Tailwind
// class written directly in `src/**` needs THIS build to actually emit CSS for it. Token mapping
// is copied verbatim from the shared package's own `tailwind.config.ts` (same `--nc-*` CSS
// variables, set globally by `<AdminProvider>`) — see nova-console's tailwind.config.ts for why
// the shared package's source is also scanned here (avoids two independently-compiled Tailwind
// builds emitting colliding utility classes).
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "../common/frontend-nextjs/packages/shadcn/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--nc-border) / <alpha-value>)",
        input: "hsl(var(--nc-input) / <alpha-value>)",
        ring: "hsl(var(--nc-ring) / <alpha-value>)",
        background: "hsl(var(--nc-background) / <alpha-value>)",
        foreground: "hsl(var(--nc-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--nc-primary) / <alpha-value>)",
          foreground: "hsl(var(--nc-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--nc-secondary) / <alpha-value>)",
          foreground: "hsl(var(--nc-secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--nc-destructive) / <alpha-value>)",
          foreground: "hsl(var(--nc-destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--nc-muted) / <alpha-value>)",
          foreground: "hsl(var(--nc-muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--nc-accent) / <alpha-value>)",
          foreground: "hsl(var(--nc-accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--nc-popover) / <alpha-value>)",
          foreground: "hsl(var(--nc-popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--nc-card) / <alpha-value>)",
          foreground: "hsl(var(--nc-card-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--nc-success) / <alpha-value>)",
          foreground: "hsl(var(--nc-success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--nc-warning) / <alpha-value>)",
          foreground: "hsl(var(--nc-warning-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--nc-info) / <alpha-value>)",
          foreground: "hsl(var(--nc-info-foreground) / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--nc-sidebar) / <alpha-value>)",
          foreground: "hsl(var(--nc-sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--nc-sidebar-border) / <alpha-value>)",
          accent: "hsl(var(--nc-sidebar-accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--nc-sidebar-accent-foreground) / <alpha-value>)",
          primary: "hsl(var(--nc-sidebar-primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--nc-sidebar-primary-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--nc-radius)",
        md: "calc(var(--nc-radius) - 2px)",
        sm: "calc(var(--nc-radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
