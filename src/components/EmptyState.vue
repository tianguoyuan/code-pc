<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div
      class="h-16 w-16 flex items-center justify-center rounded-full bg-[#f2f5f4] text-7 text-[#b7c0c6]"
    >
      <slot name="icon">
        <span>∅</span>
      </slot>
    </div>
    <p class="mt-4 text-3.5 text-[#5b636b]">{{ text }}</p>
    <p v-if="description" class="mt-1 text-3 text-[#9aa0a6]">{{ description }}</p>
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    text?: string
    description?: string
  }>(),
  {
    text: '暂无数据',
    description: '',
  },
)
</script>
