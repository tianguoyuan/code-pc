import type { CnodeUser } from '@/api/types'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const TOKEN_KEY = 'cnode:token'
const USER_KEY = 'cnode:user'

function readUser(): CnodeUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as CnodeUser) : null
  } catch {
    return null
  }
}

export const useUserStore = defineStore('user', () => {
  const accesstoken = ref(localStorage.getItem(TOKEN_KEY) || '')
  const userInfo = ref<CnodeUser | null>(readUser())

  const isLogin = computed(() => Boolean(accesstoken.value))
  const loginname = computed(() => userInfo.value?.loginname || '')

  function setAccesstoken(token: string) {
    accesstoken.value = token
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  }

  function setUserInfo(user: CnodeUser | null) {
    userInfo.value = user
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }

  function clear() {
    setAccesstoken('')
    setUserInfo(null)
  }

  return {
    accesstoken,
    clear,
    isLogin,
    loginname,
    setAccesstoken,
    setUserInfo,
    userInfo,
  }
})
