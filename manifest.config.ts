// manifest.config.ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import path from 'node:path'
import { loadEnv } from 'vite'

// 获取环境变量的范例
const env = loadEnv(process.env.NODE_ENV!, path.resolve(process.cwd(), 'env'))
const {
  VITE_APP_DESC,
  VITE_APP_PUBLIC_BASE,
  VITE_APP_ROUTER_MODE,
  VITE_APP_TITLE,
  VITE_FALLBACK_LOCALE = 'zh-Hans',
  VITE_UNI_APPID,
  VITE_WX_APPID,
} = env

export default defineManifestConfig({
  /* 5+App特有相关 */
  'app-plus': {
    compatible: {
      ignoreVersion: true,
    },
    compilerVersion: 3,
    /* 应用发布信息 */
    distribute: {
      /* android打包配置 */
      android: {
        abiFilters: ['armeabi-v7a', 'arm64-v8a'],
        minSdkVersion: 30,
        permissions: [
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>',
        ],
        targetSdkVersion: 30,
      },
      /* 图标配置 */
      icons: {
        android: {
          hdpi: 'src/static/app/icons/72x72.png',
          xhdpi: 'src/static/app/icons/96x96.png',
          xxhdpi: 'src/static/app/icons/144x144.png',
          xxxhdpi: 'src/static/app/icons/192x192.png',
        },
        ios: {
          appstore: 'src/static/app/icons/1024x1024.png',
          ipad: {
            app: 'src/static/app/icons/76x76.png',
            'app@2x': 'src/static/app/icons/152x152.png',
            notification: 'src/static/app/icons/20x20.png',
            'notification@2x': 'src/static/app/icons/40x40.png',
            'proapp@2x': 'src/static/app/icons/167x167.png',
            settings: 'src/static/app/icons/29x29.png',
            'settings@2x': 'src/static/app/icons/58x58.png',
            spotlight: 'src/static/app/icons/40x40.png',
            'spotlight@2x': 'src/static/app/icons/80x80.png',
          },
          iphone: {
            'app@2x': 'src/static/app/icons/120x120.png',
            'app@3x': 'src/static/app/icons/180x180.png',
            'notification@2x': 'src/static/app/icons/40x40.png',
            'notification@3x': 'src/static/app/icons/60x60.png',
            'settings@2x': 'src/static/app/icons/58x58.png',
            'settings@3x': 'src/static/app/icons/87x87.png',
            'spotlight@2x': 'src/static/app/icons/80x80.png',
            'spotlight@3x': 'src/static/app/icons/120x120.png',
          },
        },
      },
      /* ios打包配置 */
      ios: {},
      /* SDK配置 */
      sdkConfigs: {},
    },
    /* 模块配置 */
    modules: {},
    nvueStyleCompiler: 'uni-app',
    splashscreen: {
      alwaysShowBeforeRender: true,
      autoclose: true,
      delay: 0,
      waiting: true,
    },
    usingComponents: true,
  },
  appid: VITE_UNI_APPID,
  description: VITE_APP_DESC,
  h5: {
    router: {
      base: VITE_APP_PUBLIC_BASE,
      mode: VITE_APP_ROUTER_MODE as 'hash' | 'history' | undefined,
    },
  },
  locale: VITE_FALLBACK_LOCALE, // 'zh-Hans'
  'mp-alipay': {
    styleIsolation: 'shared',
    usingComponents: true,
  },
  'mp-baidu': {
    usingComponents: true,
  },
  'mp-toutiao': {
    usingComponents: true,
  },
  /* 小程序特有相关 */
  'mp-weixin': {
    appid: VITE_WX_APPID,
    setting: {
      autoAudits: false,
      enhance: true,
      es6: true,

      ignoreDevUnusedFiles: true,
      minified: true,
      minifyWXML: true,
      minifyWXSS: true,
      postcss: true,
      swc: true,
      uglifyFileName: true,
      urlCheck: true,
    },
    usingComponents: true,
    // __usePrivacyCheck__: true,
  },
  name: VITE_APP_TITLE,
  /* 快应用特有相关 */
  quickapp: {},
  transformPx: false,
  uniStatistics: {
    enable: false,
  },
  versionCode: '100',
  versionName: '1.0.0',
  vueVersion: '3',
})
