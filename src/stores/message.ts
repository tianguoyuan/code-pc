import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getMessageCount } from '@/api/message'

import { useUserStore } from './user'

export const useMessageStore = defineStore('message', () => {
  const unread = ref(0)
  let timer: ReturnType<typeof setInterval> | undefined

  async function refreshUnread() {
    const userStore = useUserStore()
    if (!userStore.isLogin) {
      unread.value = 0
      return
    }
    try {
      const res = await getMessageCount({ silent: true })
      unread.value = res.data || 0
    } catch {
      unread.value = 0
    }
  }

  function startPolling() {
    stopPolling()
    void refreshUnread()
    timer = setInterval(() => void refreshUnread(), 60_000)
  }

  function stopPolling() {
    if (timer) {
      clearInterval(timer)
      timer = undefined
    }
  }

  function setUnread(value: number) {
    unread.value = Math.max(0, value)
  }

  function reset() {
    unread.value = 0
    stopPolling()
  }

  return { refreshUnread, reset, setUnread, startPolling, stopPolling, unread }
})
