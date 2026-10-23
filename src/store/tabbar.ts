import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTabbarStore = defineStore('tabbar', () => {
  const hideTabbar = ref(false)

  function changeHideTabbar(v: boolean) {
    hideTabbar.value = v
  }
  const tabbarIndex = ref(0)
  function changeTabbarIndex(v: number) {
    tabbarIndex.value = v
  }

  return {
    changeHideTabbar,
    changeTabbarIndex,
    hideTabbar,
    tabbarIndex,
  }
})
