// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  root: "src", // 開発用ルートを src にする
  publicDir: "../public", // public フォルダがプロジェクトルートにある場合の指定
  server: {
    open: "/alpine.html", // ← ここを追加：dev 起動時にこのパスを開く
  },
  build: {
    outDir: "../dist", // ビルド出力をプロジェクトルート/dist にする
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
