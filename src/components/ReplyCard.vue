<script lang="ts" setup>
import type { Reply } from '@/api/types'

import { CaretTop, ChatLineRound, Delete, Edit, MoreFilled, Warning } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { formatRelativeTime, plainText } from '@/utils/format'
import { sanitizeHtml } from '@/utils/html'

const props = withDefaults(
  defineProps<{
    reply: Reply
    floor?: number
    /** 当前用户是否可编辑 / 删除 */
    editable?: boolean
    /** 是否已登录（未登录时点赞/回复引导登录） */
    loggedIn?: boolean
  }>(),
  {
    editable: false,
    floor: 0,
    loggedIn: false,
  },
)

const emit = defineEmits<{
  (e: 'delete', reply: Reply): void
  (e: 'edit', reply: Reply): void
  (e: 'reply', reply: Reply): void
  (e: 'report', reply: Reply): void
  (e: 'up', reply: Reply): void
}>()

const router = useRouter()

const upsCount = computed(() => props.reply.ups?.length || 0)
const quoted = computed(() => plainText(props.reply.reply_to?.content_excerpt, 140))

function goAuthor() {
  const loginname = props.reply.author?.loginname
  if (loginname) router.push(`/user/${loginname}`)
}
</script>

<template>
  <article :id="`reply-${reply.id}`" class="reply-item">
    <div class="flex gap-3">
      <el-avatar
        :size="36"
        class="shrink-0 cursor-pointer"
        :src="reply.author?.avatar_url"
        @click="goAuthor"
      >
        {{ reply.author?.loginname?.slice(0, 1).toUpperCase() }}
      </el-avatar>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            class="cursor-pointer text-3.25 text-[#5b636b] font-semibold hover:text-[#018d71]"
            @click="goAuthor"
          >
            {{ reply.author?.loginname }}
          </span>
          <span v-if="floor" class="text-2.75 text-[#b0b6bc]">#{{ floor }}</span>
          <span class="text-2.75 text-[#9aa0a6]">{{ formatRelativeTime(reply.create_at) }}</span>
          <el-tag v-if="reply.is_uped" effect="plain" size="small" type="success">已赞</el-tag>
        </div>

        <div v-if="reply.reply_to" class="mt-2 rounded-2 bg-[#f7f8f9] px-3 py-2 text-3 text-[#7b8188]">
          <span class="font-medium text-[#5b636b]">@{{ reply.reply_to.author?.loginname }}</span>
          <span class="ml-1">{{ quoted }}</span>
        </div>

        <div class="markdown-body is-compact mt-2" v-html="sanitizeHtml(reply.content)" />

        <div class="mt-2 flex items-center gap-1">
          <button
            class="action-btn"
            :class="{ 'is-active': reply.is_uped }"
            type="button"
            @click="emit('up', reply)"
          >
            <el-icon><CaretTop /></el-icon>
            <span>{{ upsCount || '赞' }}</span>
          </button>
          <button class="action-btn" type="button" @click="emit('reply', reply)">
            <el-icon><ChatLineRound /></el-icon>
            <span>回复</span>
          </button>

          <el-dropdown trigger="click">
            <button class="action-btn" type="button">
              <el-icon><MoreFilled /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <template v-if="editable">
                  <el-dropdown-item :icon="Edit" @click="emit('edit', reply)">编辑</el-dropdown-item>
                  <el-dropdown-item :icon="Delete" @click="emit('delete', reply)">
                    删除
                  </el-dropdown-item>
                </template>
                <el-dropdown-item :icon="Warning" @click="emit('report', reply)">
                  举报
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.reply-item {
  padding: 18px 0;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.action-btn {
  display: inline-flex;
  height: 26px;
  padding: 0 8px;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9aa0a6;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 6px;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: #018d71;
    background: #eef8f5;
  }

  &.is-active {
    color: #018d71;
    background: #e8f8f5;
  }
}
</style>
