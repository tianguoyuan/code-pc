/**
 * CNode Next API 数据类型
 * 依据 openapi.json（CNode Next API v1.0.0）整理
 */

/** 统一响应信封 */
export interface CnodeEnvelope<T = unknown> {
  /** 业务数据 */
  data?: T
  /** 错误码 */
  error_code?: string
  /** 错误信息 */
  error_msg?: string
  /** 提示信息 */
  message?: string
  /** 是否成功 */
  success: boolean
}

/** 社区 tab（列表筛选用） */
export type TopicTab =
  | 'all'
  | 'share'
  | 'ask'
  | 'tech'
  | 'ai'
  | 'ideas'
  | 'career'
  | 'life'
  | 'event'
  | 'job'
  | 'dev'
  | 'good'

/** 可发布的 tab */
export type PublishTab = Exclude<TopicTab, 'all' | 'dev' | 'good'>

/** 作者信息 */
export interface Author {
  avatar_url: string
  loginname: string
}

/** 招聘元信息 */
export interface JobMeta {
  company: string
  company_logo?: string | null
  contact: string
  experience?: string | null
  location: string
  position: string
  remote: 'on-site' | 'hybrid' | 'remote'
  salary_max?: number | null
  salary_min?: number | null
  tech_tags?: string[]
}

/** 话题 */
export interface Topic {
  author: Author
  author_id: string
  content: string
  create_at: string
  good: boolean
  id: string
  job_meta?: JobMeta | null
  last_reply_at: string | null
  reply_count: number
  tab: string
  title: string
  top: boolean
  visit_count: number
}

/** 被回复的楼层摘要 */
export interface ReplyTo {
  author: Author
  content_excerpt: string
  deleted: boolean
  id: string
}

/** 回复 */
export interface Reply {
  author: Author
  content: string
  create_at: string
  id: string
  is_uped: boolean
  reply_id: string | null
  reply_to: ReplyTo | null
  /** 点赞用户 loginname 列表 */
  ups: string[]
}

/** 话题详情 */
export interface TopicDetail extends Topic {
  collect_count?: number
  is_collect: boolean
  replies: Reply[]
}

/** 用户简要信息 */
export interface UserBrief {
  avatar_url: string
  create_at: string
  githubUsername: string
  id: string
  is_star: boolean
  loginname: string
  reply_count: number
  score: number
  topic_count: number
}

/** 用户最近发布的话题/回复摘要 */
export interface RecentItem {
  author: Author
  id: string
  last_reply_at: string | null
  title: string
}

/** 用户身份标识 */
export type UserIdentity = 'admin' | 'moderator' | 'recruiter'

/** 用户详情 */
export interface UserDetail {
  avatar_url: string
  collect_topic_count: number
  create_at: string
  githubUsername: string
  identities: UserIdentity[]
  is_block: boolean
  is_muted: boolean
  location: string | null
  loginname: string
  recent_replies: RecentItem[]
  recent_topics: RecentItem[]
  reply_count: number
  score: number
  signature: string | null
  topic_count: number
  url: string | null
}

/** 当前登录用户（/accesstoken 返回） */
export interface CnodeUser {
  avatar_url: string
  id: string
  is_block: boolean
  is_muted: boolean
  loginname: string
}

/** 消息类型 */
export type MessageType = 'reply' | 'reply2' | 'at'

/** 消息项 */
export interface MessageItem {
  author: Author
  create_at: string
  has_read: boolean
  id: string
  reply: {
    id: string
    content: string
    ups: string[]
    create_at: string
  }
  topic: RecentItem
  type: MessageType
}

/** 消息列表 */
export interface MessageList {
  has_read_messages: MessageItem[]
  hasnot_read_messages: MessageItem[]
}

/** 首页侧边栏 */
export interface SidebarHome {
  latest_replies: {
    id: string
    topic_id: string
    topic_title: string
    author: Author
    create_at: string
    excerpt: string
  }[]
  no_reply_topics: {
    id: string
    title: string
    tab: string
    create_at: string
  }[]
  partners: {
    name: string
    url: string
    description: string
  }[]
  resources: {
    name: string
    url: string
  }[]
  top_users: {
    id: string
    loginname: string
    avatar_url: string
    score: number
  }[]
}

/** 公开专区 */
export interface Zone {
  description: string | null
  icon: string | null
  id: number
  name: string
  slug: string
  sort_order: number
  visible: boolean
}

/** 社区 tab 配置 */
export interface TabInfo {
  id: number
  key: string
  label: string
  scope: 'public' | 'admin'
  sort_order: number
  visible: boolean
}

/** 招聘卡片 */
export interface JobCard {
  company: string
  company_logo: string | null
  contact: string
  create_at: string
  excerpt: string
  experience: string | null
  id: string
  location: string
  position: string
  remote: string
  reply_count: number
  salary_max: number | null
  salary_min: number | null
  tech_tags: string[]
  title: string
  visit_count: number
}

/** 招聘 facet 聚合 */
export interface JobFacets {
  locations: string[]
  remote_options: string[]
}
