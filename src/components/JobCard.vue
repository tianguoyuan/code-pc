<script lang="ts" setup>
import type { JobCard } from '@/api/types'

import { ChatDotRound, Location, View } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { REMOTE_LABEL } from '@/enums'
import { formatCount, formatRelativeTime, formatSalary } from '@/utils/format'

const props = defineProps<{ job: JobCard }>()

const router = useRouter()
const remoteLabel = computed(() => REMOTE_LABEL[props.job.remote] || props.job.remote)

function goDetail() {
  router.push(`/topic/${props.job.id}`)
}
</script>

<template>
  <article class="job-card" @click="goDetail">
    <div class="flex items-start gap-3">
      <el-avatar :size="46" shape="square" :src="job.company_logo || undefined" class="shrink-0">
        {{ job.company.slice(0, 1) }}
      </el-avatar>
      <div class="min-w-0 flex-1">
        <div class="flex items-start gap-2">
          <h3 class="min-w-0 flex-1 truncate text-3.5 text-[#1c2023] font-semibold">
            {{ job.title }}
          </h3>
          <span class="shrink-0 text-3.5 text-[#018d71] font-bold">
            {{ formatSalary(job.salary_min, job.salary_max) }}
          </span>
        </div>
        <div class="mt-1 text-3 text-[#5b636b]">
          {{ job.company }}
          <span class="mx-1 text-[#d5d9de]">|</span>
          {{ job.position }}
        </div>
      </div>
    </div>

    <p class="mt-3 line-clamp-2 text-3 text-[#7b8188] leading-relaxed">
      {{ job.excerpt }}
    </p>

    <div class="mt-3 flex flex-wrap items-center gap-1.5">
      <span class="chip">
        <el-icon class="mr-0.5"><Location /></el-icon>
        {{ job.location }}
      </span>
      <span class="chip">{{ remoteLabel }}</span>
      <span v-if="job.experience" class="chip">{{ job.experience }}</span>
      <span v-for="tag in job.tech_tags.slice(0, 3)" :key="tag" class="chip chip-brand">
        {{ tag }}
      </span>
    </div>

    <div class="mt-3 flex items-center gap-3 text-2.75 text-[#9aa0a6]">
      <span>{{ formatRelativeTime(job.create_at) }}</span>
      <span class="flex items-center gap-1">
        <el-icon><ChatDotRound /></el-icon>
        {{ formatCount(job.reply_count) }}
      </span>
      <span class="flex items-center gap-1">
        <el-icon><View /></el-icon>
        {{ formatCount(job.visit_count) }}
      </span>
    </div>
  </article>
</template>

<style scoped lang="scss">
.job-card {
  padding: 18px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #eef0f2;
  border-radius: 14px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    border-color: #cbe9e4;
    box-shadow: 0 12px 30px -18px rgba(1, 141, 113, 0.45);
    transform: translateY(-2px);
  }
}

.chip {
  display: inline-flex;
  padding: 2px 8px;
  align-items: center;
  font-size: 12px;
  color: #5b636b;
  background: #f5f6f7;
  border-radius: 6px;
}

.chip-brand {
  color: #017a62;
  background: #eaf7f5;
}
</style>
