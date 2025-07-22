import request from '@/utils/request'

// 客户列表
export const listCustomer = params => {
  return request({
    url: '/cust_info/page',
    method: 'get',
    params
  })
}

// 禁用客户
export const disableCustomer = id => {
  return request({
    url: `/cust_info/disable/${id}`,
    method: 'post'
  })
}

// 启用客户
export const enableCustomer = id => {
  return request({
    url: `/cust_info/enable/${id}`,
    method: 'post'
  })
}

// 注销客户
export const logoutCustomer = id => {
  return request({
    url: `/cust_info/logoff/${id}`,
    method: 'post'
  })
}

// 审核用户
export const auditCustomer = data => {
  return request({
    url: `/cust_info/approve`,
    method: 'post',
    data
  })
}

// 查询客户信息
export const customerInfo = id => {
  return request({
    url: `/cust_info/get/${id}`,
    method: 'get'
  })
}

// 查询入驻用户详情
export const getUserProfile = () => {
  return request({
    url: `/user/profile`,
    method: 'get'
  })
}

// 修改入驻用户信息
export const updateUserProfile = data => {
  return request({
    url: `/user/profile`,
    method: 'put',
    data
  })
}

// 我的工程师列表
export const listCustEngineer = params => {
  return request({
    url: '/cust_engineer/page',
    method: 'get',
    params
  })
}

// 我的投资人列表
export const listCustInvestor = params => {
  return request({
    url: '/cust_investor/page',
    method: 'get',
    params
  })
}

// 所有投资人
export const listAllInvestor = data => {
  return request({
    url: '/investor/page',
    method: 'post',
    data
  })
}

// 提交实名认证
export const submitAuth = data => {
  return request({
    url: '/cust_info/submit_auth',
    method: 'post',
    data
  })
}

// 角色切换
export const switchRole = (data, newCustId) => {
  return request({
    url: `/switch_cust/${newCustId}`,
    method: 'post',
    data
  })
}

/** 创业者入驻审核信息 */
export const entrepreneurAudit = id => {
  return request({
    url: `/entrepreneur/get/${id}`,
    method: 'get'
  })
}
/** 工程师入驻审核 */
export const engineerAudit = id => {
  return request({
    url: `/engineer/get/${id}`,
    method: 'get'
  })
}
/** 代理商入驻审核信息 */
export const agentAudit = id => {
  return request({
    url: `/agent/get/${id}`,
    method: 'get'
  })
}
/** 供应商审核入驻信息 */
export const supplierAudit = id => {
  return request({
    url: `/supplier/get/${id}`,
    method: 'get'
  })
}
/** 投资人入驻审核 */
export const investorAudit = id => {
  return request({
    url: `/investor/get/${id}`,
    method: 'get'
  })
}

/** 查询客户分页列表，按照用户ID分组 */
export const listCustomerGroup = params => {
  return request({
    url: `/cust_info/page_group_by_user`,
    method: 'get',
    params
  })
}
/** 根据用户id查询客户详情 */
export const customerDetailByUserId = userId => {
  return request({
    url: `/cust_info/get_group_by_user/${userId}`,
    method: 'get',
    params: { userId }
  })
}
