import type { CnodeUser } from './types'

import { useUserStore } from '@/stores/user'

import { login, refreshAccesstoken, signout, verifyAccesstoken } from './auth'

function toUser(res: {
  avatar_url: string
  id: string
  is_block: boolean
  is_muted: boolean
  loginname: string
}): CnodeUser {
  return {
    avatar_url: res.avatar_url,
    id: res.id,
    is_block: res.is_block,
    is_muted: res.is_muted,
    loginname: res.loginname,
  }
}

/** 使用 accesstoken 校验并缓存当前用户 */
async function applyAccesstoken(accesstoken: string): Promise<CnodeUser> {
  const userStore = useUserStore()
  const res = await verifyAccesstoken(accesstoken, { silent: true })
  const user = toUser(res)
  userStore.setAccesstoken(accesstoken)
  userStore.setUserInfo(user)
  return user
}

/** 直接用 accesstoken 登录 */
export function loginByToken(accesstoken: string) {
  return applyAccesstoken(accesstoken)
}

/**
 * 账号密码登录
 * 登录成功后通过 /user/refresh_token 换取 accessToken，再校验用户信息
 */
export async function loginByPassword(name: string, pass: string) {
  const res = await login({ name, pass }, { silent: true })
  let accesstoken = res.accesstoken || ''

  if (!accesstoken) {
    try {
      const refresh = await refreshAccesstoken({ silent: true })
      accesstoken = refresh.accessToken
    } catch {
      throw new Error('账号密码登录成功，但当前环境无法获取 accessToken，请改用 Token 登录')
    }
  }

  if (!accesstoken) {
    throw new Error('登录成功但未获取到 accessToken，请改用 accessToken 登录')
  }

  return applyAccesstoken(accesstoken)
}

/** 恢复登录态：校验本地 accesstoken 并刷新用户信息 */
export async function restoreSession() {
  const userStore = useUserStore()
  if (!userStore.accesstoken) return null

  try {
    return await applyAccesstoken(userStore.accesstoken)
  } catch {
    userStore.clear()
    return null
  }
}

/** 退出登录 */
export async function logout() {
  const userStore = useUserStore()
  try {
    await signout()
  } catch {
    // 忽略退出失败，本地登录态照常清理
  }
  userStore.clear()
}
