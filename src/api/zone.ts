import type { CnodeEnvelope, JobCard, JobFacets, SidebarHome, TabInfo, Zone } from './types'

import { cnodeRequest } from './request'

export interface JobsQuery {
  limit?: number | string
  location?: string
  page?: number | string
  remote?: string
  salary_min?: number | string
  tags?: string
}

export interface JobsResponse extends CnodeEnvelope {
  data: JobCard[]
  success: true
  total: number
}

export interface JobFacetsResponse extends CnodeEnvelope {
  data: JobFacets
  success: true
}

export interface ZonesResponse extends CnodeEnvelope {
  data: Zone[]
  success: true
}

export interface TabsResponse extends CnodeEnvelope {
  data: TabInfo[]
  success: true
}

export interface SidebarHomeResponse extends CnodeEnvelope {
  data: SidebarHome
  success: true
}

/** 获取招聘专区列表 */
export function getJobs(query: JobsQuery = {}) {
  return cnodeRequest<JobsResponse>({
    method: 'GET',
    params: { ...query },
    url: '/zone/jobs',
  })
}

/** 获取招聘专区 facet 聚合 */
export function getJobFacets(options: { silent?: boolean } = {}) {
  return cnodeRequest<JobFacetsResponse>({
    method: 'GET',
    url: '/zone/jobs/facets',
    ...options,
  })
}

/** 获取公开专区列表 */
export function getZones() {
  return cnodeRequest<ZonesResponse>({
    method: 'GET',
    url: '/zones',
  })
}

/** 获取社区 tab 列表 */
export function getTabs(options: { silent?: boolean } = {}) {
  return cnodeRequest<TabsResponse>({
    method: 'GET',
    url: '/tabs',
    ...options,
  })
}

/** 获取首页侧边栏数据 */
export function getSidebarHome() {
  return cnodeRequest<SidebarHomeResponse>({
    method: 'GET',
    url: '/sidebar/home',
  })
}
