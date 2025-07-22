import request from '@/utils/request'

// 地区列表
export const listDistricts = params => {
  return request({
    url: '/open/districts/list',
    method: 'get',
    params
  })
}
