import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

/** 客户登录 */
export function smsLogin(data) {
  return request({
    url: '/login_phone',
    headers: {
      isToken: false
    },
    data,
    method: 'post'
  })
}

/** 手机短信登录 */
export function customerLogin(data) {
  return request({
    url: '/login_cust',
    headers: {
      isToken: false
    },
    data,
    method: 'post'
  })
}

/** 忘记密码 */
export function forgetPwd(data) {
  return request({
    url: '/forget_pwd',
    headers: {
      isToken: false
    },
    data,
    method: 'post'
  })
}
/** 直接入驻创业者 */
export function registerEntrepreneur(data) {
  return request({
    url: '/entrepreneur/register',
    data,
    method: 'post'
  })
}

/** 修改密码 */
export function modifyPwd(data) {
  return request({
    url: '/user/profile/updatePwd',
    data,
    method: 'put'
  })
}
