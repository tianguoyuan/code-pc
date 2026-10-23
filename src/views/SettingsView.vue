<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { changePass, updateProfile } from '@/api/auth'
import { getUserDetail } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const profileRef = ref<FormInstance>()
const passwordRef = ref<FormInstance>()
const loading = ref(true)
const savingProfile = ref(false)
const savingPassword = ref(false)

const profile = reactive({
  location: '',
  receive_at_mail: false,
  receive_reply_mail: false,
  signature: '',
  url: '',
  weibo: '',
})

const password = reactive({
  confirm: '',
  newPass: '',
  oldPass: '',
})

const profileRules: FormRules = {
  url: [{ type: 'url', message: '请输入合法的链接', trigger: 'blur' }],
  weibo: [{ type: 'url', message: '请输入合法的链接', trigger: 'blur' }],
}

const passwordRules: FormRules = {
  oldPass: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPass: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码至少 8 位', trigger: 'blur' },
    { pattern: /[a-zA-Z]/, message: '密码需包含字母', trigger: 'blur' },
  ],
  confirm: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== password.newPass) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

async function loadProfile() {
  loading.value = true
  try {
    const res = await getUserDetail(userStore.loginname)
    const detail = res.data
    profile.signature = detail.signature || ''
    profile.location = detail.location || ''
    profile.url = detail.url || ''
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  if (!profileRef.value) return
  const valid = await profileRef.value.validate().catch(() => false)
  if (!valid) return

  savingProfile.value = true
  try {
    await updateProfile({
      location: profile.location.trim() || undefined,
      receive_at_mail: profile.receive_at_mail,
      receive_reply_mail: profile.receive_reply_mail,
      signature: profile.signature.trim() || undefined,
      url: profile.url.trim() || undefined,
      weibo: profile.weibo.trim() || undefined,
    })
    ElMessage.success('资料已更新')
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    savingProfile.value = false
  }
}

async function savePassword() {
  if (!passwordRef.value) return
  const valid = await passwordRef.value.validate().catch(() => false)
  if (!valid) return

  savingPassword.value = true
  try {
    await changePass({ newPass: password.newPass, oldPass: password.oldPass })
    ElMessage.success('密码修改成功，请重新登录')
    userStore.clear()
    router.push('/login')
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    savingPassword.value = false
  }
}

onMounted(() => {
  void loadProfile()
})
</script>

<template>
  <div class="page-container py-6">
    <div class="mb-4">
      <h1 class="text-6 text-[#15181b] font-bold">个人设置</h1>
      <p class="mt-1 text-3 text-[#9aa0a6]">管理你的个人资料、邮件通知与登录密码</p>
    </div>

    <el-skeleton v-if="loading" :rows="8" animated class="card-base p-6" />

    <div v-else class="grid items-start gap-4 lg:grid-cols-2">
      <section class="card-base p-6">
        <div class="mb-4 flex items-center gap-3">
          <el-avatar :size="46" :src="userStore.userInfo?.avatar_url" />
          <div>
            <div class="text-4 text-[#15181b] font-bold">{{ userStore.loginname }}</div>
            <div class="text-2.75 text-[#9aa0a6]">社区账号 · 基础资料</div>
          </div>
        </div>

        <el-form ref="profileRef" :model="profile" :rules="profileRules" label-position="top">
          <el-form-item label="个人简介">
            <el-input
              v-model="profile.signature"
              :rows="3"
              maxlength="200"
              placeholder="介绍一下自己，比如技术方向、兴趣等"
              show-word-limit
              type="textarea"
            />
          </el-form-item>

          <div class="grid gap-x-4 md:grid-cols-2">
            <el-form-item label="所在地">
              <el-input v-model="profile.location" placeholder="如：杭州" />
            </el-form-item>
            <el-form-item label="个人主页" prop="url">
              <el-input v-model="profile.url" placeholder="https://..." />
            </el-form-item>
          </div>

          <el-form-item label="微博链接" prop="weibo">
            <el-input v-model="profile.weibo" placeholder="https://weibo.com/..." />
          </el-form-item>

          <div class="rounded-3 bg-[#f7f9f9] p-4">
            <div class="mb-2 text-3.25 text-[#15181b] font-semibold">邮件通知</div>
            <div class="flex items-center justify-between py-1">
              <span class="text-3 text-[#5b636b]">接收社区公告邮件</span>
              <el-switch v-model="profile.receive_at_mail" />
            </div>
            <div class="flex items-center justify-between py-1">
              <span class="text-3 text-[#5b636b]">接收回复提醒邮件</span>
              <el-switch v-model="profile.receive_reply_mail" />
            </div>
          </div>

          <el-button
            class="mt-5"
            :loading="savingProfile"
            round
            type="primary"
            @click="saveProfile"
          >
            保存资料
          </el-button>
        </el-form>
      </section>

      <section class="card-base p-6">
        <h2 class="text-4 text-[#15181b] font-bold">修改密码</h2>
        <p class="mt-1 text-3 text-[#9aa0a6]">修改成功后需要重新登录</p>

        <el-form
          ref="passwordRef"
          class="mt-5"
          :model="password"
          :rules="passwordRules"
          label-position="top"
        >
          <el-form-item label="当前密码" prop="oldPass">
            <el-input
              v-model="password.oldPass"
              placeholder="请输入当前密码"
              show-password
              type="password"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input
              v-model="password.newPass"
              placeholder="至少 8 位，需包含字母"
              show-password
              type="password"
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirm">
            <el-input
              v-model="password.confirm"
              placeholder="再次输入新密码"
              show-password
              type="password"
              @keyup.enter="savePassword"
            />
          </el-form-item>

          <el-button :loading="savingPassword" round type="primary" @click="savePassword">
            修改密码
          </el-button>
        </el-form>
      </section>
    </div>
  </div>
</template>
