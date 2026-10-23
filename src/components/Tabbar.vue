<script lang="ts" setup>
import TnTabbarItem from '@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar-item.vue'
import TnTabbar from '@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar.vue'

import { PageEnum } from '@/enums/PageEnum'
import { StyleEnum } from '@/enums/StyleEnum'
import { useTabbarStore } from '@/store/tabbar'
import { getImage } from '@/utils/imageManager'
import PLATFORM from '@/utils/platform'

const tabbarStore = useTabbarStore()

const tabbarList = [
  {
    activeIcon: getImage('tabbarHomeActive'),
    icon: getImage('tabbarHome'),
    path: PageEnum.HOME_PATH,
    title: '首页',
  },
  {
    activeIcon: getImage('tabbarResidentActive'),
    icon: getImage('tabbarResident'),
    path: '/pages/resident/resident',
    title: '居民',
  },
  {
    activeIcon: getImage('tabbarMessageActive'),
    icon: getImage('tabbarMessage'),
    path: '/pages/message/message',
    title: '消息',
  },
  {
    activeIcon: getImage('tabbarMineActive'),
    icon: getImage('tabbarMine'),
    path: '/pages/mine/mine',
    title: '我的',
  },
] as const
type PathType = (typeof tabbarList)[number]['path']
const props = withDefaults(
  defineProps<{
    tabbarPath: PathType
    topShadow?: boolean
    placeholder?: boolean
  }>(),
  {
    placeholder: true,
    topShadow: true,
  },
)

// 初次进入生效
const tabbarIndex = tabbarList.findIndex((v) => v.path === props.tabbarPath)
tabbarStore.changeTabbarIndex(tabbarIndex)

function pageTo(index: number) {
  tabbarStore.changeTabbarIndex(index)
  const path = tabbarList[index]?.path
  if (!path) return
  uni.switchTab({ url: path })
}
</script>

<template>
  <!-- h5多一个占位tabbar高度, 其它没有 -->
  <view v-if="!PLATFORM.isH5" class="h-12.5" />
  <TnTabbar
    v-if="!tabbarStore.hideTabbar"
    :bgColor="StyleEnum.MAIN_BG_COLOR"
    fixed
    :height="StyleEnum.TAB_BAR_HEIGHT + 'rpx'"
    :modelValue="tabbarStore.tabbarIndex"
    :placeholder="props.placeholder"
    safeAreaInsetBottom
    :topShadow="props.topShadow"
  >
    <TnTabbarItem v-for="(item, index) in tabbarList" :key="index" @click="pageTo(index)">
      <template #default>
        <view v-if="item.title" class="h-100rpx flex flex-1 items-center justify-center">
          <view class="flex flex-col items-center justify-center text-3">
            <view>
              <image
                v-show="index === tabbarStore.tabbarIndex"
                class="h-5 w-5"
                :src="item.activeIcon"
              />
              <image v-show="index !== tabbarStore.tabbarIndex" class="h-5 w-5" :src="item.icon" />
            </view>
            <view
              class="mt-1"
              :class="[index === tabbarStore.tabbarIndex ? 'text-[#49b9ad]' : 'text-[#1c2023]']"
            >
              {{ item.title }}
            </view>
          </view>
        </view>

        <view v-else class="flex flex-1 items-start">
          <image class="mt-1 h-9 w-9" :src="(item as (typeof tabbarList)[0]).icon" />
        </view>
      </template>
    </TnTabbarItem>
  </TnTabbar>
</template>

<style lang="scss">
//
</style>
