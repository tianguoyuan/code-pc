import type { CnodeEnvelope, MessageList } from './types'

import { cnodeRequest } from './request'

export interface MessagesResponse extends CnodeEnvelope {
  data: MessageList
  success: true
}

export interface MessageCountResponse extends CnodeEnvelope {
  data: number
  success: true
}

export interface MarkAllResponse extends CnodeEnvelope {
  marked_msgs: { id: string }[]
  success: true
}

export interface MarkOneResponse extends CnodeEnvelope {
  marked_msg_id: string
  success: true
}

/** 获取消息列表 */
export function getMessages(query: { mdrender?: boolean } = {}) {
  return cnodeRequest<MessagesResponse>({
    method: 'GET',
    params: { ...query },
    url: '/messages',
  })
}

/** 获取未读消息数 */
export function getMessageCount(options: { silent?: boolean } = {}) {
  return cnodeRequest<MessageCountResponse>({
    method: 'GET',
    url: '/message/count',
    ...options,
  })
}

/** 标记全部消息已读 */
export function markAllMessagesRead() {
  return cnodeRequest<MarkAllResponse>({
    data: {},
    method: 'POST',
    url: '/message/mark_all',
  })
}

/** 标记单条消息已读 */
export function markMessageRead(msgId: string) {
  return cnodeRequest<MarkOneResponse>({
    data: {},
    method: 'POST',
    url: `/message/mark_one/${msgId}`,
  })
}
