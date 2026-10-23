import Uni from '@dcloudio/vite-plugin-uni'
// @see https://uni-helper.js.org/vite-plugin-uni-layouts
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
// @see https://github.com/uni-helper/vite-plugin-uni-manifest
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
// @see https://uni-helper.js.org/vite-plugin-uni-pages
import UniPages from '@uni-helper/vite-plugin-uni-pages'
// @see https://github.com/uni-helper/vite-plugin-uni-platform
// 需要与 @uni-helper/vite-plugin-uni-pages 插件一起使用
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import dayjs from 'dayjs'
import path from 'node:path'
// @see https://unocss.dev/
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import ViteCompression from 'vite-plugin-compression'
import ViteRestart from 'vite-plugin-restart'

import pkg from './package.json'
import { copyNativeRes } from './vite-plugins/copyNativeRes'

const { name, version } = pkg
const __APP_INFO__ = {
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  pkg: { name, version },
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // console.log(mode === process.env.NODE_ENV) // true

  // mode: 区分生产环境还是开发环境
  console.log('command, mode -> ', command, mode)
  // pnpm dev:h5 时得到 => serve development
  // pnpm build:h5 时得到 => build production
  // pnpm dev:mp-weixin 时得到 => build development (注意区别，command为build)
  // pnpm build:mp-weixin 时得到 => build production
  // pnpm dev:app 时得到 => build development (注意区别，command为build)
  // pnpm build:app 时得到 => build production
  // dev 和 build 命令可以分别使用 .env.development 和 .env.production 的环境变量

  const { UNI_PLATFORM } = process.env
  console.log('UNI_PLATFORM -> ', UNI_PLATFORM) // 得到 mp-weixin, h5, app 等

  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))
  const {
    VITE_APP_PORT,
    VITE_APP_PROXY,
    VITE_APP_PROXY_PREFIX,
    VITE_APP_PUBLIC_BASE,
    VITE_DELETE_CONSOLE,
    VITE_SERVER_BASEURL,
    VITE_SHOW_SOURCEMAP,
  } = env
  console.log('环境变量 env -> ', env)

  return {
    base: VITE_APP_PUBLIC_BASE,
    build: {
      esbuild: {
        supported: {
          bigint: true,
        },
      },
      // 开发环境不用压缩
      minify: mode === 'development' ? false : 'terser',
      // 方便非h5端调试
      sourcemap: VITE_SHOW_SOURCEMAP === 'true', // 默认是false
      target: 'es6',
      terserOptions: {
        compress: {
          // eslint-disable-next-line camelcase
          drop_console: VITE_DELETE_CONSOLE === 'true',
          // eslint-disable-next-line camelcase
          drop_debugger: true,
        },
      },
    },

    css: {
      postcss: {
        plugins: [
          // autoprefixer({
          //   // 指定目标浏览器
          //   overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // }),
        ],
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
      __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY),
    },
    envDir: './env', // 自定义env目录

    plugins: [
      UniPages({
        dts: 'src/types/uni-pages.d.ts',
        exclude: ['**/components/**/**.*'],
        routeBlockLang: 'json5', // 虽然设了默认值，但是vue文件还是要加上 lang="json5", 这样才能很好地格式化
        // homePage 通过 vue 文件的 route-block 的type="home"来设定
        // pages 目录为 src/pages，分包目录不能配置在pages目录下
        subPackages: ['src/pagesA'], // 是个数组，可以配置多个，但是不能为pages里面的目录
      }),
      UniLayouts(),
      UniPlatform(),
      UniManifest(),
      // UniXXX 需要在 Uni 之前引入
      Uni(),
      {
        configResolved(config) {
          const plugin = config.plugins.find((p) => p.name === 'vite:vue')
          if (plugin && plugin.api && plugin.api.options) {
            plugin.api.options.devToolsEnabled = false
          }
        },
        // 临时解决 dcloudio 官方的 @dcloudio/uni-mp-compiler 出现的编译 BUG
        // 参考 github issue: https://github.com/dcloudio/uni-app/issues/4952
        // 自定义插件禁用 vite:vue 插件的 devToolsEnabled，强制编译 vue 模板时 inline 为 true
        name: 'fix-vite-plugin-vue',
      },
      UnoCSS(),
      AutoImport({
        dirs: ['src/hooks'], // 自动导入 hooks
        dts: 'src/types/auto-import.d.ts',
        eslintrc: { enabled: true },
        imports: ['vue', 'uni-app'],
        vueTemplate: true, // default false
      }),

      ViteRestart({
        restart: ['vite.config.ts'],
      }),
      // h5环境增加 BUILD_TIME 和 BUILD_BRANCH
      UNI_PLATFORM === 'h5' && {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace('%BUILD_TIME%', dayjs().format('YYYY-MM-DD HH:mm:ss'))
        },
      },
      // gzip 压缩，h5 + 生产环境
      UNI_PLATFORM === 'h5' && mode === 'production' && ViteCompression({ algorithm: 'gzip' }),
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === 'h5' &&
        mode === 'production' &&
        visualizer({
          brotliSize: true,
          filename: './node_modules/.cache/visualizer/stats.html',
          gzipSize: true,
          open: true,
        }),
      // 只有在 app 平台时才启用 copyNativeRes 插件
      UNI_PLATFORM === 'app' && copyNativeRes(),
    ],
    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
        '@img': path.join(process.cwd(), './src/static/images'),
      },
    },
    server: {
      hmr: true,
      host: '0.0.0.0',
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy: JSON.parse(VITE_APP_PROXY)
        ? {
            [VITE_APP_PROXY_PREFIX]: {
              changeOrigin: true,
              rewrite: (path) => path.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), ''),
              target: VITE_SERVER_BASEURL,
            },
          }
        : undefined,
    },
  }
})
