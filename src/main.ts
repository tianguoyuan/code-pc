import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

import '@/style/index.scss'
import 'virtual:uno.css'
import '@tuniao/tn-icon/dist/index.css'

import { createSSRApp } from 'vue'

import App from './App.vue'
import { prototypeInterceptor, requestInterceptor, routeInterceptor } from './interceptors'
import i18n from './locale'
import store from './store'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(i18n)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(prototypeInterceptor)

  return {
    app,
  }
}
