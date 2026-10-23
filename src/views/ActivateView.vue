<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { activeAccount } from '@/api/auth'

const route = useRoute()
const router = useRouter()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('')

onMounted(async () => {
  const key = typeof route.query.key === 'string' ? route.query.key : ''
  if (!key) {
    status.value = 'error'
    message.value = '激活链接缺少必要参数，请检查邮件中的链接是否完整。'
    return
  }

  try {
    const res = await activeAccount(key)
    status.value = 'success'
    message.value = res.message || '账号激活成功，现在可以登录了。'
  } catch (error) {
    status.value = 'error'
    message.value = error instanceof Error ? error.message : '激活失败，链接可能已过期。'
  }
})
</script>

<template>
  <div class="page-container py-16">
    <div class="mx-auto max-w-120 rounded-5 bg-white p-10 text-center shadow-[0_24px_60px_-40px_rgba(16,24,40,0.35)]">
      <el-result
        :status="status === 'loading' ? 'info' : status"
        :sub-title="message || '正在验证激活信息，请稍候...'"
        :title="status === 'loading' ? '正在激活' : status === 'success' ? '激活成功' : '激活失败'"
      >
        <template v-if="status === 'loading'" #icon>
          <el-icon class="is-loading text-[#018d71]" :size="48"><Loading /></el-icon>
        </template>
        <template #extra>
          <el-button round type="primary" @click="router.push(status === 'success' ? '/login' : '/')">
            {{ status === 'success' ? '去登录' : '返回首页' }}
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>
