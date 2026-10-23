<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="page-container py-20 text-center">
    <div class="text-20 text-[#d5efe9] font-bold leading-none">404</div>
    <h1 class="mt-4 text-6 text-[#15181b] font-bold">页面不见了</h1>
    <p class="mt-2 text-3.5 text-[#9aa0a6]">你访问的页面可能已被删除，或者链接输入有误。</p>
    <div class="mt-6 flex justify-center gap-3">
      <el-button round type="primary" @click="router.push('/')">返回首页</el-button>
      <el-button round @click="router.back()">返回上一页</el-button>
    </div>
  </div>
</template>
