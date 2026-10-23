<script lang="ts" setup>
import type { UploadRequestOptions } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

import type { JobMeta, PublishTab } from '@/api/types'

import { ArrowLeft, Picture, Promotion } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getUploadPresign } from '@/api/auth'
import { rawAxios } from '@/api/request'
import { createTopic, getTopicDetail, updateTopic } from '@/api/topic'
import { PUBLISH_TABS, REMOTE_OPTIONS } from '@/enums'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isEdit = computed(() => route.name === 'topic-edit')
const topicId = computed(() => String(route.params.id || ''))

const formRef = ref<FormInstance>()
const loading = ref(false)
const submitting = ref(false)
const uploading = ref(false)
const loadError = ref('')

const form = reactive({
  title: '',
  tab: 'share' as PublishTab,
  content: '',
})

const job = reactive({
  company: '',
  company_logo: '',
  contact: '',
  experience: '',
  location: '',
  position: '',
  remote: 'on-site' as JobMeta['remote'],
  salary_max: undefined as number | undefined,
  salary_min: undefined as number | undefined,
  tech_tags: [] as string[],
})

const techTagOptions = [
  'Node.js',
  'TypeScript',
  'JavaScript',
  'Vue',
  'React',
  'Next.js',
  'NestJS',
  'Go',
  'Python',
  'Rust',
  'Docker',
  'Kubernetes',
  'PostgreSQL',
  'Redis',
  'MySQL',
  'MongoDB',
  'AWS',
  'Serverless',
]

const rules: FormRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 5, max: 100, message: '标题长度需为 5-100 个字符', trigger: 'blur' },
  ],
  content: [{ required: true, message: '请输入话题内容', trigger: 'blur' }],
}

const pageTitle = computed(() => (isEdit.value ? '编辑话题' : '发布话题'))

function toNumber(value: number | string | null | undefined) {
  if (value === '' || value === null || value === undefined) return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function buildJobMeta(): JobMeta | null {
  if (!job.company.trim()) {
    ElMessage.warning('请填写公司名称')
    return null
  }
  if (!job.position.trim()) {
    ElMessage.warning('请填写招聘职位')
    return null
  }
  if (!job.location.trim()) {
    ElMessage.warning('请填写工作地点')
    return null
  }
  if (!job.contact.trim()) {
    ElMessage.warning('请填写联系方式')
    return null
  }

  return {
    company: job.company.trim(),
    company_logo: job.company_logo.trim() || null,
    contact: job.contact.trim(),
    experience: job.experience.trim() || null,
    location: job.location.trim(),
    position: job.position.trim(),
    remote: job.remote,
    salary_max: toNumber(job.salary_max),
    salary_min: toNumber(job.salary_min),
    tech_tags: job.tech_tags.map((item) => item.trim()).filter(Boolean),
  }
}

async function loadTopic() {
  if (!isEdit.value || !topicId.value) return
  loading.value = true
  loadError.value = ''
  try {
    // 编辑需要原始 Markdown 内容
    const res = await getTopicDetail(topicId.value, { mdrender: false })
    const topic = res.data
    if (topic.author.loginname !== userStore.loginname) {
      loadError.value = '你没有权限编辑这个话题'
      return
    }

    form.title = topic.title
    form.tab = topic.tab as PublishTab
    form.content = topic.content

    const meta = topic.job_meta
    if (meta) {
      job.company = meta.company || ''
      job.company_logo = meta.company_logo || ''
      job.position = meta.position || ''
      job.location = meta.location || ''
      job.remote = meta.remote || 'on-site'
      job.salary_min = meta.salary_min == null ? undefined : meta.salary_min
      job.salary_max = meta.salary_max == null ? undefined : meta.salary_max
      job.experience = meta.experience || ''
      job.tech_tags = meta.tech_tags || []
      job.contact = meta.contact || ''
    }
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '话题加载失败'
  } finally {
    loading.value = false
  }
}

async function uploadImage(options: UploadRequestOptions) {
  const file = options.file
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    throw new Error('invalid file')
  }

  uploading.value = true
  try {
    const presign = await getUploadPresign({
      contentType: file.type || 'image/png',
      filename: file.name,
    })

    await rawAxios.request({
      data: file,
      headers: presign.headers,
      method: presign.method || 'PUT',
      url: presign.upload_url,
    })

    form.content += `\n![${presign.filename}](${presign.url})\n`
    ElMessage.success('图片已插入正文')
    return presign.url
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '图片上传失败')
    throw error
  } finally {
    uploading.value = false
  }
}

async function onSubmit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  const payload = {
    content: form.content,
    tab: form.tab,
    title: form.title.trim(),
  }

  if (form.tab === 'job') {
    const meta = buildJobMeta()
    if (!meta) return
    Object.assign(payload, { job_meta: meta })
  }

  submitting.value = true
  try {
    if (isEdit.value) {
      await updateTopic({ ...payload, topic_id: topicId.value })
      ElMessage.success('保存成功')
      router.replace(`/topic/${topicId.value}`)
    } else {
      const res = await createTopic(payload)
      ElMessage.success('发布成功')
      router.replace(`/topic/${res.topic_id}`)
    }
  } catch {
    // 错误提示由请求层统一处理
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  const tab = route.query.tab
  if (typeof tab === 'string' && PUBLISH_TABS.some((item) => item.key === tab)) {
    form.tab = tab as PublishTab
  }
  void loadTopic()
})
</script>

