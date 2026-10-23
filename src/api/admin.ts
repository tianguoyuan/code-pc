import type { CnodeEnvelope } from './types'

import { cnodeRequest } from './request'

export type ReportTargetType = 'topic' | 'reply'

export interface ReportPayload {
  /** 补充说明 */
  description?: string
  targetId: number
  targetType: ReportTargetType
  /** 举报原因分类，默认 other */
  type?: string
}

export interface ReportResponse extends CnodeEnvelope {
  success: true
}

/** 创建举报 */
export function createReport(payload: ReportPayload) {
  return cnodeRequest<ReportResponse>({
    data: { ...payload },
    method: 'POST',
    url: '/admin/reports',
  })
}
