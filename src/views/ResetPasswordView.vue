<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { resetPass, searchPass } from '@/api/auth'

const route = useRoute()
const router = useRouter()

const key = computed(() => (typeof route.query.key === 'string' ? route.query.key : ''))
const mode = computed(() => (key.value ? 'reset' : 'search'))

const formRef = ref<FormInstance>()
const loading = ref(false)
const done = ref(false)

const form = reactive({
  email: '',
  pass: '',
  confirm: '',
})

const rules = computed<FormRules>(() =>
  mode.value === 'search'
    ? {
        email: [
          { required: true, message: '请输入注册邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
        ],
      }
    : {
        pass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 8, message: '密码至少 8 位', trigger: 'blur' },
          { pattern: /[a-zA-Z]/, message: '密码需包含字母', trigger: 'blur' },
        ],
        confirm: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            validator: (_rule, value, callback) => {
              if (value !== form.pass) callback(new Error('两次输入的密码不一致'))
              else callback()
            },
            trigger: 'blur',
          },
        ],
      },
)

async function onSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    if (mode.value === 'search') {
      await searchPass({ email: form.email.trim() })
      done.value = true
      ElMessage.success('找回密码邮件已发送，请查收')
    } else {
      await resetPass({ key: key.value, psw: form.pass })
      ElMessage.success('密码重置成功，请使用新密码登录')
      router.push('/login')
    }
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-container py-10">
    <div class="mx-auto max-w-120 rounded-5 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(16,24,40,0.35)]">
      <div class="text-6 text-[#15181b] font-bold">
        {{ mode === 'search' ? '找回密码' : '重置密码' }}
      </div>
      <p class="mt-1 text-3 text-[#9aa0a6]">
        {{
          mode === 'search'
            ? '输入注册邮箱，我们会发送重置密码链接给你'
            : '请设置一个新的登录密码'
        }}
      </p>

      <el-result
        v-if="done"
        icon="success"
        sub-title="请前往邮箱点击链接，继续完成密码重置"
        title="邮件已发送"
      >
        <template #extra>
          <el-button round type="primary" @click="router.push('/login')">返回登录</el-button>
        </template>
      </el-result>

      <el-form
        v-else
        ref="formRef"
        class="mt-5"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
      >
        <template v-if="mode === 'search'">
          <el-form-item label="注册邮箱" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入注册邮箱"
              @keyup.enter="onSubmit"
            />
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="新密码" prop="pass">
            <el-input
              v-model="form.pass"
              placeholder="至少 8 位，需包含字母"
              show-password
              type="password"
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirm">
            <el-input
              v-model="form.confirm"
              placeholder="再次输入新密码"
              show-password
              type="password"
              @keyup.enter="onSubmit"
            />
          </el-form-item>
        </template>

        <el-button
          class="mt-2 w-full"
          :loading="loading"
          round
          size="large"
          type="primary"
          @click="onSubmit"
        >
          {{ mode === 'search' ? '发送重置邮件' : '重置密码' }}
        </el-button>
      </el-form>

      <div class="mt-4 text-center text-3">
        <RouterLink class="text-[#018d71]" to="/login">返回登录</RouterLink>
      </div>
    </div>
  </div>
</template>
