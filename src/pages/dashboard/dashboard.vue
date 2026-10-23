<script lang="ts" setup>
import { useUniAppSystemRectInfo } from '@tuniao/tnui-vue3-uniapp/hooks'

import { PageEnum } from '@/enums/PageEnum'
import { useUserStore } from '@/store'
import { getImage } from '@/utils/imageManager'
const rectInfo = useUniAppSystemRectInfo()

const count = ref(5)

// 倒计时
const timer = setInterval(() => {
  if (count.value <= 0) {
    clearInterval(timer)
    return
  }
  count.value--
}, 1000)

onUnmounted(() => {
  clearInterval(timer)
})

const userStore = useUserStore()
function pageToHome() {
  if (count.value > 0) clearInterval(timer)

  if (userStore.isLogin) {
    uni.switchTab({
      url: PageEnum.HOME_PATH,
    })
  } else {
    uni.redirectTo({
      url: PageEnum.LOGIN_PATH,
    })
  }
}
</script>

<template>
  <view>
    <view :style="{ height: rectInfo.navBarInfo.height + 'px' }"></view>
    <view class="relative px-6">
      <view
        class="absolute right-6 h-7.5 flex items-center rounded-1.25 bg-[#6A6D6F] px-3.5 color-#fff"
        @click="pageToHome"
      >
        <text>跳过</text>
        <text v-if="count !== 0" class="ml-0.5">{{ count }}</text>
      </view>
      <image class="mt-16 w-full px-2" mode="widthFix" :src="getImage('dashboardCover')" />
    </view>
    <view class="absolute bottom-13 w-full flex justify-center">
      <image class="h-7.75 w-40.5" :src="getImage('dashboardTitle')" />
      <view class="bg-#f99 pb-safe"></view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>

<route lang="json5" type="home">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '引导页',
  },
}
</route>
