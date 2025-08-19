import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueDevTools from 'vite-plugin-vue-devtools';
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        createHtmlPlugin({}),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@/plugins': fileURLToPath(new URL('./src/plugins', import.meta.url))
        }
    }
});
