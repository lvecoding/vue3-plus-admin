import request from '@/utils/request'

// 搜索投资人
export const listInvestor = data => {
  return request({
    url: '/investor/page',
    method: 'post',
    data
  })
}
