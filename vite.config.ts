import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "",
  plugins: [react()],
  server: {
    port: 4001,
    open: true,
    proxy: {
      // string shorthand
      "/api": {
        target: "http://localhost:3000/api",
      },
    },
  },
  define: {
    IS_DEV: process.env.DEV ? true : false,
  },
  build: {
    outDir: path.join(process.cwd(), "dist", "public"),
    emptyOutDir: true,
  },
});