<template>
  <div class="page-container py-6">
    <div class="mb-4 flex items-center justify-between">
      <button class="back-link" type="button" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </button>
      <el-tag effect="plain" type="success">{{ pageTitle }}</el-tag>
    </div>

    <el-skeleton v-if="loading" :rows="12" animated class="card-base p-6" />

    <el-result
      v-else-if="loadError"
      icon="warning"
      :sub-title="loadError"
      title="无法编辑"
    >
      <template #extra>
        <el-button round type="primary" @click="router.replace('/')">返回首页</el-button>
      </template>
    </el-result>

    <el-form
      v-else
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      size="large"
    >
      <div class="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div class="space-y-4">
          <section class="card-base p-6">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="form.title"
                maxlength="100"
                placeholder="请输入标题（5-100 个字符）"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="分类" prop="tab">
              <el-select v-model="form.tab" class="w-full md:w-60">
                <el-option
                  v-for="item in PUBLISH_TABS"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>

            <el-form-item prop="content">
              <template #label>
                <div class="flex w-full items-center gap-2">
                  <span>正文</span>
                  <span class="text-2.75 text-[#9aa0a6] font-normal">支持 Markdown</span>
                  <el-upload
                    class="ml-auto"
                    :http-request="uploadImage"
                    :show-file-list="false"
                    accept="image/*"
                  >
                    <el-button :icon="Picture" :loading="uploading" plain round size="small">
                      插入图片
                    </el-button>
                  </el-upload>
                </div>
              </template>
              <el-input
                v-model="form.content"
                :rows="18"
                maxlength="-1"
                placeholder="分享你的想法、问题或经验...&#10;&#10;支持 Markdown 语法，例如：&#10;## 小标题&#10;- 列表项&#10;`行内代码`&#10;```js&#10;console.log('Hello CNode')&#10;```"
                resize="vertical"
                type="textarea"
              />
            </el-form-item>
          </section>

          <!-- 招聘信息 -->
          <section v-if="form.tab === 'job'" class="card-base p-6">
            <div class="mb-4 flex items-center gap-2">
              <h2 class="text-4 text-[#15181b] font-bold">招聘信息</h2>
              <el-tag effect="light" size="small" type="success">必填</el-tag>
            </div>

            <div class="grid gap-x-5 md:grid-cols-2">
              <el-form-item label="公司名称">
                <el-input v-model="job.company" placeholder="请输入公司名称" />
              </el-form-item>
              <el-form-item label="招聘职位">
                <el-input v-model="job.position" placeholder="如：Node.js 后端工程师" />
              </el-form-item>
              <el-form-item label="工作地点">
                <el-input v-model="job.location" placeholder="如：北京 / 上海 / 远程" />
              </el-form-item>
              <el-form-item label="办公方式">
                <el-select v-model="job.remote" class="w-full">
                  <el-option
                    v-for="item in REMOTE_OPTIONS"
                    :key="item.key"
                    :label="item.label"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="薪资范围（K/月）">
                <div class="w-full flex items-center gap-2">
                  <el-input-number
                    v-model="job.salary_min"
                    :min="0"
                    :max="999"
                    class="flex-1"
                    controls-position="right"
                    placeholder="最低"
                  />
                  <span class="text-[#9aa0a6]">-</span>
                  <el-input-number
                    v-model="job.salary_max"
                    :min="0"
                    :max="999"
                    class="flex-1"
                    controls-position="right"
                    placeholder="最高"
                  />
                </div>
              </el-form-item>
              <el-form-item label="经验要求">
                <el-input v-model="job.experience" placeholder="如：3-5 年 / 不限" />
              </el-form-item>
              <el-form-item label="联系方式">
                <el-input v-model="job.contact" placeholder="邮箱 / 微信 / 链接" />
              </el-form-item>
              <el-form-item label="公司 Logo 地址">
                <el-input v-model="job.company_logo" placeholder="图片地址（选填）" />
              </el-form-item>
            </div>

            <el-form-item label="技术标签">
              <el-select
                v-model="job.tech_tags"
                allow-create
                class="w-full"
                default-first-option
                filterable
                multiple
                placeholder="选择或输入技术标签"
              >
                <el-option v-for="tag in techTagOptions" :key="tag" :label="tag" :value="tag" />
              </el-select>
            </el-form-item>
          </section>

          <div class="card-base flex items-center justify-between p-4">
            <span class="text-3 text-[#9aa0a6]">请遵守社区规范，友善发言</span>
            <div class="flex gap-2">
              <el-button round @click="router.back()">取消</el-button>
              <el-button :icon="Promotion" :loading="submitting" round type="primary" @click="onSubmit">
                {{ isEdit ? '保存修改' : '发布话题' }}
              </el-button>
            </div>
          </div>
        </div>

        <aside class="space-y-4 lg:sticky lg:top-20">
          <section class="card-base p-5">
            <h3 class="text-3.5 text-[#15181b] font-bold">发布须知</h3>
            <ul class="mt-3 space-y-2 pl-4 text-3 text-[#7b8188] leading-relaxed">
              <li>标题需为 5-100 个字符，清晰描述问题或内容。</li>
              <li>选择合适的分类，招聘内容请选择「招聘」。</li>
              <li>请勿发布广告、灌水或与 Node.js 无关的内容。</li>
              <li>尊重他人，理性讨论，共同维护社区氛围。</li>
            </ul>
          </section>

          <section class="card-base p-5">
            <h3 class="text-3.5 text-[#15181b] font-bold">Markdown 提示</h3>
            <div class="mt-3 space-y-1.5 font-mono text-2.75 text-[#7b8188]">
              <div>## 标题</div>
              <div>**加粗** · *斜体*</div>
              <div>`行内代码`</div>
              <div>```js ... ```</div>
              <div>[链接](https://...)</div>
              <div>![图片](https://...)</div>
            </div>
          </section>
        </aside>
      </div>
    </el-form>
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
</style>
