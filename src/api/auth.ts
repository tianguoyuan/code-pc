import type { CnodeEnvelope, CnodeUser } from './types'

import { cnodeRequest } from './request'

export interface LoginPayload {
  name: string
  pass: string
}

export interface SignupPayload {
  email: string
  loginname: string
  pass: string
  turnstileToken?: string
}

export interface ActiveAccountPayload {
  name: string
  pass: string
  turnstileToken?: string
}

export interface SearchPassPayload {
  email: string
  turnstileToken?: string
}

export interface ResetPassPayload {
  key: string
  psw: string
}

export interface UpdateProfilePayload {
  location?: string
  receive_at_mail?: boolean
  receive_reply_mail?: boolean
  signature?: string
  url?: string
  weibo?: string
}

export interface ChangePassPayload {
  newPass: string
  oldPass: string
}

export interface UploadPresignPayload {
  contentType?: string
  filename: string
}

export interface SuccessResponse extends CnodeEnvelope {
  success: true
}

export interface LoginResponse extends CnodeEnvelope {
  /** 部分部署会直接下发 accesstoken */
  accesstoken?: string
  success: true
}

export interface RefreshTokenResponse extends CnodeEnvelope {
  accessToken: string
  success: true
}

export interface VerifyTokenResponse extends CnodeEnvelope {
  avatar_url: string
  id: string
  is_block: boolean
  is_muted: boolean
  loginname: string
  success: true
}

export interface CurrentUserResponse extends CnodeEnvelope {
  data?: CnodeUser | null
  success: boolean
}

export interface AuthConfigResponse extends CnodeEnvelope {
  data: {
    allow_signup: boolean
  }
  success: true
}

export interface UploadPresignResponse extends CnodeEnvelope {
  filename: string
  headers: Record<string, string>
  method: string
  success: true
  upload_url: string
  url: string
}

/** 本地登录 */
export function login(payload: LoginPayload, options: { silent?: boolean } = {}) {
  return cnodeRequest<LoginResponse>({
    withAuth: false,
    data: { ...payload },
    method: 'POST',
    url: '/auth/local/login',
    ...options,
  })
}

/** 本地注册 */
export function signup(payload: SignupPayload) {
  return cnodeRequest<SuccessResponse>({
    withAuth: false,
    data: { ...payload },
    method: 'POST',
    url: '/auth/local/signup',
  })
}

/** 获取公开认证配置 */
export function getAuthConfig(options: { silent?: boolean } = {}) {
  return cnodeRequest<AuthConfigResponse>({
    withAuth: false,
    method: 'GET',
    url: '/auth/config',
    ...options,
  })
}

/** 重新发送激活邮件 */
export function resendActivation(payload: ActiveAccountPayload) {
  return cnodeRequest<SuccessResponse>({
    withAuth: false,
    data: { ...payload },
    method: 'POST',
    url: '/auth/local/resend_activation',
  })
}

/** 激活账号 */
export function activeAccount(key: string) {
  return cnodeRequest<SuccessResponse>({
    withAuth: false,
    method: 'GET',
    params: { key },
    url: '/auth/local/active_account',
  })
}

/** 找回密码 */
export function searchPass(payload: SearchPassPayload) {
  return cnodeRequest<SuccessResponse>({
    withAuth: false,
    data: { ...payload },
    method: 'POST',
    url: '/auth/local/search_pass',
  })
}

/** 重置密码 */
export function resetPass(payload: ResetPassPayload) {
  return cnodeRequest<SuccessResponse>({
    withAuth: false,
    data: { ...payload },
    method: 'POST',
    url: '/auth/local/reset_pass',
  })
}

/** 校验 accesstoken */
export function verifyAccesstoken(
  accesstoken: string,
  options: { silent?: boolean } = {},
) {
  return cnodeRequest<VerifyTokenResponse>({
    withAuth: false,
    data: { accesstoken },
    method: 'POST',
    url: '/accesstoken',
    ...options,
  })
}

/** 刷新 accesstoken */
export function refreshAccesstoken(options: { silent?: boolean } = {}) {
  return cnodeRequest<RefreshTokenResponse>({
    withAuth: false,
    data: {},
    method: 'POST',
    url: '/user/refresh_token',
    ...options,
  })
}

/** 获取当前登录用户 */
export function getCurrentUser() {
  return cnodeRequest<CurrentUserResponse>({
    method: 'GET',
    url: '/auth/me',
  })
}

/** 退出登录 */
export function signout() {
  return cnodeRequest<SuccessResponse>({
    data: {},
    method: 'POST',
    silent: true,
    url: '/auth/signout',
  })
}

/** 更新个人资料 */
export function updateProfile(payload: UpdateProfilePayload) {
  return cnodeRequest<SuccessResponse>({
    data: { ...payload },
    method: 'POST',
    url: '/auth/local/setting',
  })
}

/** 修改密码 */
export function changePass(payload: ChangePassPayload) {
  return cnodeRequest<SuccessResponse>({
    data: { ...payload },
    method: 'POST',
    url: '/auth/local/change_pass',
  })
}

/** 获取图片上传预签名 URL */
export function getUploadPresign(payload: UploadPresignPayload) {
  return cnodeRequest<UploadPresignResponse>({
    data: { ...payload },
    method: 'POST',
    url: '/upload/presign',
  })
}
