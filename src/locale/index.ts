import { createI18n } from 'vue-i18n'

import en from './en.json'
import zhHans from './zh-Hans.json'

const messages = {
  en,
  'zh-Hans': zhHans,
}

const i18n = createI18n({
  fallbackLocale: 'zh-Hans',
  legacy: false,
  locale: 'zh-Hans',
  messages,
})

export default i18n
