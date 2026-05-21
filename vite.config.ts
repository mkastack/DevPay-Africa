// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      sentryVitePlugin({
        org: process.env.SENTRY_ORG || "devpay-africa",
        project: process.env.SENTRY_PROJECT || "devpay-africa-app",
        authToken: process.env.SENTRY_AUTH_TOKEN || "",
        disable: !process.env.SENTRY_AUTH_TOKEN, // Disable upload if no auth token is provided
      }),
    ],
    build: {
      sourcemap: true, // Source maps are required for Sentry error resolution
    },
  },
});
