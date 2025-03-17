import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      defaultImport: "component", // or 'url' or 'raw'
      svgoConfig: {
        multipass: true // 여러 번 최적화
      }
    })
  ],
  server: {
    hmr: true
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "VueFlowCore",
      fileName: (format) => `vue-flow-core.${format}.min.js`
    },
    rollupOptions: {
      external: ["vue"], // Vue를 외부 모듈로 설정
      output: {
        globals: {
          vue: "Vue"
        },
        exports: "named", // UMD에서 named export 사용
        assetFileNames: "vue-flow-core.min.css"
      }
    },
    minify: "terser" // UMD 파일 크기 최적화
  }
});
