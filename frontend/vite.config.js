import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "../Backend/server/static/dist",
    emptyOutDir: true,
  },

  server: {
    port: 3000,
    strictPort: true,

    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },

      "/media": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },

      "/ws": {
        target: "ws://localhost:8000",
        ws: true,
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});