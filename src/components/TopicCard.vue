<script lang="ts" setup>
import type { Topic } from '@/api/types'

import { ChatDotRound, View } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { TOPIC_TAB_LABEL, TOPIC_TAB_TAG_TYPE } from '@/enums'
import { formatCount, formatRelativeTime, plainText } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    topic: Topic
    /** 是否展示摘要 */
    excerpt?: boolean
    /** 是否展示作者 */
    showAuthor?: boolean
  }>(),
  {
    excerpt: false,
    showAuthor: true,
  },
)

const router = useRouter()

const tabLabel = computed(() => TOPIC_TAB_LABEL[props.topic.tab] || props.topic.tab)
const tagType = computed(() => TOPIC_TAB_TAG_TYPE[props.topic.tab] || 'info')
const summary = computed(() => plainText(props.topic.content, 120))

function goTopic() {
  router.push(`/topic/${props.topic.id}`)
}

function goAuthor(event: Event) {
  event.stopPropagation()
  if (props.topic.author?.loginname) router.push(`/user/${props.topic.author.loginname}`)
}
</script>

<template>
  <article class="topic-item" @click="goTopic">
    <div v-if="topic.top || topic.good" class="mb-1.5 flex gap-1.5">
      <span v-if="topic.top" class="flag flag-top">置顶</span>
      <span v-if="topic.good" class="flag flag-good">精华</span>
    </div>

    <div class="flex items-start gap-2">
      <h3 class="min-w-0 flex-1 text-4 text-[#1c2023] font-semibold leading-snug">
        <span class="topic-title">{{ topic.title }}</span>
      </h3>
      <el-tag v-if="tabLabel" class="mt-0.5 shrink-0" :type="tagType" effect="light" size="small">
        {{ tabLabel }}
      </el-tag>
    </div>

    <p v-if="excerpt && summary" class="mt-2 line-clamp-2 text-3.25 text-[#7b8188] leading-relaxed">
      {{ summary }}
    </p>

    <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-3 text-[#9aa0a6]">
      <div v-if="showAuthor" class="flex items-center gap-1.5" @click="goAuthor">
        <el-avatar :size="22" :src="topic.author?.avatar_url">
          {{ topic.author?.loginname?.slice(0, 1).toUpperCase() }}
        </el-avatar>
        <span class="font-medium text-[#5b636b] hover:text-[#018d71]">
          {{ topic.author?.loginname }}
        </span>
      </div>
      <span>{{ formatRelativeTime(topic.create_at) }}</span>
      <span class="ml-auto flex items-center gap-3">
        <span class="flex items-center gap-1">
          <el-icon><ChatDotRound /></el-icon>
          {{ formatCount(topic.reply_count) }}
        </span>
        <span class="flex items-center gap-1">
          <el-icon><View /></el-icon>
          {{ formatCount(topic.visit_count) }}
        </span>
      </span>
    </div>
  </article>
</template>

<style scoped lang="scss">
.topic-item {
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f2f4f6;
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafcfb;

    .topic-title {
      color: #018d71;
    }
  }
}

.topic-title {
  transition: color 0.15s ease;
}

.flag {
  padding: 1px 7px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 5px;
}

.flag-top {
  color: #b45309;
  background: #fef3c7;
}

.flag-good {
  color: #b91c1c;
  background: #fee2e2;
}
</style>
