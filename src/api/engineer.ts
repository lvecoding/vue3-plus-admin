import request from '@/utils/request'

// 搜索工程师
export const listEngineer = (data, params = {}) => {
  return request({
    url: '/engineer/page',
    method: 'post',
    data,
    params
  })
}

/** 分页查询我的工程师列表 */
export const listMyEngineer = params => {
  return request({
    url: '/cust_engineer/page',
    method: 'get',
    params
  })
}

// 查询工程师详情
export const engineerDetail = id => {
  return request({
    url: `/engineer/get_detail_cust/${id}`,
    method: 'get'
  })
}

// 工程师收藏
export const engineerCollect = data => {
  return request({
    url: `/cust_engineer/collect`,
    method: 'post',
    data
  })
}

// 删除我的工程师
export const engineerUnCollect = id => {
  return request({
    url: `/cust_engineer/remove/${id}`,
    method: 'delete'
  })
}

// 查询是否收藏
export const isEngineerCollect = id => {
  return request({
    url: `/cust_engineer/check_collect/${id}`,
    method: 'get',
    params: {
      custId: id
    }
  })
}

// 已获简历-我的工程师-状态修改
export const setStatusResumeReceive = data => {
  return request({
    url: `/cust_engineer/resume_received`,
    method: 'post',
    data
  })
}

// 已获简历-我的工程师-状态修改
export const setStatusInappropriate = data => {
  return request({
    url: `/cust_engineer/inappropriate`,
    method: 'post',
    data
  })
}
