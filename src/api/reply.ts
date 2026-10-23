import type { CnodeEnvelope } from './types'

import { cnodeRequest } from './request'

export interface ReplyDetail {
  content: string
  create_at: string
  id: string
  topic_id: string
  update_at: string | null
}

export interface ReplyDetailResponse extends CnodeEnvelope {
  data: ReplyDetail
  success: true
}

export interface EditReplyResponse extends CnodeEnvelope {
  reply_id: string
  success: true
}

export interface DeleteReplyResponse extends CnodeEnvelope {
  status: string
  success: true
}

export interface ReplyUpsResponse extends CnodeEnvelope {
  /** up 点赞，down 取消点赞 */
  action: 'up' | 'down'
  success: true
}

/** 获取回复详情（编辑用） */
export function getReplyDetail(replyId: string) {
  return cnodeRequest<ReplyDetailResponse>({
    method: 'GET',
    url: `/reply/${replyId}`,
  })
}

/** 编辑回复 */
export function editReply(replyId: string, content: string) {
  return cnodeRequest<EditReplyResponse>({
    data: { content },
    method: 'POST',
    url: `/reply/${replyId}/edit`,
  })
}

/** 删除回复 */
export function deleteReply(replyId: string) {
  return cnodeRequest<DeleteReplyResponse>({
    data: {},
    method: 'POST',
    url: `/reply/${replyId}/delete`,
  })
}

/** 点赞 / 取消点赞 */
export function toggleReplyUp(replyId: string) {
  return cnodeRequest<ReplyUpsResponse>({
    data: {},
    method: 'POST',
    url: `/reply/${replyId}/ups`,
  })
}
