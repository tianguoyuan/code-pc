<script lang="ts" setup>
import Navbar from '@/components/Navbar.vue'
import Tabbar from '@/components/Tabbar.vue'
import { StyleEnum } from '@/enums/StyleEnum'
import { useAppStore } from '@/store/app'
import PLATFORM from '@/utils/platform'

//
onLoad(() => PLATFORM.isApp && uni.hideTabBar())

const appStore = useAppStore()
</script>

<template>
  <view
    class="bg-#F5F7FB"
    :style="{
      minHeight: appStore.systemScreenHeight - StyleEnum.TAB_BAR_HEIGHT_PX + 'px',
    }"
  >
    <Navbar title="消息" />
    <view class="p-4">消息</view>
    <Tabbar :placeholder="false" tabbarPath="/pages/message/message" />
  </view>
</template>

<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '消息',
  },
  needLogin: false,
}
</route>
