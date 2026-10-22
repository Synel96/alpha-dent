import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

// Prepends the Array.prototype.at polyfill (lib/array-at-polyfill.js) to
// every built script that calls .at() - Vike's client runtime among them -
// so it is in place before any of their code runs, in older browsers too.
// Not loaded some other way on purpose: a +client.ts makes Vike start the
// page with an inline <script>, which the CSP (script-src 'self') blocks,
// and importing it from app code runs it too late, after Vike's runtime.
function arrayAtPolyfill(): Plugin {
  const polyfill = readFileSync(fileURLToPath(new URL("./lib/array-at-polyfill.js", import.meta.url)), "utf8");
  return {
    name: "alphadent:array-at-polyfill",
    apply: "build",
    renderChunk(code) {
      return code.includes(".at(") ? { code: polyfill + code, map: null } : null;
    },
  };
}

export default defineConfig({
  plugins: [vike(), react(), arrayAtPolyfill()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react") || id.includes("scheduler")) {
            return "react-vendor";
          }

          if (id.includes("vike")) {
            return "vike-vendor";
          }

          if (id.includes("@radix-ui")) {
            return "radix-vendor";
          }

          if (id.includes("i18next") || id.includes("react-i18next")) {
            return "i18n-vendor";
          }

          if (id.includes("lucide-react")) {
            return "icons-vendor";
          }
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["**/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
  },
});
