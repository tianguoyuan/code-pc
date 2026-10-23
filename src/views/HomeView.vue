<script lang="ts" setup>
import type { SidebarHome, TabInfo, Topic, TopicTab } from '@/api/types'

import { ChatDotRound, Refresh, Right } from '@element-plus/icons-vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getSidebarHome, getTabs, getTopics } from '@/api'
import EmptyState from '@/components/EmptyState.vue'
import TopicCard from '@/components/TopicCard.vue'
import { PAGE_SIZE, TOPIC_TABS } from '@/enums'
import { formatRelativeTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const activeTab = computed<TopicTab>(() => {
  const tab = route.query.tab
  return typeof tab === 'string' && tab ? (tab as TopicTab) : 'all'
})
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const tabs = ref<TabInfo[]>([])
const topics = ref<Topic[]>([])
const total = ref(0)
const loading = ref(true)
const sidebar = ref<SidebarHome | null>(null)
const sidebarLoading = ref(true)

const tabOptions = computed(() => {
  const publicTabs = tabs.value
    .filter((item) => item.visible !== false && item.scope !== 'admin')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({ key: item.key, label: item.label }))
  return publicTabs.length ? publicTabs : TOPIC_TABS.map((item) => ({ ...item }))
})

async function loadTabs() {
  try {
    const res = await getTabs({ silent: true })
    tabs.value = res.data || []
  } catch {
    tabs.value = []
  }
}

