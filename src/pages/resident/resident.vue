<script lang="ts" setup>
import { TnInput } from '@tuniao/tnui-vue3-uniapp'

import Navbar from '@/components/Navbar.vue'
import Tabbar from '@/components/Tabbar.vue'
import { StyleEnum } from '@/enums/StyleEnum'
import { useAppStore } from '@/store/app'
import { getImage } from '@/utils/imageManager'
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
    <Navbar title="居民" />
    <view class="bg-#fff">
      <view class="px-3">
        <view class="z-10 h-10 flex items-center rounded-2.5 bg-#F5F7FB px-3.75">
          <image class="h-5 w-5" :src="getImage('commonSearch')" />
          <TnInput :border="false" height="40" placeholder="搜索居民姓名/电话" />
        </view>
      </view>
      <view class="p-4">居民页面</view>
    </view>
    <Tabbar tabbarPath="/pages/resident/resident" />
  </view>
</template>

<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '居民',
  },
  needLogin: false,
}
</route>
