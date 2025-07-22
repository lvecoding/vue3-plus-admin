import request from '@/utils/request'

// 查询商品分类列表
export function listProductType(params) {
  return request({
    url: '/productType/listTree',
    method: 'get',
    params
  })
}

// 新增商品分类
export function addProductType(data) {
  return request({
    url: '/productType/save',
    method: 'post',
    data
  })
}

// 修改商品分类
export function updateProductType(data) {
  return request({
    url: '/productType/update',
    method: 'post',
    data
  })
}

// 删除商品分类
export function deleteProductType(id) {
  return request({
    url: `/productType/remove/${id}`,
    method: 'delete'
  })
}

// 首页查询商品分类
export function homeProductType() {
  return request({
    url: `/open/productType/listTree`,
    method: 'get'
  })
}
