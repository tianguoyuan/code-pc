import { http } from '@/utils/http'

interface UserGetPhoneCodeParams {
  phone: string
}
interface UserGetPhoneCodeRes {
  code: string
}
// 获取验证码
export function userGetPhoneCode(data: UserGetPhoneCodeParams) {
  return http.post<UserGetPhoneCodeRes>('/user/getPhoneCode', data)
}

// 登录
interface UserLoginParams {
  code: string
  phone: string
}
interface UserLoginRes {
  token: string
  userId: string
}
export function userLogin(data: UserLoginParams) {
  return http.post<UserLoginRes>('/user/login', data)
}

// 获取用户信息
interface UserInfoParams {
  token: string
}
interface UserInfoRes {
  userId: string
}
export function getUserInfo(data: UserInfoParams) {
  return http.post<UserInfoRes>('/user/info', data)
}

// 用户注册
interface UserRegisterParams {
  code: string
  phone: string
  username: string
}
interface UserRegisterRes {
  token: string
  userId: string
}
export function userRegister(data: UserRegisterParams) {
  return http.post<UserRegisterRes>('/user/register', data)
}
