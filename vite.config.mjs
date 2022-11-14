import path from "path";
import legacy from "@vitejs/plugin-legacy";

/** @type {import('vite').UserConfig} */
export default {
  base: "",
  root: "web",
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],

  server: {
    port: 4001,
    open: true,
  },
  define: {
    IS_DEV: process.env.DEV ? true : false,
  },
  build: {
    manifest: true,
    outDir: path.join(process.cwd(), "dist", "public"),
    rollupOptions: {
      format: "iife",
    },
    emptyOutDir: true,
  },
  proxy: {
    // string shorthand
    "/api": {
      target: "http://localhost:3000/api",
    },
  },
};
