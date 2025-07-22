import request from '@/utils/request'

// 获取验证码
export function getCode(data) {
  return request({
    url: '/verification/start',
    method: 'post',
    data
  })
}

// 校验验证码
export function checkCode(data) {
  return request({
    url: '/verification/check',
    method: 'post',
    data
  })
}

/** 校验图形验证码 */
export function checkCaptchaImage(data) {
  return request({
    url: '/captchaImage/check',
    method: 'post',
    data
  })
}