async function loadTopics() {
  loading.value = true
  try {
    const res = await getTopics({ limit: PAGE_SIZE, page: page.value, tab: activeTab.value })
    topics.value = res.data || []
    total.value = res.total || 0
  } catch {
    topics.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function loadSidebar() {
  sidebarLoading.value = true
  try {
    const res = await getSidebarHome()
    sidebar.value = res.data
  } catch {
    sidebar.value = null
  } finally {
    sidebarLoading.value = false
  }
}

function changeTab(key: string) {
  if (key === activeTab.value) return
  router.push({ path: '/', query: key === 'all' ? {} : { tab: key } })
}

function changePage(value: number) {
  router.push({ path: '/', query: { ...route.query, page: value === 1 ? undefined : value } })
}

function goCreate() {
  router.push('/topic/create')
}

watch(
  () => [route.query.tab, route.query.page],
  () => {
    void loadTopics()
  },
)

onMounted(() => {
  void loadTabs()
  void loadSidebar()
  void loadTopics()
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="page-container relative z-1 py-12">
        <div class="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div class="hero-badge">NODE.JS 中文技术社区</div>
            <h1 class="mt-4 text-9 text-[#10231e] font-bold leading-tight">
              在这里，和 Node.js 开发者
              <span class="hero-highlight">一起成长</span>
            </h1>
            <p class="mt-4 max-w-140 text-3.75 text-[#4b625c] leading-relaxed">
              分享技术经验、讨论疑难问题、发现优质工作机会。CNode 社区汇聚了大量
              Node.js 开发者，一起交流、一起创造。
            </p>
            <div class="mt-7 flex flex-wrap items-center gap-3">
              <el-button round size="large" type="primary" @click="goCreate">
                发布话题
                <el-icon class="ml-1"><Right /></el-icon>
              </el-button>
              <el-button round size="large" @click="router.push('/jobs')">浏览招聘专区</el-button>
            </div>
          </div>

          <div class="hero-code">
            <div class="mb-3 flex items-center gap-1.5">
              <span class="dot bg-[#ff5f57]" />
              <span class="dot bg-[#febc2e]" />
              <span class="dot bg-[#28c840]" />
              <span class="ml-2 text-2.75 text-[#8ea39c]">cnode.js</span>
            </div>
            <pre class="m-0 text-3.25 leading-relaxed"><code><span class="text-[#7dd3c0]">const</span> community = <span class="text-[#7dd3c0]">await</span> CNode.<span class="text-[#93c5fd]">connect</span>({
  topic: <span class="text-[#fde68a]">'Node.js'</span>,
  people: <span class="text-[#fde68a]">'developers'</span>,
  spirit: <span class="text-[#fde68a]">'share & learn'</span>
})

community.<span class="text-[#93c5fd]">welcome</span>(<span class="text-[#7dd3c0]">you</span>)</code></pre>
          </div>
        </div>
      </div>
      <span class="hero-blob hero-blob-1" />
      <span class="hero-blob hero-blob-2" />
    </section>

    <!-- Main -->
    <div class="page-container grid items-start gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section class="card-base overflow-hidden">
        <div class="flex items-center gap-2 border-b border-[#f2f4f6] px-4 py-3">
          <div class="min-w-0 flex-1 flex flex-wrap items-center gap-1">
            <button
              v-for="item in tabOptions"
              :key="item.key"
              class="tab-pill"
              :class="{ 'is-active': activeTab === item.key }"
              type="button"
              @click="changeTab(item.key)"
            >
              {{ item.label }}
            </button>
          </div>
          <el-tooltip content="刷新" placement="top">
            <el-button :icon="Refresh" circle text @click="loadTopics" />
          </el-tooltip>
        </div>

        <el-skeleton v-if="loading" :rows="7" animated class="px-5 py-5" />

        <template v-else>
          <EmptyState
            v-if="!topics.length"
            description="换个分类看看，或者发布第一个话题"
            text="这里还没有话题"
          >
            <el-button round type="primary" @click="goCreate">发布话题</el-button>
          </EmptyState>

          <template v-else>
            <TopicCard v-for="topic in topics" :key="topic.id" :topic="topic" excerpt />
            <div class="border-t border-[#f2f4f6] px-4">
              <el-pagination
                :current-page="page"
                :page-size="PAGE_SIZE"
                :total="total"
                background
                hide-on-single-page
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </div>
          </template>
        </template>
      </section>

      <!-- Sidebar -->
      <aside class="space-y-4">
        <el-skeleton v-if="sidebarLoading" :rows="8" animated class="card-base p-5" />

        <template v-else-if="sidebar">
          <section v-if="sidebar.latest_replies.length" class="card-base p-4.5">
            <h2 class="sidebar-title">最新回复</h2>
            <div class="mt-2 space-y-3">
              <RouterLink
                v-for="item in sidebar.latest_replies.slice(0, 6)"
                :key="item.id"
                class="sidebar-link group block"
                :to="`/topic/${item.topic_id}`"
              >
                <div class="line-clamp-1 text-3.25 text-[#3d444a] font-medium group-hover:text-[#018d71]">
                  {{ item.topic_title }}
                </div>
                <div class="mt-0.5 flex items-center gap-1.5 text-2.75 text-[#9aa0a6]">
                  <el-avatar :size="16" :src="item.author.avatar_url" />
                  <span>{{ item.author.loginname }}</span>
                  <span>·</span>
                  <span>{{ formatRelativeTime(item.create_at) }}</span>
                </div>
              </RouterLink>
            </div>
          </section>

          <section v-if="sidebar.no_reply_topics.length" class="card-base p-4.5">
            <h2 class="sidebar-title">等待回答</h2>
            <div class="mt-2 space-y-2.5">
              <RouterLink
                v-for="item in sidebar.no_reply_topics.slice(0, 6)"
                :key="item.id"
                class="flex items-start gap-2 text-3.25 text-[#3d444a] hover:text-[#018d71]"
                :to="`/topic/${item.id}`"
              >
                <el-icon class="mt-1 shrink-0 text-[#c4c9ce]"><ChatDotRound /></el-icon>
                <span class="line-clamp-2">{{ item.title }}</span>
              </RouterLink>
            </div>
          </section>

          <section v-if="sidebar.top_users.length" class="card-base p-4.5">
            <h2 class="sidebar-title">积分榜</h2>
            <div class="mt-2 space-y-2">
              <RouterLink
                v-for="(user, index) in sidebar.top_users.slice(0, 8)"
                :key="user.id"
                class="flex items-center gap-2.5 rounded-2 px-1 py-1.5 hover:bg-[#f7faf9]"
                :to="`/user/${user.loginname}`"
              >
                <span
                  class="w-5 flex-shrink-0 text-center text-2.75 font-bold"
                  :class="index < 3 ? 'text-[#018d71]' : 'text-[#b0b6bc]'"
                >
                  {{ index + 1 }}
                </span>
                <el-avatar :size="24" :src="user.avatar_url" />
                <span class="min-w-0 flex-1 truncate text-3 text-[#3d444a]">
                  {{ user.loginname }}
                </span>
                <span class="text-2.75 text-[#9aa0a6]">{{ user.score }}</span>
              </RouterLink>
            </div>
          </section>

          <section v-if="sidebar.resources.length" class="card-base p-4.5">
            <h2 class="sidebar-title">社区资源</h2>
            <div class="mt-2 flex flex-wrap gap-2">
              <a
                v-for="item in sidebar.resources"
                :key="item.name"
                class="resource-link"
                :href="item.url"
                rel="noreferrer"
                target="_blank"
              >
                {{ item.name }}
              </a>
            </div>
          </section>

          <section v-if="sidebar.partners.length" class="card-base p-4.5">
            <h2 class="sidebar-title">合作伙伴</h2>
            <div class="mt-2 space-y-2">
              <a
                v-for="item in sidebar.partners"
                :key="item.name"
                class="block rounded-2 px-1 py-1 hover:bg-[#f7faf9]"
                :href="item.url"
                rel="noreferrer"
                target="_blank"
              >
                <div class="text-3 text-[#3d444a] font-medium">{{ item.name }}</div>
                <div class="line-clamp-1 text-2.75 text-[#9aa0a6]">{{ item.description }}</div>
              </a>
            </div>
          </section>
        </template>

        <section class="card-base overflow-hidden">
          <div class="bg-[linear-gradient(135deg,#e8f8f5,#f6fffd)] px-5 py-4">
            <div class="text-3.5 text-[#10231e] font-bold">加入 CNode 社区</div>
            <p class="mt-1 text-3 text-[#5b7770] leading-relaxed">
              和众多 Node.js 开发者一起交流技术、分享经验。
            </p>
            <el-button class="mt-3" round size="small" type="primary" @click="router.push('/signup')">
              免费注册
            </el-button>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(900px 380px at 15% 0%, rgba(125, 211, 192, 0.28), transparent 60%),
    linear-gradient(180deg, #f0fbf8 0%, #f7faf9 60%, #f4f6f8 100%);
}

.hero-badge {
  display: inline-flex;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
  color: #017a62;
  letter-spacing: 1.5px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(1, 141, 113, 0.18);
  border-radius: 999px;
  backdrop-filter: blur(6px);
}

.hero-highlight {
  color: #018d71;
  background: linear-gradient(transparent 62%, rgba(1, 141, 113, 0.16) 62%);
}

.hero-code {
  padding: 18px 20px;
  overflow: hidden;
  background: #10231e;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  box-shadow: 0 24px 48px -28px rgba(6, 63, 55, 0.65);

  pre {
    overflow-x: auto;
    color: #d7e5e0;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  }
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
}

.hero-blob-1 {
  top: -80px;
  right: 8%;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(125, 211, 192, 0.3), transparent 68%);
}

.hero-blob-2 {
  bottom: -120px;
  left: -60px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(147, 197, 253, 0.22), transparent 68%);
}

.tab-pill {
  padding: 6px 12px;
  font-size: 13px;
  color: #6b7278;
  cursor: pointer;
  background: transparent;
  border: none;
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
    color: #fff;
    background: linear-gradient(135deg, #0bb28e, #017a62);
    box-shadow: 0 6px 14px -8px rgba(1, 141, 113, 0.9);
  }
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #15181b;

  &::before {
    width: 3px;
    height: 14px;
    content: '';
    background: linear-gradient(180deg, #0bb28e, #017a62);
    border-radius: 3px;
  }
}

.resource-link {
  padding: 4px 10px;
  font-size: 12px;
  color: #5b636b;
  background: #f5f6f7;
  border-radius: 6px;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: #017a62;
    background: #e8f8f5;
  }
}
</style>
