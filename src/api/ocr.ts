import request from '@/utils/request'

// 营业执照识别
export const imageRecognition = params => {
  return request({
    url: '/ocr/socialCredit',
    method: 'post',
    params
  })
}

// 身份证识别
export const cardRecognition = params => {
  return request({
    url: '/ocr/idCard',
    method: 'post',
    params
  })
}
