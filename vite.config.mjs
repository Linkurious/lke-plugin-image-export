import path from "path";

/** @type {import('vite').UserConfig} */
export default {
  base: "",
  root: "web",
  plugins: [],
  server: {
    port: 4001,
    open: true,
  },
  define: {
    IS_DEV: process.env.DEV ? true : false,
  },
  build: {
    outDir: path.join(process.cwd(), "dist", "public"),
    emptyOutDir: true,
  },
  proxy: {
    // string shorthand
    "/api": {
      target: "http://localhost:3000/api",
    },
  },
};