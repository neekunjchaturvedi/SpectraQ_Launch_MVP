import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    fs: {
      strict: false,
    },
  },
  define: {
    global: "globalThis",
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      {
        find: "eventemitter3",
        replacement: path.resolve(__dirname, "./src/shims/eventemitter3.js"),
      },
      // Match any nested copy of use-sync-external-store/shim/with-selector(.js)
      {
        find: /use-sync-external-store[\\/]shim[\\/]with-selector(\.js)?$/,
        replacement: path.resolve(
          __dirname,
          "./src/shims/use-sync-external-store-shim.js"
        ),
      },
      // Also force base shim to our ESM re-export from React
      {
        find: /use-sync-external-store[\\/]shim([\\/]index\.js)?$/,
        replacement: path.resolve(
          __dirname,
          "./src/shims/use-sync-external-store-base-shim.js"
        ),
      },
      // Ensure style-to-js has a default export in ESM
      {
        find: /^style-to-js$/,
        replacement: path.resolve(__dirname, "./src/shims/style-to-js-shim.js"),
      },
      // Force debug to resolve to an ESM-friendly shim with default export
      {
        find: /^debug$/,
        replacement: path.resolve(__dirname, "./src/shims/debug-shim.js"),
      },
      {
        find: /debug[\\/]src[\\/]browser\.js$/,
        replacement: path.resolve(__dirname, "./src/shims/debug-shim.js"),
      },
      // Force extend to resolve to an ESM-friendly shim with default export
      {
        find: /^extend$/,
        replacement: path.resolve(__dirname, "./src/shims/extend-shim.js"),
      },
      {
        find: /extend\/index\.js$/,
        replacement: path.resolve(__dirname, "./src/shims/extend-shim.js"),
      },
      // Additional CommonJS compatibility fixes
      {
        find: /^xtend$/,
        replacement: path.resolve(__dirname, "./src/shims/extend-shim.js"),
      },
    ],
  },
  optimizeDeps: {
    exclude: [
      "langchain",
      "@wagmi/core",
      "@wagmi/connectors",
      "wagmi",
      "framer-motion",
      "react-markdown",
      "uuid",
      "@tanstack/react-query",
      "viem",
      "openai",
      "@walletconnect/utils",
      "@walletconnect/universal-provider",
      "@reown/appkit",
      "@walletconnect/ethereum-provider",
      "use-sync-external-store",
      "extend",
      "@radix-ui/react-tooltip",
      // Add all WalletConnect packages to exclude
      "@walletconnect/jsonrpc-utils",
      "@walletconnect/time",
      "@walletconnect/window-getters",
      "@walletconnect/window-metadata",
      "@walletconnect/safe-json",
      "@walletconnect/environment",
      "@walletconnect/events",
    ],
    include: ["react", "react-dom", "react-router-dom"],
    force: true,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB to reduce warnings
    rollupOptions: {
      onwarn(warning, warn) {
        // Only suppress specific sourcemap warnings, let everything else through
        if (warning.code === "SOURCEMAP_ERROR") return;
        warn(warning);
      },
      output: {
        manualChunks: {
          // Core React libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],

          // UI Component libraries (split into smaller chunks)
          "radix-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
          ],

          // Web3 and blockchain related
          "web3-core": ["wagmi", "viem", "@wagmi/core", "@wagmi/connectors"],
          walletconnect: [
            "@walletconnect/ethereum-provider",
            "@walletconnect/universal-provider",
            "@walletconnect/utils",
            "@reown/appkit",
          ],

          // Utility libraries
          utils: ["uuid", "date-fns", "clsx", "tailwind-merge"],

          // Animation and styling
          "ui-animation": ["framer-motion"],

          // Data fetching and state management
          data: ["@tanstack/react-query"],

          // Chart/visualization libraries (if any)
          charts: [], // Add chart libraries here when needed

          // Markdown and content rendering
          content: ["react-markdown"],
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
