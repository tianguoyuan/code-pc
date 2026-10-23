import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css'
import 'virtual:uno.css'
import '@/styles/index.scss'

import { restoreSession } from '@/api/session'
import { useUserStore } from '@/stores/user'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale: zhCn })

const userStore = useUserStore(pinia)
if (userStore.accesstoken) {
  // 后台静默校验本地 token，失败会自动清理登录态
  void restoreSession()
}

app.mount('#app')
