import request from '@/utils/request'

// 统计未读消息数量
export const notifyUnread = () => {
  return request({
    url: '/notify/unread_size',
    method: 'get'
  })
}

// 根据类型获取站内消息
export const notifyFilter = params => {
  return request({
    url: '/notify/filter',
    method: 'get',
    params
  })
}

// 标记消息已读
export const notifyRead = id => {
  return request({
    url: `/notify/readed?notifyIds=` + id,
    method: 'post'
  })
}

// 批量标记为已读
export const batchNotifyRead = params => {
  return request({
    url: '/notify/readed',
    method: 'post',
    params
  })
}

// 标记为全部已读
export const allNotifyRead = () => {
  return request({
    url: '/notify/readed_all',
    method: 'post'
  })
}
