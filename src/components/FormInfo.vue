<script lang="ts" setup>
export interface FormInfoItem {
  name: string
  nameColor?: string
  value: string
  valueColor?: string
}
const props = defineProps<{
  listData: FormInfoItem[]
}>()
</script>

<template>
  <view class="">
    <view
      v-for="item in props.listData"
      :key="item.name"
      class="h-13 flex items-center border-0 border-b-1 border-#E3E4E5 border-solid text-3.5"
    >
      <text class="w-24" :style="{ color: item.nameColor || '' }">{{ item.name }}</text>
      <text class="" :style="{ color: item.valueColor || '' }">{{ item.value }}</text>
    </view>
  </view>
</template>
