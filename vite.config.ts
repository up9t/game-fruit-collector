import { defineConfig, type ConfigEnv } from "vite";
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig((env: ConfigEnv) => ({
  plugins: [
    vue(),
    vueDevTools(),
  ],
	base: env.mode === "github" ? "/game-fruit-collector/" : "/",
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
