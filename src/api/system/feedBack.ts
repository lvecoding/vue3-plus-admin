import request from '@/utils/request'

// 查询用户反馈
export function listFeedBack(query) {
  return request({
    url: '/feedback/page',
    method: 'get',
    params: query
  })
}

// 回复用户反馈
export function replayFeedback(data) {
  return request({
    url: '/feedback/replay',
    method: 'post',
    data
  })
}

// 查询用户反馈详情
export function replayDetail(id) {
  return request({
    url: `/feedback/get/${id}`,
    method: 'get'
  })
}

// 用户个人反馈列表
export function listUserFeedBack(params) {
  return request({
    url: `/user/profile/my_feedback`,
    method: 'get',
    params
  })
}

// 删除用户反馈记录
export function deleteUserFeedBack(id) {
  return request({
    url: `/user/profile/feedback_remove/${id}`,
    method: 'delete'
  })
}

// 提交用户反馈
export function addUserFeedBack(data) {
  return request({
    url: `/feedback/save`,
    method: 'post',
    data
  })
}
