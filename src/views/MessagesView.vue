<script lang="ts" setup>
import type { MessageItem } from '@/api/types'

import { Check, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getMessages, markAllMessagesRead, markMessageRead } from '@/api/message'
import EmptyState from '@/components/EmptyState.vue'
import { MESSAGE_TYPE_LABEL } from '@/enums'
import { useMessageStore } from '@/stores/message'
import { formatRelativeTime, plainText } from '@/utils/format'

const router = useRouter()
const messageStore = useMessageStore()

const unreadMessages = ref<MessageItem[]>([])
const readMessages = ref<MessageItem[]>([])
const loading = ref(true)
const markingAll = ref(false)

const unreadCount = computed(() => unreadMessages.value.length)

async function loadMessages() {
  loading.value = true
  try {
    const res = await getMessages()
    unreadMessages.value = res.data?.hasnot_read_messages || []
    readMessages.value = res.data?.has_read_messages || []
    messageStore.setUnread(unreadMessages.value.length)
  } catch {
    unreadMessages.value = []
    readMessages.value = []
  } finally {
    loading.value = false
  }
}

async function openMessage(message: MessageItem) {
  try {
    if (!message.has_read) {
      await markMessageRead(message.id)
      message.has_read = true
      unreadMessages.value = unreadMessages.value.filter((item) => item.id !== message.id)
      readMessages.value = [message, ...readMessages.value]
      messageStore.setUnread(unreadMessages.value.length)
    }
  } catch {
    // 标记失败不阻断跳转
  }
  router.push(`/topic/${message.topic.id}`)
}

async function markAllRead() {
  if (!unreadCount.value) return
  markingAll.value = true
  try {
    await markAllMessagesRead()
    const marked = unreadMessages.value.map((item) => ({ ...item, has_read: true }))
    readMessages.value = [...marked, ...readMessages.value]
    unreadMessages.value = []
    messageStore.setUnread(0)
    ElMessage.success('全部消息已标记为已读')
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    markingAll.value = false
  }
}

onMounted(() => {
  void loadMessages()
})
</script>

<template>
  <div class="page-container py-6">
    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-6 text-[#15181b] font-bold">消息中心</h1>
          <el-badge v-if="unreadCount" :value="unreadCount" :max="99" />
        </div>
        <p class="mt-1 text-3 text-[#9aa0a6]">回复、@ 提醒都会出现在这里</p>
      </div>
      <el-button
        :disabled="!unreadCount"
        :icon="Check"
        :loading="markingAll"
        round
        @click="markAllRead"
      >
        全部已读
      </el-button>
    </div>

    <el-skeleton v-if="loading" :rows="9" animated class="card-base p-6" />

    <template v-else>
      <section class="card-base overflow-hidden">
        <div class="flex items-center gap-2 border-b border-[#f2f4f6] px-5 py-3.5">
          <h2 class="text-3.75 text-[#15181b] font-bold">未读消息</h2>
          <span v-if="unreadCount" class="count-pill">{{ unreadCount }}</span>
        </div>

        <EmptyState v-if="!unreadMessages.length" text="没有未读消息" description="所有消息都已读完" />

        <div v-else>
          <div
            v-for="message in unreadMessages"
            :key="message.id"
            class="message-row"
            @click="openMessage(message)"
          >
            <el-avatar :size="38" :src="message.author.avatar_url">
              {{ message.author.loginname.slice(0, 1).toUpperCase() }}
            </el-avatar>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-3.25 text-[#15181b] font-semibold">
                  {{ message.author.loginname }}
                </span>
                <el-tag effect="light" size="small" type="success">
                  {{ MESSAGE_TYPE_LABEL[message.type] || '通知' }}
                </el-tag>
                <span class="text-2.75 text-[#9aa0a6]">
                  {{ formatRelativeTime(message.create_at) }}
                </span>
              </div>
              <div class="mt-1 line-clamp-1 text-3.25 text-[#3d444a] font-medium">
                {{ message.topic.title }}
              </div>
              <div class="mt-0.5 line-clamp-2 text-3 text-[#7b8188]">
                {{ plainText(message.reply.content, 160) }}
              </div>
            </div>
            <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#ff5a5f]" />
          </div>
        </div>
      </section>

      <section class="card-base mt-4 overflow-hidden">
        <div class="flex items-center gap-2 border-b border-[#f2f4f6] px-5 py-3.5">
          <h2 class="text-3.75 text-[#15181b] font-bold">已读消息</h2>
        </div>

        <EmptyState v-if="!readMessages.length" text="暂无已读消息" />

        <div v-else>
          <div
            v-for="message in readMessages"
            :key="message.id"
            class="message-row is-read"
            @click="openMessage(message)"
          >
            <el-avatar :size="38" :src="message.author.avatar_url">
              {{ message.author.loginname.slice(0, 1).toUpperCase() }}
            </el-avatar>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-3.25 text-[#5b636b] font-semibold">
                  {{ message.author.loginname }}
                </span>
                <span class="text-2.75 text-[#9aa0a6]">
                  {{ MESSAGE_TYPE_LABEL[message.type] || '通知' }}
                </span>
                <span class="text-2.75 text-[#9aa0a6]">
                  {{ formatRelativeTime(message.create_at) }}
                </span>
              </div>
              <div class="mt-1 line-clamp-1 text-3.25 text-[#5b636b]">
                {{ message.topic.title }}
              </div>
              <div class="mt-0.5 line-clamp-2 text-3 text-[#9aa0a6]">
                {{ plainText(message.reply.content, 160) }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <div class="mt-4 flex items-center justify-center gap-1 text-2.75 text-[#9aa0a6]">
      <el-icon><Message /></el-icon>
      消息会保留在社区服务器，请及时查看与处理
    </div>
  </div>
</template>

<style scoped lang="scss">
.count-pill {
  padding: 1px 8px;
  font-size: 11px;
  color: #fff;
  background: #ff5a5f;
  border-radius: 999px;
}

.message-row {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f2f4f6;
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafcfb;
  }

  &.is-read {
    opacity: 0.78;
  }
}
</style>
