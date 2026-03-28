import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  plugins: [
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    svgr(),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  build: {
    assetsInlineLimit: 0,
  },
});
