<script lang="ts" setup>
import type { Reply, TopicDetail } from '@/api/types'

import {
  ArrowLeft,
  ChatDotRound,
  Edit,
  Link,
  Star,
  View,
  Warning,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { createReport } from '@/api/admin'
import { collectTopic, deCollectTopic } from '@/api/collection'
import { deleteReply, editReply, getReplyDetail, toggleReplyUp } from '@/api/reply'
import { createReply, getTopicDetail } from '@/api/topic'
import EmptyState from '@/components/EmptyState.vue'
import ReplyCard from '@/components/ReplyCard.vue'
import {
  REMOTE_LABEL,
  REPORT_TYPES,
  TOPIC_TAB_LABEL,
  TOPIC_TAB_TAG_TYPE,
} from '@/enums'
import { useUserStore } from '@/stores/user'
import { formatDate, formatRelativeTime, formatSalary } from '@/utils/format'
import { sanitizeHtml } from '@/utils/html'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const topicId = computed(() => String(route.params.id || ''))
const detail = ref<TopicDetail | null>(null)
const loading = ref(true)
const error = ref('')

const replyContent = ref('')
const replyTo = ref<Reply | null>(null)
const submitting = ref(false)
const replyBoxRef = ref<HTMLElement>()

const editVisible = ref(false)
const editContent = ref('')
const editingReply = ref<Reply | null>(null)
const editSubmitting = ref(false)

const reportVisible = ref(false)
const reportSubmitting = ref(false)
const reportTarget = ref<{ id: string; type: 'topic' | 'reply' } | null>(null)
const reportForm = ref({ description: '', type: 'spam' })

const tabLabel = computed(() =>
  detail.value ? TOPIC_TAB_LABEL[detail.value.tab] || detail.value.tab : '',
)
const tabType = computed(() =>
  detail.value ? TOPIC_TAB_TAG_TYPE[detail.value.tab] || 'info' : 'info',
)
const job = computed(() => detail.value?.job_meta || null)
const remoteLabel = computed(() => (job.value ? REMOTE_LABEL[job.value.remote] || job.value.remote : ''))
const isMuted = computed(() => userStore.userInfo?.is_muted)
const canEditTopic = computed(
  () => !!detail.value && detail.value.author.loginname === userStore.loginname,
)
const replyPlaceholder = computed(() =>
  replyTo.value ? `回复 @${replyTo.value.author.loginname}：` : '写下你的回复，支持 Markdown...',
)

function ensureLogin() {
  if (userStore.isLogin) return true
  router.push({ path: '/login', query: { redirect: route.fullPath } })
  return false
}

async function loadDetail() {
  loading.value = true
  error.value = ''
  try {
    const res = await getTopicDetail(topicId.value)
    detail.value = res.data
  } catch (err) {
    detail.value = null
    error.value = err instanceof Error ? err.message : '话题加载失败'
  } finally {
    loading.value = false
  }
}

async function toggleCollect() {
  if (!ensureLogin() || !detail.value) return
  const current = detail.value
  try {
    if (current.is_collect) {
      await deCollectTopic(current.id)
      current.is_collect = false
      current.collect_count = Math.max(0, (current.collect_count || 1) - 1)
      ElMessage.success('已取消收藏')
    } else {
      await collectTopic(current.id)
      current.is_collect = true
      current.collect_count = (current.collect_count || 0) + 1
      ElMessage.success('收藏成功')
    }
  } catch {
    // 错误提示由请求层统一处理
  }
}

async function copyLink() {
  const link = window.location.href
  try {
    await navigator.clipboard.writeText(link)
    ElMessage.success('链接已复制')
  } catch {
    ElMessage.info(link)
  }
}

function startReply(reply?: Reply) {
  if (!ensureLogin()) return
  replyTo.value = reply || null
  nextTick(() => {
    replyBoxRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

function cancelReplyTo() {
  replyTo.value = null
}

async function submitReply() {
  if (!ensureLogin() || !detail.value) return
  if (!replyContent.value.trim()) {
    ElMessage.warning('回复内容不能为空')
    return
  }

  submitting.value = true
  try {
    await createReply(detail.value.id, {
      content: replyContent.value,
      reply_id: replyTo.value?.id,
    })
    replyContent.value = ''
    replyTo.value = null
    ElMessage.success('回复成功')
    await loadDetail()
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    submitting.value = false
  }
}

async function upReply(reply: Reply) {
  if (!ensureLogin()) return
  try {
    const res = await toggleReplyUp(reply.id)
    if (res.action === 'up') {
      reply.is_uped = true
      if (!reply.ups.includes(userStore.loginname)) reply.ups.push(userStore.loginname)
    } else {
      reply.is_uped = false
      reply.ups = reply.ups.filter((name) => name !== userStore.loginname)
    }
  } catch {
    // 错误提示由请求层统一处理
  }
}

async function removeReply(reply: Reply) {
  try {
    await ElMessageBox.confirm('删除后不可恢复，确定删除这条回复吗？', '删除回复', {
      cancelButtonText: '取消',
      confirmButtonText: '删除',
      type: 'warning',
    })
  } catch {
    return
  }

  try {
    await deleteReply(reply.id)
    if (detail.value) {
      detail.value.replies = detail.value.replies.filter((item) => item.id !== reply.id)
      detail.value.reply_count = Math.max(0, detail.value.reply_count - 1)
    }
    ElMessage.success('回复已删除')
  } catch {
    // 错误提示由请求层统一处理
  }
}

async function openEdit(reply: Reply) {
  try {
    const res = await getReplyDetail(reply.id)
    editingReply.value = reply
    editContent.value = res.data.content
    editVisible.value = true
  } catch {
    // 错误提示由请求层统一处理
  }
}

async function saveEdit() {
  if (!editingReply.value) return
  if (!editContent.value.trim()) {
    ElMessage.warning('回复内容不能为空')
    return
  }

  editSubmitting.value = true
  try {
    await editReply(editingReply.value.id, editContent.value)
    editVisible.value = false
    editingReply.value = null
    ElMessage.success('修改成功')
    await loadDetail()
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    editSubmitting.value = false
  }
}

function openReport(type: 'topic' | 'reply', id: string) {
  if (!ensureLogin()) return
  reportTarget.value = { id, type }
  reportForm.value = { description: '', type: 'spam' }
  reportVisible.value = true
}

async function submitReport() {
  if (!reportTarget.value) return
  reportSubmitting.value = true
  try {
    await createReport({
      description: reportForm.value.description.trim() || undefined,
      targetId: Number(reportTarget.value.id),
      targetType: reportTarget.value.type,
      type: reportForm.value.type,
    })
    reportVisible.value = false
    ElMessage.success('举报已提交，感谢你的反馈')
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    reportSubmitting.value = false
  }
}

watch(
  topicId,
  () => {
    void loadDetail()
  },
  { immediate: true },
)
</script>

<template>
  <div class="page-container py-6">
    <div class="mb-3 flex items-center gap-3 text-3">
      <button class="back-link" type="button" @click="router.push('/')">
        <el-icon><ArrowLeft /></el-icon>
        返回话题列表
      </button>
    </div>

    <el-skeleton v-if="loading" :rows="12" animated class="card-base p-6" />

    <el-result
      v-else-if="!detail"
      icon="warning"
      :sub-title="error || '话题可能已被删除或不存在'"
      title="话题不存在"
    >
      <template #extra>
        <el-button round type="primary" @click="router.push('/')">返回首页</el-button>
      </template>
    </el-result>

    <div v-else class="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div class="space-y-4">
        <!-- 话题正文 -->
        <article class="card-base p-6">
          <div class="flex flex-wrap items-center gap-2">
            <span v-if="detail.top" class="flag flag-top">置顶</span>
            <span v-if="detail.good" class="flag flag-good">精华</span>
            <el-tag v-if="tabLabel" :type="tabType" effect="light" size="small">
              {{ tabLabel }}
            </el-tag>
          </div>

          <h1 class="mt-3 text-7 text-[#15181b] font-bold leading-snug">{{ detail.title }}</h1>

          <div class="mt-4 flex flex-wrap items-center gap-3 border-b border-[#f2f4f6] pb-4">
            <RouterLink class="flex items-center gap-2" :to="`/user/${detail.author.loginname}`">
              <el-avatar :size="32" :src="detail.author.avatar_url" />
              <span class="text-3.25 text-[#5b636b] font-medium hover:text-[#018d71]">
                {{ detail.author.loginname }}
              </span>
            </RouterLink>
            <span class="text-2.75 text-[#9aa0a6]">
              发布于 {{ formatDate(detail.create_at) }}
            </span>
            <span class="ml-auto flex items-center gap-4 text-2.75 text-[#9aa0a6]">
              <span class="flex items-center gap-1">
                <el-icon><View /></el-icon>
                {{ detail.visit_count }}
              </span>
              <span class="flex items-center gap-1">
                <el-icon><ChatDotRound /></el-icon>
                {{ detail.reply_count }}
              </span>
            </span>
          </div>

          <div class="markdown-body mt-5" v-html="sanitizeHtml(detail.content)" />

          <!-- 招聘信息 -->
          <div v-if="job" class="mt-5 rounded-3 border border-[#e3f2ee] bg-[#f7fdfb] p-4">
            <div class="flex flex-wrap items-center gap-2">
              <el-avatar :size="38" shape="square" :src="job.company_logo || undefined">
                {{ job.company.slice(0, 1) }}
              </el-avatar>
              <div class="min-w-0 flex-1">
                <div class="text-3.5 text-[#15181b] font-semibold">{{ job.company }}</div>
                <div class="text-3 text-[#5b636b]">{{ job.position }}</div>
              </div>
              <span class="text-3.5 text-[#018d71] font-bold">
                {{ formatSalary(job.salary_min, job.salary_max) }}
              </span>
            </div>
            <div class="mt-3 flex flex-wrap gap-2 text-2.75">
              <span class="job-chip">{{ job.location }}</span>
              <span class="job-chip">{{ remoteLabel }}</span>
              <span v-if="job.experience" class="job-chip">{{ job.experience }}</span>
              <span v-for="tag in job.tech_tags || []" :key="tag" class="job-chip is-brand">
                {{ tag }}
              </span>
            </div>
            <div v-if="job.contact" class="mt-3 text-3 text-[#5b636b]">
              联系方式：<span class="text-[#15181b]">{{ job.contact }}</span>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-2 border-t border-[#f2f4f6] pt-4">
            <el-button
              :icon="Star"
              :type="detail.is_collect ? 'primary' : 'default'"
              round
              @click="toggleCollect"
            >
              {{ detail.is_collect ? '已收藏' : '收藏' }}
              <span v-if="detail.collect_count" class="ml-1">({{ detail.collect_count }})</span>
            </el-button>
            <el-button :icon="Link" round @click="copyLink">复制链接</el-button>
            <el-button :icon="Warning" round text @click="openReport('topic', detail.id)">
              举报
            </el-button>
            <el-button
              v-if="canEditTopic"
              class="ml-auto"
              :icon="Edit"
              round
              type="primary"
              plain
              @click="router.push(`/topic/${detail.id}/edit`)"
            >
              编辑话题
            </el-button>
          </div>
        </article>

        <!-- 回复列表 -->
        <section class="card-base px-6 py-5">
          <div class="mb-1 flex items-center justify-between">
            <h2 class="text-4 text-[#15181b] font-bold">
              全部回复
              <span class="ml-1 text-3.5 text-[#9aa0a6] font-normal">{{ detail.replies.length }}</span>
            </h2>
          </div>

          <EmptyState
            v-if="!detail.replies.length"
            description="成为第一个回复的人"
            text="还没有回复"
          />

          <template v-else>
            <ReplyCard
              v-for="(reply, index) in detail.replies"
              :key="reply.id"
              :editable="reply.author.loginname === userStore.loginname"
              :floor="index + 1"
              :logged-in="userStore.isLogin"
              :reply="reply"
              @delete="removeReply"
              @edit="openEdit"
              @reply="startReply"
              @report="(item) => openReport('reply', item.id)"
              @up="upReply"
            />
          </template>

          <!-- 回复编辑区 -->
          <div ref="replyBoxRef" class="mt-6 rounded-3 bg-[#f7f9f9] p-4">
            <template v-if="!userStore.isLogin">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <span class="text-3.25 text-[#5b636b]">登录后即可参与回复</span>
                <el-button
                  round
                  type="primary"
                  @click="router.push({ path: '/login', query: { redirect: route.fullPath } })"
                >
                  去登录
                </el-button>
              </div>
            </template>

            <template v-else>
              <div v-if="isMuted" class="mb-2">
                <el-alert :closable="false" show-icon title="你当前已被禁言，暂时无法回复" type="warning" />
              </div>

              <div v-if="replyTo" class="mb-2 flex items-center gap-2 text-3 text-[#5b636b]">
                <span>回复 @{{ replyTo.author.loginname }}</span>
                <el-button link type="primary" @click="cancelReplyTo">取消</el-button>
              </div>

              <el-input
                v-model="replyContent"
                :disabled="isMuted"
                :placeholder="replyPlaceholder"
                :rows="4"
                maxlength="10000"
                show-word-limit
                type="textarea"
              />
              <div class="mt-3 flex items-center justify-between">
                <span class="text-2.75 text-[#9aa0a6]">支持 Markdown，友善交流</span>
                <el-button
                  :disabled="isMuted"
                  :loading="submitting"
                  round
                  type="primary"
                  @click="submitReply"
                >
                  发表回复
                </el-button>
              </div>
            </template>
          </div>
        </section>
      </div>

      <!-- 右侧信息 -->
      <aside class="space-y-4 lg:sticky lg:top-20">
        <section class="card-base p-5">
          <div class="flex flex-col items-center text-center">
            <el-avatar :size="64" :src="detail.author.avatar_url" />
            <RouterLink
              class="mt-3 text-4 text-[#15181b] font-bold hover:text-[#018d71]"
              :to="`/user/${detail.author.loginname}`"
            >
              {{ detail.author.loginname }}
            </RouterLink>
            <div class="mt-1 text-2.75 text-[#9aa0a6]">话题作者</div>
          </div>
          <div class="mt-5 grid grid-cols-3 gap-2 border-t border-[#f2f4f6] pt-4 text-center">
            <div>
              <div class="text-3.5 text-[#15181b] font-bold">{{ detail.visit_count }}</div>
              <div class="text-2.5 text-[#9aa0a6]">浏览</div>
            </div>
            <div>
              <div class="text-3.5 text-[#15181b] font-bold">{{ detail.reply_count }}</div>
              <div class="text-2.5 text-[#9aa0a6]">回复</div>
            </div>
            <div>
              <div class="text-3.5 text-[#15181b] font-bold">{{ detail.collect_count || 0 }}</div>
              <div class="text-2.5 text-[#9aa0a6]">收藏</div>
            </div>
          </div>
        </section>

        <section class="card-base p-5">
          <h3 class="text-3.5 text-[#15181b] font-bold">话题信息</h3>
          <div class="mt-3 space-y-2.5 text-3">
            <div class="flex justify-between gap-3">
              <span class="text-[#9aa0a6]">发布时间</span>
              <span class="text-right text-[#3d444a]">{{ formatDate(detail.create_at) }}</span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-[#9aa0a6]">最后回复</span>
              <span class="text-right text-[#3d444a]">
                {{ detail.last_reply_at ? formatRelativeTime(detail.last_reply_at) : '暂无' }}
              </span>
            </div>
            <div class="flex justify-between gap-3">
              <span class="text-[#9aa0a6]">分类</span>
              <span class="text-right text-[#3d444a]">{{ tabLabel || '未分类' }}</span>
            </div>
          </div>
        </section>

        <section class="card-base overflow-hidden">
          <div class="bg-[linear-gradient(135deg,#e8f8f5,#f7fffd)] p-5">
            <div class="text-3.5 text-[#10231e] font-bold">参与社区讨论</div>
            <p class="mt-1 text-3 text-[#5b7770] leading-relaxed">
              分享你的经验，帮助其他开发者，也让更多人认识你。
            </p>
            <el-button
              v-if="!canEditTopic"
              class="mt-3"
              round
              size="small"
              type="primary"
              @click="router.push('/topic/create')"
            >
              发布话题
            </el-button>
            <el-button
              v-else
              class="mt-3"
              round
              size="small"
              type="primary"
              @click="router.push(`/topic/${detail.id}/edit`)"
            >
              编辑话题
            </el-button>
          </div>
        </section>
      </aside>
    </div>

    <!-- 举报弹窗 -->
    <el-dialog v-model="reportVisible" title="举报内容" width="440px">
      <el-form label-position="top">
        <el-form-item label="举报类型">
          <el-select v-model="reportForm.type" class="w-full">
            <el-option
              v-for="item in REPORT_TYPES"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="补充说明">
          <el-input
            v-model="reportForm.description"
            :rows="3"
            maxlength="1000"
            placeholder="请描述具体问题（选填）"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reportVisible = false">取消</el-button>
        <el-button :loading="reportSubmitting" type="primary" @click="submitReport">
          提交举报
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑回复 -->
    <el-dialog v-model="editVisible" title="编辑回复" width="560px">
      <el-input
        v-model="editContent"
        :rows="6"
        maxlength="10000"
        placeholder="请输入回复内容"
        show-word-limit
        type="textarea"
      />
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button :loading="editSubmitting" type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #7b8188;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: color 0.15s ease;

  &:hover {
    color: #018d71;
  }
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

.job-chip {
  padding: 2px 8px;
  color: #5b636b;
  background: #fff;
  border: 1px solid #e3f2ee;
  border-radius: 6px;
}

.job-chip.is-brand {
  color: #017a62;
  background: #eaf7f5;
  border-color: transparent;
}
</style>
