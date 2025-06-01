import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger"; // csak ha tényleg szükséges!

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // vagy 'localhost', ha IPv6 nem kell
    port: 8080,
    open: true, // automatikus böngészőnyitás indításkor
    allowedHosts: ["c1496f55-518b-44b2-90ce-e3fb3e88ca82-00-1svwsup4bgar.kirk.replit.dev"],
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "development",
  },
}));
