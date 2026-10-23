import type { AxiosRequestConfig } from 'axios'

import axios from 'axios'
import { ElMessage } from 'element-plus'

import { useUserStore } from '@/stores/user'

import type { CnodeEnvelope } from './types'

/** 业务错误 */
export class ApiError extends Error {
  readonly statusCode: number
  readonly errorCode?: string

  constructor(message: string, statusCode: number, errorCode?: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errorCode = errorCode
  }
}

export interface CnodeRequestConfig extends AxiosRequestConfig {
  /** 是否自动携带 accesstoken，默认 true */
  withAuth?: boolean
  /** 是否静默处理错误（不弹 toast），默认 false */
  silent?: boolean
}

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 30 * 1000,
  withCredentials: true,
})

service.interceptors.request.use((config) => {
  const options = config as CnodeRequestConfig
  const userStore = useUserStore()
  const token = userStore.accesstoken
  const useAuth = options.withAuth !== false

  if (useAuth && token) {
    const method = (config.method || 'get').toLowerCase()
    if (method === 'get' || method === 'delete') {
      config.params = { ...(config.params || {}), accesstoken: token }
    } else if (config.data instanceof FormData) {
      config.data.append('accesstoken', token)
    } else if (config.data && typeof config.data === 'object') {
      config.data = { accesstoken: token, ...(config.data as Record<string, unknown>) }
    } else {
      config.data = { accesstoken: token }
    }
  }

  return config
})

function notify(message: string, silent?: boolean) {
  if (silent) return
  ElMessage.error({ grouping: true, message })
}

service.interceptors.response.use(
  (response) => {
    const body = response.data as CnodeEnvelope | undefined
    if (body && typeof body === 'object' && 'success' in body && body.success === false) {
      const message = body.error_msg || body.message || '请求失败，请稍后重试'
      notify(message, (response.config as CnodeRequestConfig).silent)
      return Promise.reject(
        new ApiError(message, response.status, body.error_code || undefined),
      )
    }
    return body as unknown as typeof response
  },
  (error) => {
    const status = error.response?.status ?? -1
    const body = error.response?.data as CnodeEnvelope | undefined
    const message =
      body?.error_msg ||
      body?.message ||
      (status === 401
        ? '登录状态已失效，请重新登录'
        : status === 403
          ? '没有权限执行该操作'
          : status === 404
            ? '请求的资源不存在'
            : status > 0
              ? `请求失败（${status}）`
              : '网络异常，请检查网络后重试')

    if (status === 401) {
      const userStore = useUserStore()
      userStore.clear()

      const currentPath = window.location.pathname
      const requestUrl = error.config?.url || ''
      const isAuthEndpoint =
        requestUrl.includes('/auth/signout') ||
        requestUrl.includes('/user/refresh_token') ||
        requestUrl.includes('/accesstoken')
      const isProtectedPage =
        currentPath.startsWith('/messages') ||
        currentPath.startsWith('/settings') ||
        currentPath.startsWith('/topic/create') ||
        /^\/topic\/\d+\/edit$/.test(currentPath)

      // 仅在需要登录的页面跳转，避免公开页面因本地 token 过期而强制跳登录
      if (isProtectedPage && !isAuthEndpoint && !currentPath.startsWith('/login')) {
        const redirect = encodeURIComponent(currentPath + window.location.search)
        window.location.replace(`/login?redirect=${redirect}`)
      }
    }

    notify(message, (error.config as CnodeRequestConfig | undefined)?.silent)
    return Promise.reject(new ApiError(message, status, body?.error_code || undefined))
  },
)

/** 发起请求并按响应信封返回数据 */
export function cnodeRequest<T>(config: CnodeRequestConfig): Promise<T> {
  return service.request(config) as unknown as Promise<T>
}

/** 用于上传等场景的裸 axios 实例（不注入业务拦截器） */
export const rawAxios = axios.create({ timeout: 60 * 1000 })
