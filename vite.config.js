import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import qiankun from 'vite-plugin-qiankun'
import childProcess from 'child_process'
import { dayjs } from 'element-plus'
import { JSDOM } from 'jsdom'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
// https://vitejs.dev/config/
export function addCommitInfo() {
  const version = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const commitId = childProcess.execSync('git rev-parse --short HEAD', { encoding: 'utf-8' })
  const description = childProcess
    .execSync('git log -3 --pretty="%s"', { encoding: 'utf-8' })
    .trim()
    .split('\n\n')
    .toString()
  return {
    transformIndexHtml(html) {
      const dom = new JSDOM(html)
      const document = dom.window.document
      const container = document.querySelector('#app')
      container?.setAttribute('commitId', commitId)
      container?.setAttribute('version', version)
      container?.setAttribute('description', description)
      return dom.serialize()
    }
  }
}
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')
  const qiankunName = env.VITE_QIANKUN_NAME
  const publicBase = env.VITE_PUBLIC_BASE
  return {
    base: publicBase,
    plugins: [
      nodePolyfills(),
      addCommitInfo(),
      qiankun(qiankunName, {
        useDevMode: true
      }),
      vue(),
      // createSvgIconsPlugin({
      //   // eslint-disable-next-line no-undef
      //   iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      //   symbolId: 'icon-[dir]-[name]',
      //   customDomId: '__svg__icons__dom__knowledge__',
      // }),
      // Components({
      //   dirs: ['src/components'],
      //   extensions: ['vue'],
      //   dts: 'src/components/components.d.ts'
      // })
    ],
    define: {
      'process.env': env
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      //rollup打包后的静态资源名称格式
      rollupOptions: {
        output: {
          // format: 'umd',
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    //静态资源服务的文件夹
    publicDir: 'public',
    server: {
      cors: true, //为开发服务器配置 CORS , 默认启用并允许任何源
      open: true, //服务启动时自动在浏览器中打开应用
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        '/api/file': {
          target: 'http://localhost:8081', // MinIO 的服务地址
          changeOrigin: true, // 代理跨域
          rewrite: (path) => path.replace(/^\/api/, ''), // 可选，根据需要调整路径
        },
        '/preview': {
          target: 'http://shenben.club:9000', // MinIO 的服务地址
          changeOrigin: true, // 代理跨域
          rewrite: (path) => path.replace(/^\/preview/, ''), // 可选，根据需要调整路径
        },
        [env.VITE_BASE_PREV]: {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(env.VITE_BASE_PREV, '')
        },
        [env.VITE_DEVOPS_PREV]: {
          target: env.VITE_DEVOPS_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(env.VITE_DEVOPS_PREV, '')
        },
        [env.VITE_APPLICATION_PREV]: {
          target: env.VITE_APPLICATION_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(env.VITE_APPLICATION_PREV, '')
        },
        '/minio': {
          target: 'http://shenben.club:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace('/minio', '')
        },
        '/browser': {
          target: 'http://127.0.0.1:9980',
          changeOrigin: true,
          ws: true,
          onProxyReq(proxyReq, req) {
            if (req.method === 'OPTIONS' && req.headers.origin) {
              proxyReq.setHeader('Access-Control-Allow-Origin', req.headers.origin);
              proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
              proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            }
          },
          headers: {
            Host: '127.0.0.1:9980'
          }
        },
      }
    }
  }
})
