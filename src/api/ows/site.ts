/*
 * @Description:
 * @Author: Tobi
 * @version:
 * @Date: 2025-04-01 13:48:35
 * @LastEditors: Tobi
 * @LastEditTime: 2025-04-08 09:43:20
 */
import request from '@/utils/request'

// 查询网站信息
export function getSite() {
  return request({
    url: '/open/site/get',
    method: 'get'
  })
}

// 更新网站信息
export function updateSite(data) {
  return request({
    url: '/site/update',
    method: 'post',
    data
  })
}

// 协议内容查询

export function siteProtocol() {
  return request({
    url: '/open/site/protocol',
    method: 'get'
  })
}
