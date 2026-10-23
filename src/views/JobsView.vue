<script lang="ts" setup>
import type { JobCard as JobCardType, JobFacets } from '@/api/types'

import { Plus, Search } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getJobFacets, getJobs } from '@/api/zone'
import EmptyState from '@/components/EmptyState.vue'
import JobCard from '@/components/JobCard.vue'
import { JOB_PAGE_SIZE, REMOTE_LABEL, REMOTE_OPTIONS, SALARY_OPTIONS } from '@/enums'

const router = useRouter()

const filters = reactive({
  location: '',
  remote: '',
  salary_min: '',
})

const page = ref(1)
const total = ref(0)
const jobs = ref<JobCardType[]>([])
const loading = ref(true)
const facets = ref<JobFacets>({ locations: [], remote_options: [] })

const remoteOptions = REMOTE_OPTIONS.map((item) => ({
  label: item.label,
  value: item.key,
}))

async function loadFacets() {
  try {
    const res = await getJobFacets({ silent: true })
    facets.value = res.data || { locations: [], remote_options: [] }
  } catch {
    facets.value = { locations: [], remote_options: [] }
  }
}

async function loadJobs() {
  loading.value = true
  try {
    const res = await getJobs({
      limit: JOB_PAGE_SIZE,
      location: filters.location || undefined,
      page: page.value,
      remote: filters.remote || undefined,
      salary_min: filters.salary_min || undefined,
    })
    jobs.value = res.data || []
    total.value = res.total || 0
  } catch {
    jobs.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  page.value = 1
  void loadJobs()
}

function resetFilters() {
  filters.location = ''
  filters.remote = ''
  filters.salary_min = ''
  page.value = 1
  void loadJobs()
}

function changePage(value: number) {
  page.value = value
  void loadJobs()
}

function goCreate() {
  router.push({ path: '/topic/create', query: { tab: 'job' } })
}

onMounted(() => {
  void loadFacets()
  void loadJobs()
})
</script>

<template>
  <div>
    <section class="jobs-hero">
      <div class="page-container py-9">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div class="text-2.75 text-[#017a62] font-semibold tracking-widest">
              CNODE JOBS
            </div>
            <h1 class="mt-2 text-8 text-[#10231e] font-bold">发现心仪的工作</h1>
            <p class="mt-2 text-3.5 text-[#4b625c]">
              Node.js 技术岗位，远程 / 坐班都有，和优秀的团队一起成长。
            </p>
          </div>
          <el-button :icon="Plus" round size="large" type="primary" @click="goCreate">
            发布职位
          </el-button>
        </div>
      </div>
    </section>

    <div class="page-container -mt-4 pb-4">
      <div class="card-base p-4">
        <div class="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <el-select v-model="filters.location" clearable placeholder="工作地点">
            <el-option
              v-for="item in facets.locations"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>

          <el-select v-model="filters.remote" clearable placeholder="办公方式">
            <el-option
              v-for="item in remoteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <el-select v-model="filters.salary_min" clearable placeholder="薪资要求">
            <el-option
              v-for="item in SALARY_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <div class="flex gap-2">
            <el-button :icon="Search" type="primary" @click="applyFilters">筛选</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="page-container pb-4">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-4 text-[#15181b] font-bold">
          职位列表
          <span class="ml-1 text-3 text-[#9aa0a6] font-normal">{{ total }} 个结果</span>
        </h2>
        <el-tag v-if="filters.remote" effect="plain" type="success">
          {{ REMOTE_LABEL[filters.remote] || filters.remote }}
        </el-tag>
      </div>

      <div v-if="loading" class="grid gap-4 md:grid-cols-2">
        <div v-for="index in 4" :key="index" class="card-base p-5">
          <el-skeleton :rows="5" animated />
        </div>
      </div>

      <template v-else>
        <EmptyState
          v-if="!jobs.length"
          description="试试调整筛选条件，或者发布一个职位"
          text="暂无符合条件的职位"
        >
          <el-button round type="primary" @click="goCreate">发布职位</el-button>
        </EmptyState>

        <template v-else>
          <div class="grid gap-4 md:grid-cols-2">
            <JobCard v-for="job in jobs" :key="job.id" :job="job" />
          </div>
          <el-pagination
            :current-page="page"
            :page-size="JOB_PAGE_SIZE"
            :total="total"
            background
            hide-on-single-page
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.jobs-hero {
  background:
    radial-gradient(800px 300px at 20% 0%, rgba(125, 211, 192, 0.3), transparent 65%),
    linear-gradient(180deg, #effaf7 0%, #f4f6f8 100%);
}
</style>
