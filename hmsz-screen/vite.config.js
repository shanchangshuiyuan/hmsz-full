import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // 这里的名称要和主应用改造是配置项中的name保持一致
        qiankun('big-screen', {
            useDevMode: true
        })
    ],
    server: {
        // 防止开发阶段的assets 静态资源加载问题
        // 不配置origin 加载静态资源的时候默认是以主应用的地址来加载的
        origin: '//localhost:5173'
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src',
                import.meta.url))
        }
    }
})