<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { useUniAppSystemRectInfo } from '@tuniao/tnui-vue3-uniapp/hooks'

import Tabbar from '@/components/Tabbar.vue'
import { PageEnum } from '@/enums/PageEnum'
import { StyleEnum } from '@/enums/StyleEnum'
import { useAppStore } from '@/store/app'
//
import PLATFORM from '@/utils/platform'
onLoad(() => PLATFORM.isApp && uni.hideTabBar())

const { navBarInfo } = useUniAppSystemRectInfo()
const { systemScreenHeight } = useAppStore()
</script>

<template>
  <view
    class="bg-#F5F7FB"
    :style="{ minHeight: systemScreenHeight - StyleEnum.TAB_BAR_HEIGHT_PX + 'px' }"
  >
    <view class="bg-[linear-gradient(180deg,#E1FAF7_0.57%,#FFFFFF_100%)]">
      <view class="color-#000" :style="{ height: navBarInfo.height + 'px' }">
        <view :style="{ height: navBarInfo.statusHeight + 'px' }"></view>
        <view
          class="flex items-center justify-center text-3.5"
          :style="{ height: navBarInfo.height - navBarInfo.statusHeight + 'px' }"
        >
          首页
        </view>
      </view>
    </view>

    <view class="p-4">首页page</view>
    <Tabbar :tabbarPath="PageEnum.HOME_PATH" />
  </view>
</template>

<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
  needLogin: false,
}
</route>
