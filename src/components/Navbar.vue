<script lang="ts" setup>
// import { useUniAppSystemRectInfo } from '@tuniao/tnui-vue3-uniapp'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import TnNavbar from '@tuniao/tnui-vue3-uniapp/components/navbar/src/navbar.vue'

import { PageEnum } from '@/enums/PageEnum'
// const { navBarInfo } = useUniAppSystemRectInfo()

const props = withDefaults(
  defineProps<{
    bgColor?: string
    bottomShadow?: boolean
    clickBackIcon?: () => void
    clickHomeIcon?: () => void
    frosted?: boolean
    opacity?: number
    placeholder?: boolean
    showBackIcon?: boolean
    showBorder?: boolean
    showHomeIcon?: boolean
    textColor?: string
    title: string
  }>(),
  {
    bgColor: 'white',
    bottomShadow: true,
    clickBackIcon: undefined,
    clickHomeIcon: undefined,
    frosted: false,
    opacity: 1,
    placeholder: true,
    showBackIcon: false,
    showBorder: false,
    showHomeIcon: false,
    textColor: 'black',
    title: '',
  },
)

const showLeftBox = computed(() => props.showBackIcon || props.showHomeIcon)

function handleClickBackIcon() {
  if (props.clickBackIcon) {
    props.clickBackIcon()
  } else {
    if (getCurrentPages().length <= 1) {
      uni.reLaunch({ url: PageEnum.HOME_PATH })
    } else {
      uni.navigateBack({
        fail: () => {
          uni.reLaunch({ url: PageEnum.HOME_PATH })
        },
      })
    }
  }
}

function handleClickHomeIcon() {
  if (props.clickHomeIcon) {
    props.clickHomeIcon()
  } else {
    uni.reLaunch({ url: PageEnum.HOME_PATH })
  }
}
</script>

<template>
  <TnNavbar
    :bgColor="props.bgColor"
    :bottomShadow="props.bottomShadow"
    fixed
    :frosted="props.frosted"
    :opacity="props.opacity"
    :placeholder="props.placeholder"
    :textColor="props.textColor"
  >
    <!-- :status-height="navBarInfo.statusHeight"
    height="90rpx" -->
    <view class="text-3.5">
      <slot name="title" />
      {{ props.title }}

      <view class="absolute bottom-0 right-3 top-0 w-21.75 flex items-center justify-end">
        <slot name="right" />
      </view>
    </view>

    <!-- border -->
    <view
      v-if="props.showBorder"
      class="absolute bottom-0 left-0 right-0 h-[1px] scale-y-50 bg-#efefef"
    />
    <template #back>
      <view
        v-if="showLeftBox"
        class="relative box-border h-8 w-full flex items-center justify-center rounded-full bg-[rgba(0,0,0,.15)] text-3.75"
        :class="[!props.showBackIcon || !props.showHomeIcon ? 'w-70%!' : '']"
      >
        <TnIcon
          v-if="props.showBackIcon"
          color="#fff"
          :customClass="[props.showBackIcon && props.showHomeIcon ? 'flex-1' : ''].join(' ')"
          name="left-arrow"
          @click="handleClickBackIcon"
        />
        <view
          v-if="props.showBackIcon && props.showHomeIcon"
          class="absolute left-50% top-50% h-60% w-1px translate-x--50% translate-y--50% bg-#fff opacity-20"
        ></view>
        <TnIcon
          v-if="props.showHomeIcon"
          color="#fff"
          :customClass="[props.showBackIcon && props.showHomeIcon ? 'flex-1' : ''].join(' ')"
          name="home-capsule-fill"
          @click="handleClickHomeIcon"
        />
      </view>
    </template>
  </TnNavbar>
</template>

<style lang="scss" scoped>
//
</style>
