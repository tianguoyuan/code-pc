/**
 * 通用格式化工具
 */

function pad(value: number) {
  return String(value).padStart(2, '0')
}

/** 格式化为 YYYY-MM-DD HH:mm */
export function formatDate(input?: string | number | null, withTime = true): string {
  if (input === undefined || input === null || input === '') return ''
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  if (!withTime) return `${y}-${m}-${d}`
  return `${y}-${m}-${d} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** 相对时间，如：刚刚、5 分钟前、3 天前 */
export function formatRelativeTime(input?: string | number | null): string {
  if (input === undefined || input === null || input === '') return ''
  const time = new Date(input).getTime()
  if (Number.isNaN(time)) return ''

  const diff = Date.now() - time
  if (diff < 0) return formatDate(input)

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`
  return formatDate(input, false)
}

/** 截取纯文本（去除 markdown / html 标签） */
export function plainText(html?: string | null, maxLength = 0): string {
  if (!html) return ''
  const text = html
    .replace(/<[^>]+>/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[*_`>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (maxLength > 0 && text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`
  }
  return text
}

/** 数字缩写，如 1.2k */
export function formatCount(value?: number | null): string {
  if (value == null) return '0'
  if (value < 1000) return String(value)
  if (value < 10000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return `${(value / 10000).toFixed(1).replace(/\.0$/, '')}w`
}

/** 金额格式化（单位：K/月） */
export function formatSalary(min?: number | null, max?: number | null): string {
  if (min != null && max != null) return `${min}K - ${max}K`
  if (min != null) return `${min}K 以上`
  if (max != null) return `${max}K 以下`
  return '面议'
}
