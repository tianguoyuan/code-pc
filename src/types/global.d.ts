declare const __UNI_PLATFORM__:
  | 'h5'
  | 'app'
  | 'mp-alipay'
  | 'mp-baidu'
  | 'mp-jd'
  | 'mp-kuaishou'
  | 'mp-lark'
  | 'mp-qq'
  | 'mp-toutiao'
  | 'mp-weixin'
  | 'quickapp-webview'
  | 'quickapp-webview-huawei'
  | 'quickapp-webview-union'

declare const __VITE_APP_PROXY__: 'true' | 'false'

declare namespace JSX {
  interface IntrinsicElements {
    block: any
    template: any
  }
}

/* __APP_INFO__ */
declare const __APP_INFO__: {
  pkg: {
    name: string
    version: string
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
    engines: {
      node: string
    }
  }
  lastBuildTime: string
}
