<script lang="ts" setup>
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'

export interface AlertProps {
  icon: 'time-fill' | 'success-circle-fill' | 'close-fill' | 'paperbag-fill'
  title: string
  type: 'success' | 'error'
}
const props = defineProps<AlertProps>()

const boxClass = computed(() => {
  if (props.type === 'success') {
    return 'bg-#E2FFF8 color-#49B9AD'
  } else if (props.type === 'error') {
    return 'bg-#FEF1F1 color-#F65755'
  }
  return ''
})
//
</script>

<template>
  <view class="h-11.25 flex items-center pl-3" :class="boxClass">
    <TnIcon :name="props.icon" size="40" />

    <view class="ml-2.5 text-3.5">{{ title }}</view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>

<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'default',
    navigationBarTitleText: '',
  },
}
</route>
