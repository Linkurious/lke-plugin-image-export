import path from "path";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";

/** @type {import('vite').UserConfig} */
export default {
  base: "",
  root: "web",
  plugins: [
    react(),
    // legacy({
    //   targets: ["defaults", "not IE 11"],
    // }),
  ],
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
    manifest: true,
    outDir: path.join(process.cwd(), "dist", "public"),
    rollupOptions: {
      output: { format: "iife" },
    },
    emptyOutDir: true,
  },
};