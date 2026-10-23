/** 社区 tab（与 GET /topics 的 tab 参数保持一致） */
export const TOPIC_TABS = [
  { key: 'all', label: '全部' },
  { key: 'share', label: '分享' },
  { key: 'ask', label: '问答' },
  { key: 'tech', label: '技术' },
  { key: 'ai', label: 'AI' },
  { key: 'ideas', label: '想法' },
  { key: 'career', label: '职业' },
  { key: 'life', label: '生活' },
  { key: 'event', label: '活动' },
  { key: 'job', label: '招聘' },
] as const

/** 可以发布的 tab */
export const PUBLISH_TABS = TOPIC_TABS.filter((item) => item.key !== 'all')

/** tab key -> 名称 */
export const TOPIC_TAB_LABEL: Record<string, string> = TOPIC_TABS.reduce(
  (acc, item) => {
    acc[item.key] = item.label
    return acc
  },
  {} as Record<string, string>,
)

/** tab key -> 颜色（Element Plus tag 类型） */
export const TOPIC_TAB_TAG_TYPE: Record<string, '' | 'success' | 'info' | 'warning' | 'danger'> = {
  share: 'success',
  ask: 'warning',
  tech: 'info',
  ai: 'danger',
  job: 'success',
  good: 'danger',
}

/** 远程办公方式 */
export const REMOTE_OPTIONS = [
  { key: 'on-site', label: '坐班' },
  { key: 'hybrid', label: '混合办公' },
  { key: 'remote', label: '远程办公' },
] as const

/** 远程办公方式 -> 名称 */
export const REMOTE_LABEL: Record<string, string> = REMOTE_OPTIONS.reduce(
  (acc, item) => {
    acc[item.key] = item.label
    return acc
  },
  {} as Record<string, string>,
)

/** 消息类型 -> 名称 */
export const MESSAGE_TYPE_LABEL: Record<string, string> = {
  at: '@我',
  reply: '回复我',
  reply2: '回复我',
}

/** 用户身份 -> 名称 */
export const IDENTITY_LABEL: Record<string, string> = {
  admin: '管理员',
  moderator: '版主',
  recruiter: '招聘方',
}

/** 举报原因 */
export const REPORT_TYPES = [
  { key: 'spam', label: '垃圾广告' },
  { key: 'abuse', label: '辱骂攻击' },
  { key: 'porn', label: '色情低俗' },
  { key: 'other', label: '其他' },
] as const

/** 薪资筛选 */
export const SALARY_OPTIONS = [
  { label: '不限薪资', value: '' },
  { label: '10K 以上', value: '10' },
  { label: '20K 以上', value: '20' },
  { label: '30K 以上', value: '30' },
  { label: '50K 以上', value: '50' },
] as const

/** 列表默认分页大小 */
export const PAGE_SIZE = 20

/** 招聘列表分页大小 */
export const JOB_PAGE_SIZE = 12
