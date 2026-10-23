<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

import { navigateToInterceptor } from './interceptors/route'
import { useAppStore } from './store/app'

const appStore = useAppStore()

function setAppInfo(options: { path: string }) {
  navigateToInterceptor.invoke({ url: '/' + options.path })
  const windowInfo = uni.getWindowInfo()
  console.log('屏幕高度：', windowInfo.screenHeight, windowInfo)
  appStore.systemScreenHeight = windowInfo.screenHeight
}

// #ifndef MP
let launchOptions: { path: string } | null = null
function onResize() {
  if (launchOptions) {
    setAppInfo(launchOptions)
  }
}
// #endif

onLaunch((options) => {
  console.log('App Launch', options)
  if (!options) return
  setAppInfo(options)
  // #ifndef MP
  launchOptions = options
  window.addEventListener('resize', onResize)
  // #endif
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  // #ifndef MP
  window.removeEventListener('resize', onResize)
  // #endif
  console.log('App Hide')
})
</script>

<style lang="scss">
// 微信 tabbar.custom隐藏， h5单独设置
// #ifndef MP
.uni-tabbar-bottom {
  display: none;
}
$appMaxWidth: 500px;
// 大于$appMaxWidth
@media (min-width: $appMaxWidth) {
  page {
    position: relative;
    max-width: $appMaxWidth; /* 设计稿宽度 */
    min-height: 100%;
    margin: 0 auto;
    background: #fff;
  }
  .tn-navbar,
  .tn-tabbar {
    right: 0;
    left: 0;
    max-width: $appMaxWidth; /* 设计稿宽度 */
    margin: auto;
  }
  .uni-page-head {
    width: $appMaxWidth;
    margin: auto;
  }
  html {
    font-size: 20px !important;
  }
  html,
  body {
    overflow: auto;
    background: #ddd;
  }
}
// 小于300px
@media (max-width: 300px) {
  html {
    font-size: 12px !important;
  }
}
// #endif
</style>
