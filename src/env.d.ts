/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  /** H5是否需要代理 */
  readonly VITE_APP_PROXY: 'true' | 'false'
  /** H5是否需要代理，需要的话有个前缀 */
  readonly VITE_APP_PROXY_PREFIX: string // 一般是/api
  /** 静态资源前缀 */
  readonly VITE_APP_PUBLIC_BASE: string
  /** 网站标题，应用名称 */
  readonly VITE_APP_TITLE: string
  /** 是否清除console */
  readonly VITE_DELETE_CONSOLE: string
  /** 后台接口地址 */
  readonly VITE_SERVER_BASEURL: string
  /** 服务端口号 */
  readonly VITE_SERVER_PORT: string
  // 更多环境变量...

  /** 上传图片地址 */
  readonly VITE_UPLOAD_BASEURL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
