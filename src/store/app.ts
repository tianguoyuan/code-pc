import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const systemScreenHeight = ref(0)

  return {
    systemScreenHeight,
  }
})
