import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/simulados-concursos-expert/",
  server: {
    port: 8080,
    host: true,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "docs",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        admin: path.resolve(__dirname, "admin.html"),
        dashboard: path.resolve(__dirname, "dashboard.html"),
        visitante: path.resolve(__dirname, "visitante.html"),
      },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    assetsDir: "assets",
    // Ensure proper MIME types
    assetsInlineLimit: 0,
  },
  publicDir: "public",
});
