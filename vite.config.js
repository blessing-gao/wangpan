import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// 修改为使用 defineConfig 并将 mode 作为参数传入
export default defineConfig(({ command, mode }) => {
  let env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      viteMockServe({
        localEnabled: command === 'serve', // 开发模式启用 mock
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE, // 获取数据的服务器地址设置
          changeOrigin: true, // 需要代理跨域
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       javascriptEnabled: true,
    //     },
    //   },
    // },
  }
})
