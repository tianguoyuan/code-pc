import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import path from 'node:path'
import { loadEnv } from 'vite'

// 获取环境变量的范例
const env = loadEnv(process.env.NODE_ENV!, path.resolve(process.cwd(), 'env'))
const { VITE_APP_TITLE } = env

export default defineUniPages({
  easycom: {
    autoscan: true,
    custom: {
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  globalStyle: {
    backgroundColor: '#FFFFFF',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: VITE_APP_TITLE,
    navigationStyle: 'default',
  },
  tabBar: {
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    color: '#999999',
    custom: true,
    fontSize: '10px',
    height: '50px',
    iconWidth: '24px',
    list: [
      { pagePath: 'pages/home/home' },
      { pagePath: 'pages/resident/resident' },
      { pagePath: 'pages/message/message' },
      { pagePath: 'pages/mine/mine' },
    ],
    selectedColor: '#018d71',
    spacing: '3px',
  },
})
