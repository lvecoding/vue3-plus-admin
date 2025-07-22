import request from '@/utils/request'

// 发送消息
export const sendMessage = data => {
  return request({
    url: '/imessage/send_imessage',
    method: 'post',
    data
  })
}

// 消息记录列表
export const messageList = (type, receiver, params) => {
  return request({
    url: `/imessage/info/${type}/${receiver}`,
    method: 'get',
    params
  })
}

// 设置消息已读
export const setRead = (id, endTimestamp = '') => {
  endTimestamp = endTimestamp || new Date().getTime() + ''
  return request({
    url: `/imessage/readed/${id}?endTimestamp=${endTimestamp}`,
    method: 'post'
  })
}
