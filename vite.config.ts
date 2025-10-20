/// <reference types="vitest" />

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/simple-react-app/", // リポジトリ名
  test: {
    globals: true,
    includeSource: ["src/**/*.{ts,tsx}"],
  },
  define: {
    "import.meta.vitest": "undefined",
  },
});
