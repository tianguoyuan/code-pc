<script lang="ts" setup>
import type { UserBrief } from '@/api/types'

import { Medal } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'

import { getStarUsers, getTop100Users } from '@/api/user'

const active = ref<'top' | 'stars'>('top')
const users = ref<UserBrief[]>([])
const loading = ref(true)

async function loadUsers() {
  loading.value = true
  try {
    const res = active.value === 'top' ? await getTop100Users() : await getStarUsers()
    users.value = res.data || []
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

function changeTab(value: string | number) {
  active.value = value as 'top' | 'stars'
  void loadUsers()
}

function medalClass(index: number) {
  return index === 0 ? 'is-gold' : index === 1 ? 'is-silver' : index === 2 ? 'is-bronze' : ''
}

onMounted(() => {
  void loadUsers()
})
</script>

<template>
  <div>
    <section class="rank-hero">
      <div class="page-container py-10">
        <div class="text-2.75 text-[#017a62] font-semibold tracking-widest">COMMUNITY RANK</div>
        <h1 class="mt-2 text-8 text-[#10231e] font-bold">社区榜单</h1>
        <p class="mt-2 max-w-150 text-3.5 text-[#4b625c]">
          向活跃的社区成员学习。积分来自发布话题、回复和获得的点赞。
        </p>
      </div>
    </section>

    <div class="page-container pb-6">
      <el-tabs :model-value="active" class="rank-tabs" @tab-change="changeTab">
        <el-tab-pane label="积分 Top 100" name="top" />
        <el-tab-pane label="星标用户" name="stars" />
      </el-tabs>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="index in 8" :key="index" class="card-base p-5">
          <el-skeleton :rows="3" animated />
        </div>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <RouterLink
          v-for="(user, index) in users"
          :key="user.id"
          class="user-card"
          :class="medalClass(index)"
          :to="`/user/${user.loginname}`"
        >
          <div class="flex items-center gap-3">
            <el-avatar :size="46" :src="user.avatar_url">
              {{ user.loginname.slice(0, 1).toUpperCase() }}
            </el-avatar>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <span class="truncate text-3.5 text-[#15181b] font-semibold">
                  {{ user.loginname }}
                </span>
                <el-icon v-if="index < 3" class="shrink-0 text-[#d9a406]">
                  <Medal />
                </el-icon>
                <el-tag v-if="user.is_star" effect="light" size="small" type="warning">星标</el-tag>
              </div>
              <div class="mt-0.5 text-2.75 text-[#9aa0a6]">
                积分 <span class="text-[#018d71] font-semibold">{{ user.score }}</span>
              </div>
            </div>
            <span v-if="index < 3" class="rank-badge">{{ index + 1 }}</span>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-2 border-t border-[#f2f4f6] pt-3 text-center">
            <div>
              <div class="text-3.25 text-[#15181b] font-bold">{{ user.topic_count }}</div>
              <div class="text-2.5 text-[#9aa0a6]">话题</div>
            </div>
            <div>
              <div class="text-3.25 text-[#15181b] font-bold">{{ user.reply_count }}</div>
              <div class="text-2.5 text-[#9aa0a6]">回复</div>
            </div>
          </div>
        </RouterLink>
      </div>

      <el-empty v-if="!loading && !users.length" description="暂无榜单数据" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.rank-hero {
  background:
    radial-gradient(700px 280px at 18% 0%, rgba(253, 230, 138, 0.18), transparent 60%),
    radial-gradient(800px 300px at 60% 0%, rgba(125, 211, 192, 0.26), transparent 60%),
    linear-gradient(180deg, #f1fbf8 0%, #f4f6f8 100%);
}

.rank-tabs {
  margin-bottom: 16px;

  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
}

.user-card {
  padding: 16px;
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

  &.is-gold {
    border-color: #f3d489;
    background: linear-gradient(180deg, #fffdf5 0%, #fff 55%);
  }

  &.is-silver {
    border-color: #dfe4e8;
    background: linear-gradient(180deg, #fbfcfd 0%, #fff 55%);
  }

  &.is-bronze {
    border-color: #efd3b8;
    background: linear-gradient(180deg, #fffaf5 0%, #fff 55%);
  }
}

.rank-badge {
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: #d9a406;
  border-radius: 50%;
}
</style>
