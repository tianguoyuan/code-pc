<script lang="ts" setup>
import type { Topic, UserDetail } from '@/api/types'

import { Link as LinkIcon, Location, Setting, Star } from '@element-plus/icons-vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { UserTopicsResponse } from '@/api/user'
import { getUserCollections, getUserDetail, getUserReplies, getUserTopics } from '@/api/user'
import EmptyState from '@/components/EmptyState.vue'
import TopicCard from '@/components/TopicCard.vue'
import { IDENTITY_LABEL, PAGE_SIZE } from '@/enums'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/format'

type ListType = 'topics' | 'replies' | 'collections'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loginname = computed(() => String(route.params.loginname || ''))
const detail = ref<UserDetail | null>(null)
const loading = ref(true)
const error = ref('')

const activeTab = ref<ListType>('topics')
const list = ref<Topic[]>([])
const total = ref(0)
const page = ref(1)
const listLoading = ref(true)

const isSelf = computed(() => loginname.value === userStore.loginname)
const identities = computed(() =>
  (detail.value?.identities || []).map((item) => IDENTITY_LABEL[item] || item),
)

async function loadDetail() {
  loading.value = true
  error.value = ''
  try {
    const res = await getUserDetail(loginname.value)
    detail.value = res.data
  } catch (err) {
    detail.value = null
    error.value = err instanceof Error ? err.message : '用户信息加载失败'
  } finally {
    loading.value = false
  }
}

async function loadList() {
  listLoading.value = true
  try {
    const query = { limit: PAGE_SIZE, page: page.value }
    let res: UserTopicsResponse
    if (activeTab.value === 'replies') res = await getUserReplies(loginname.value, query)
    else if (activeTab.value === 'collections')
      res = await getUserCollections(loginname.value, query)
    else res = await getUserTopics(loginname.value, query)

    list.value = res.data || []
    total.value = res.total || 0
  } catch {
    list.value = []
    total.value = 0
  } finally {
    listLoading.value = false
  }
}

function changeTab(value: string | number) {
  activeTab.value = value as ListType
  page.value = 1
  void loadList()
}

function changePage(value: number) {
  page.value = value
  void loadList()
}

watch(loginname, () => {
  activeTab.value = 'topics'
  page.value = 1
  void loadDetail()
  void loadList()
})

onMounted(() => {
  void loadDetail()
  void loadList()
})
</script>

<template>
  <div class="page-container py-6">
    <el-skeleton v-if="loading" :rows="8" animated class="card-base p-6" />

    <el-result v-else-if="!detail" icon="warning" :sub-title="error" title="用户不存在">
      <template #extra>
        <el-button round type="primary" @click="router.push('/')">返回首页</el-button>
      </template>
    </el-result>

    <template v-else>
      <!-- 个人信息 -->
      <section class="card-base overflow-hidden">
        <div class="profile-cover" />
        <div class="relative px-6 pb-6">
          <div class="-mt-10 flex flex-wrap items-end gap-4">
            <el-avatar
              :size="88"
              class="border-4 border-white bg-white shadow-sm"
              :src="detail.avatar_url"
            >
              {{ detail.loginname.slice(0, 1).toUpperCase() }}
            </el-avatar>

            <div class="min-w-0 flex-1 pb-1">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-6 text-[#15181b] font-bold">{{ detail.loginname }}</h1>
                <el-tag
                  v-for="item in identities"
                  :key="item"
                  effect="light"
                  size="small"
                  type="success"
                >
                  {{ item }}
                </el-tag>
                <el-tag v-if="detail.is_block" effect="light" size="small" type="danger">
                  已封禁
                </el-tag>
                <el-tag v-if="detail.is_muted" effect="light" size="small" type="warning">
                  已禁言
                </el-tag>
              </div>

              <p class="mt-1.5 max-w-160 text-3.25 text-[#7b8188] leading-relaxed">
                {{ detail.signature || '这个人很懒，还没有填写个人简介。' }}
              </p>

              <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-2.75 text-[#9aa0a6]">
                <span>加入于 {{ formatDate(detail.create_at, false) }}</span>
                <span v-if="detail.location" class="flex items-center gap-1">
                  <el-icon><Location /></el-icon>
                  {{ detail.location }}
                </span>
                <a
                  v-if="detail.url"
                  class="flex items-center gap-1 text-[#018d71]"
                  :href="detail.url"
                  rel="noreferrer"
                  target="_blank"
                >
                  <el-icon><LinkIcon /></el-icon>
                  个人主页
                </a>
                <a
                  v-if="detail.githubUsername"
                  class="flex items-center gap-1 text-[#018d71]"
                  :href="`https://github.com/${detail.githubUsername}`"
                  rel="noreferrer"
                  target="_blank"
                >
                  <el-icon><Star /></el-icon>
                  GitHub
                </a>
              </div>
            </div>

            <el-button
              v-if="isSelf"
              :icon="Setting"
              round
              type="primary"
              plain
              @click="router.push('/settings')"
            >
              编辑资料
            </el-button>
          </div>

          <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="stat-box">
              <div class="text-5 text-[#15181b] font-bold">{{ detail.score }}</div>
              <div class="text-2.75 text-[#9aa0a6]">社区积分</div>
            </div>
            <div class="stat-box">
              <div class="text-5 text-[#15181b] font-bold">{{ detail.topic_count }}</div>
              <div class="text-2.75 text-[#9aa0a6]">发布话题</div>
            </div>
            <div class="stat-box">
              <div class="text-5 text-[#15181b] font-bold">{{ detail.reply_count }}</div>
              <div class="text-2.75 text-[#9aa0a6]">发表回复</div>
            </div>
            <div class="stat-box">
              <div class="text-5 text-[#15181b] font-bold">{{ detail.collect_topic_count }}</div>
              <div class="text-2.75 text-[#9aa0a6]">收藏话题</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 内容列表 -->
      <section class="card-base mt-4 overflow-hidden">
        <el-tabs :model-value="activeTab" class="px-4 pt-2" @tab-change="changeTab">
          <el-tab-pane label="发布的话题" name="topics" />
          <el-tab-pane label="参与的回复" name="replies" />
          <el-tab-pane label="收藏的话题" name="collections" />
        </el-tabs>

        <el-skeleton v-if="listLoading" :rows="7" animated class="px-5 pb-5" />

        <template v-else>
          <EmptyState v-if="!list.length" text="暂时没有内容" />
          <template v-else>
            <TopicCard
              v-for="topic in list"
              :key="topic.id"
              :show-author="activeTab !== 'topics'"
              :topic="topic"
              excerpt
            />
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
    </template>
  </div>
</template>

<style scoped lang="scss">
.profile-cover {
  height: 108px;
  background:
    radial-gradient(500px 200px at 15% 0%, rgba(255, 255, 255, 0.35), transparent 60%),
    linear-gradient(135deg, #0bb28e 0%, #017a62 60%, #064f43 100%);
}

.stat-box {
  padding: 12px 16px;
  text-align: center;
  background: #f7f9f9;
  border-radius: 12px;

  div:first-child {
    line-height: 1.3;
  }
}
</style>
