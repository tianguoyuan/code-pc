import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    function changeToken(v: string) {
      token.value = v
    }

    const userId = ref('')
    function changeUserId(v: string) {
      userId.value = v
    }

    const isLogin = computed(() => {
      return !!token.value
    })

    function clearUserInfo() {
      token.value = ''
      userId.value = ''
    }

    return {
      changeToken,
      changeUserId,

      clearUserInfo,
      isLogin,
      token,

      userId,
    }
  },
  {
    persist: true,
  },
)
