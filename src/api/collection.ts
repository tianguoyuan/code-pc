import type { CnodeEnvelope, Topic } from './types'

import { cnodeRequest } from './request'

export interface CollectListResponse extends CnodeEnvelope {
  data: Topic[]
  success: true
}

export interface CollectResponse extends CnodeEnvelope {
  success: true
}

/** 获取用户收藏列表 */
export function getCollectedTopics(loginname: string) {
  return cnodeRequest<CollectListResponse>({
    method: 'GET',
    url: `/topic_collect/${loginname}`,
  })
}

/** 收藏话题 */
export function collectTopic(topicId: string) {
  return cnodeRequest<CollectResponse>({
    data: { topic_id: topicId },
    method: 'POST',
    url: '/topic_collect/collect',
  })
}

/** 取消收藏 */
export function deCollectTopic(topicId: string) {
  return cnodeRequest<CollectResponse>({
    data: { topic_id: topicId },
    method: 'POST',
    url: '/topic_collect/de_collect',
  })
}
