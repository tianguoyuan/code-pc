<script lang="ts" setup>
const url = ref('')
onLoad((query) => {
  if (!query || !query.url) return
  url.value = decodeURIComponent(query.url)
  console.log('query, url', query, url.value)
})
</script>

<template>
  <view>
    <web-view v-if="url" :src="url" />
  </view>
</template>

<style lang="scss" scoped>
//
</style>

<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'webview',
  },
}
</route>
