<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getAuthConfig, signup } from '@/api/auth'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const allowSignup = ref(true)

const form = reactive({
  loginname: '',
  email: '',
  pass: '',
  confirm: '',
})

const rules: FormRules = {
  loginname: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '用户名长度为 2-50 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: '用户名只能包含字母、数字、下划线和短横线',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  pass: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码至少 8 位', trigger: 'blur' },
    { pattern: /[a-zA-Z]/, message: '密码需包含字母', trigger: 'blur' },
  ],
  confirm: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.pass) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

async function onSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res = await signup({
      email: form.email.trim(),
      loginname: form.loginname.trim(),
      pass: form.pass,
    })
    ElMessage.success(res.message || '注册成功，请查收激活邮件')
    router.push('/login')
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await getAuthConfig({ silent: true })
    allowSignup.value = res.data.allow_signup
  } catch {
    allowSignup.value = true
  }
})
</script>

<template>
  <div class="page-container py-10">
    <div class="mx-auto max-w-130 rounded-5 bg-white p-8 shadow-[0_24px_60px_-40px_rgba(16,24,40,0.35)]">
      <div class="text-6 text-[#15181b] font-bold">创建账号</div>
      <p class="mt-1 text-3 text-[#9aa0a6]">加入 CNode 社区，和 Node.js 开发者一起交流</p>

      <el-alert
        v-if="!allowSignup"
        :closable="false"
        class="mt-4"
        show-icon
        title="当前站点暂未开放注册"
        type="warning"
      />

      <el-form
        ref="formRef"
        class="mt-5"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
      >
        <el-form-item label="用户名" prop="loginname">
          <el-input v-model="form.loginname" placeholder="字母、数字、下划线或短横线" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="用于接收激活邮件与通知" />
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            v-model="form.pass"
            placeholder="至少 8 位，需包含字母"
            show-password
            type="password"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input
            v-model="form.confirm"
            placeholder="再次输入密码"
            show-password
            type="password"
            @keyup.enter="onSubmit"
          />
        </el-form-item>

        <el-button
          class="mt-2 w-full"
          :loading="loading"
          round
          size="large"
          type="primary"
          @click="onSubmit"
        >
          注册
        </el-button>
      </el-form>

      <div class="mt-4 text-center text-3 text-[#7b8188]">
        已有账号？
        <RouterLink class="text-[#018d71]" to="/login">直接登录</RouterLink>
      </div>
    </div>
  </div>
</template>
