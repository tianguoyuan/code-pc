<script lang="ts" setup>
import { ArrowDown, Bell, EditPen, Menu as MenuIcon, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { logout } from '@/api/session'
import { useMessageStore } from '@/stores/message'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const messageStore = useMessageStore()

function goCreate() {
  router.push('/topic/create')
}

function goLogin() {
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}

async function onUserCommand(command: string) {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定退出当前账号吗？', '退出登录', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch {
      return
    }
    await logout()
    messageStore.reset()
    ElMessage.success('已退出登录')
    router.push('/')
    return
  }
  router.push(command)
}

watch(
  () => userStore.isLogin,
  (isLogin) => {
    if (isLogin) messageStore.startPolling()
    else messageStore.reset()
  },
  { immediate: true },
)

watch(
  () => route.fullPath,
  () => {
    if (userStore.isLogin) void messageStore.refreshUnread()
  },
)

onMounted(() => {
  if (userStore.isLogin) messageStore.startPolling()
})

onBeforeUnmount(() => {
  messageStore.stopPolling()
})
</script>

<template>
  <header class="site-header">
    <div class="page-container h-16 flex items-center gap-3">
      <RouterLink class="brand" to="/">
        <span class="brand-mark">C</span>
        <span class="brand-text">
          CNode
          <em>社区</em>
        </span>
      </RouterLink>

      <nav class="ml-4 hidden items-center gap-1 md:flex">
        <RouterLink class="nav-link" exact-active-class="is-active" to="/">首页</RouterLink>
        <RouterLink class="nav-link" active-class="is-active" to="/jobs">招聘专区</RouterLink>
        <RouterLink class="nav-link" active-class="is-active" to="/rank">社区榜单</RouterLink>
      </nav>

      <div class="flex-1" />

      <el-dropdown class="md:hidden" trigger="click">
        <el-button :icon="MenuIcon" circle text aria-label="菜单" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="router.push('/')">首页</el-dropdown-item>
            <el-dropdown-item @click="router.push('/jobs')">招聘专区</el-dropdown-item>
            <el-dropdown-item @click="router.push('/rank')">社区榜单</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <template v-if="!userStore.isLogin">
        <el-button class="hidden sm:inline-flex" text @click="goLogin">登录</el-button>
        <el-button round type="primary" @click="router.push('/signup')">注册</el-button>
      </template>

      <template v-else>
        <el-button class="hidden sm:inline-flex" :icon="Plus" round type="primary" @click="goCreate">
          发布话题
        </el-button>

        <RouterLink class="icon-button" title="消息中心" to="/messages">
          <el-badge :hidden="!messageStore.unread" :max="99" :value="messageStore.unread">
            <el-icon :size="19"><Bell /></el-icon>
          </el-badge>
        </RouterLink>

        <el-dropdown trigger="click" @command="onUserCommand">
          <div class="user-chip">
            <el-avatar :size="30" :src="userStore.userInfo?.avatar_url">
              {{ userStore.loginname.slice(0, 1).toUpperCase() }}
            </el-avatar>
            <span class="hidden max-w-24 truncate sm:inline">{{ userStore.loginname }}</span>
            <el-icon class="text-[#9aa0a6]"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="`/user/${userStore.loginname}`">
                个人主页
              </el-dropdown-item>
              <el-dropdown-item command="/settings">个人设置</el-dropdown-item>
              <el-dropdown-item :icon="EditPen" command="/topic/create">发布话题</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>
  </header>
</template>

<style scoped lang="scss">
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.86);
  border-bottom: 1px solid rgba(236, 238, 241, 0.9);
  backdrop-filter: blur(14px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 8px;

  &:hover .brand-mark {
    transform: rotate(-6deg);
  }
}

.brand-mark {
  display: flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #0bb28e 0%, #017a62 100%);
  border-radius: 11px;
  box-shadow: 0 6px 14px -6px rgba(1, 141, 113, 0.7);
  transition: transform 0.18s ease;
}

.brand-text {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #15181b;

  em {
    margin-left: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    color: #9aa0a6;
    letter-spacing: 1px;
  }
}

.nav-link {
  padding: 7px 13px;
  font-size: 14px;
  color: #5b636b;
  border-radius: 8px;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: #018d71;
    background: #f0faf7;
  }

  &.is-active {
    font-weight: 600;
    color: #018d71;
    background: #e8f8f5;
  }
}

.icon-button {
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  color: #4b5157;
  border-radius: 10px;
  transition: background 0.15s ease;

  &:hover {
    background: #f2f4f6;
  }
}

.user-chip {
  display: flex;
  height: 38px;
  padding: 0 8px;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #25292e;
  cursor: pointer;
  border-radius: 10px;
  outline: none;
  transition: background 0.15s ease;

  &:hover {
    background: #f2f4f6;
  }
}
</style>
