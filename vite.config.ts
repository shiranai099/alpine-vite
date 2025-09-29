import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  server: {
    open: "/alpine.html", // dev 起動時パス
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    // マルチページ設定: src 内の複数 HTML をビルド対象にする
    rollupOptions: {
      input: {
        main: "src/index.html",
        alpine: "src/alpine.html",
        react: "src/react.html",
      },
    },
  },
});
