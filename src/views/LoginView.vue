<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { Key, Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { loginByPassword, loginByToken } from '@/api/session'
import { useMessageStore } from '@/stores/message'

const route = useRoute()
const router = useRouter()
const messageStore = useMessageStore()

const mode = ref<'password' | 'token'>('password')
const loading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  pass: '',
  token: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  token: [{ required: true, message: '请输入 Access Token', trigger: 'blur' }],
}

const redirect = computed(() => {
  const value = route.query.redirect
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
})

async function onSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    if (mode.value === 'password') {
      await loginByPassword(form.name.trim(), form.pass)
    } else {
      await loginByToken(form.token.trim())
    }
    messageStore.startPolling()
    ElMessage.success('登录成功，欢迎回来')
    router.replace(redirect.value)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

function switchMode(value: string | number) {
  mode.value = value as 'password' | 'token'
  formRef.value?.clearValidate()
}
</script>

<template>
  <div class="page-container py-10">
    <div class="auth-card">
      <div class="auth-aside">
        <div class="text-2.75 text-white/70 font-semibold tracking-widest">CNODE COMMUNITY</div>
        <h1 class="mt-4 text-7.5 text-white font-bold leading-tight">
          回到社区
          <br />
          继续交流
        </h1>
        <p class="mt-4 text-3.5 text-white/75 leading-relaxed">
          Node.js 中文技术社区。和开发者们一起分享经验、讨论问题、寻找机会。
        </p>

        <div class="mt-8 rounded-3 bg-white/10 px-4 py-3 text-3 text-white/80 backdrop-blur">
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-[#7dd3c0]" />
            支持账号密码与 Access Token 两种登录方式
          </div>
        </div>

        <div class="auth-aside-footer">
          还没有账号？
          <RouterLink class="text-white underline underline-offset-2" to="/signup">
            立即注册
          </RouterLink>
        </div>
      </div>

      <div class="auth-form">
        <div class="text-6 text-[#15181b] font-bold">登录</div>
        <p class="mt-1 text-3 text-[#9aa0a6]">登录后即可发帖、回复、收藏和接收消息</p>

        <el-tabs class="mt-5" :model-value="mode" @tab-change="switchMode">
          <el-tab-pane label="账号密码" name="password" />
          <el-tab-pane label="Access Token" name="token" />
        </el-tabs>

        <el-form
          ref="formRef"
          class="mt-2"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
          @submit.prevent="onSubmit"
        >
          <template v-if="mode === 'password'">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="form.name" :prefix-icon="User" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input
                v-model="form.pass"
                :prefix-icon="Lock"
                placeholder="请输入密码"
                show-password
                type="password"
                @keyup.enter="onSubmit"
              />
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item label="Access Token" prop="token">
              <el-input
                v-model="form.token"
                :prefix-icon="Key"
                placeholder="粘贴 CNode Access Token"
                show-password
                type="password"
                @keyup.enter="onSubmit"
              />
            </el-form-item>
            <el-alert
              :closable="false"
              class="mb-4"
              description="可在 CNode 官网登录后，于个人设置页获取 Access Token。"
              show-icon
              title="Token 登录"
              type="info"
            />
          </template>

          <el-button
            class="mt-2 w-full"
            :loading="loading"
            round
            size="large"
            type="primary"
            @click="onSubmit"
          >
            登录
          </el-button>
        </el-form>

        <div class="mt-4 flex items-center justify-between text-3">
          <RouterLink class="text-[#7b8188] hover:text-[#018d71]" to="/reset-password">
            忘记密码？
          </RouterLink>
          <RouterLink class="text-[#018d71]" to="/signup">注册新账号</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-card {
  display: grid;
  max-width: 960px;
  min-height: 540px;
  margin: 0 auto;
  overflow: hidden;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 30px 60px -40px rgba(16, 24, 40, 0.35);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .auth-card {
    grid-template-columns: 0.9fr 1.1fr;
  }
}

.auth-aside {
  position: relative;
  display: none;
  padding: 48px 44px;
  overflow: hidden;
  background:
    radial-gradient(600px 300px at 10% 10%, rgba(125, 211, 192, 0.35), transparent 60%),
    linear-gradient(150deg, #064f43 0%, #017a62 55%, #018d71 100%);
}

@media (min-width: 768px) {
  .auth-aside {
    display: flex;
    flex-direction: column;
  }
}

.auth-aside::after {
  position: absolute;
  right: -60px;
  bottom: -80px;
  width: 240px;
  height: 240px;
  content: '';
  background: radial-gradient(circle, rgba(255, 255, 255, 0.16), transparent 68%);
  border-radius: 50%;
}

.auth-aside-footer {
  margin-top: auto;
  padding-top: 32px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.auth-form {
  padding: 44px 40px;
}
</style>
