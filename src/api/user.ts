import type { CnodeEnvelope, Topic, UserBrief, UserDetail } from './types'

import { cnodeRequest } from './request'

export interface UserListQuery {
  limit?: number
  page?: number
}

export interface UserTopicsResponse extends CnodeEnvelope {
  data: Topic[]
  success: true
  total: number
  user: UserBrief
}

export interface UserDetailResponse extends CnodeEnvelope {
  data: UserDetail
  success: true
}

export interface UserBriefListResponse extends CnodeEnvelope {
  data: UserBrief[]
  success: true
}

/** 获取星标用户 */
export function getStarUsers() {
  return cnodeRequest<UserBriefListResponse>({
    method: 'GET',
    url: '/users/stars',
  })
}

/** 获取积分前 100 用户 */
export function getTop100Users() {
  return cnodeRequest<UserBriefListResponse>({
    method: 'GET',
    url: '/users/top100',
  })
}

/** 获取用户详情 */
export function getUserDetail(loginname: string) {
  return cnodeRequest<UserDetailResponse>({
    method: 'GET',
    url: `/user/${loginname}`,
  })
}

/** 获取用户发布的话题 */
export function getUserTopics(loginname: string, query: UserListQuery = {}) {
  return cnodeRequest<UserTopicsResponse>({
    method: 'GET',
    params: { ...query },
    url: `/user/${loginname}/topics`,
  })
}

/** 获取用户发布的回复 */
export function getUserReplies(loginname: string, query: UserListQuery = {}) {
  return cnodeRequest<UserTopicsResponse>({
    method: 'GET',
    params: { ...query },
    url: `/user/${loginname}/replies`,
  })
}

/** 获取用户收藏的话题 */
export function getUserCollections(loginname: string, query: UserListQuery = {}) {
  return cnodeRequest<UserTopicsResponse>({
    method: 'GET',
    params: { ...query },
    url: `/user/${loginname}/collections`,
  })
}
