import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "YongComponent",
      fileName: (format) => `yongs-component.${format}.min.js`,
    },
    rollupOptions: {
      external: ["vue"], // Vue를 외부 모듈로 설정
      output: {
        globals: {
          vue: "Vue",
        },
        exports: "named", // UMD에서 named export 사용
      },
    },
    minify: "terser", // UMD 파일 크기 최적화
  },
});