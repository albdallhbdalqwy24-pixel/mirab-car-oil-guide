import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "client",
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? "/mirab-car-oil-guide/" : "/",
  server: { allowedHosts: true },
  build: { outDir: "../dist", emptyOutDir: true },
});
