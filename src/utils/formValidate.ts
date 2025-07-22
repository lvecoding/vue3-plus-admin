import { validateBankCardNumber, validateIdCard, validPhone } from './validate'

/** 表单校验项：身份证 */
export const handleValidateFormIdCard = (_, value, callback) => {
  if (!value) {
    callback()
    return
  }
  if (!validateIdCard(value)) {
    callback(new Error('身份证号码格式不正确'))
  } else {
    callback()
  }
}

/** 表单校验项：银行号 */
export const handleValidateFormBankNo = (_, value, callback) => {
  if (!value) {
    callback()
    return
  }
  if (!validateBankCardNumber(value)) {
    callback(new Error('银行卡格式不正确'))
  } else {
    callback()
  }
}

/** 表单校验项：手机号码 */
export const handleValidateFormPhone = (_, value, callback) => {
  if (!value) {
    callback()
    return
  }
  if (!validPhone(value)) {
    callback(new Error('手机号码格式不正确'))
  } else {
    callback()
  }
}

/** 限制日期选择器不能选择100年前的数据 */
export const disabledHundredYears = time => {
  const now = new Date()
  const minDate = new Date(now)
  minDate.setFullYear(now.getFullYear() - 100)

  const maxDate = new Date(now)
  maxDate.setFullYear(now.getFullYear())

  return time < minDate || time > maxDate
}

/** 限制日期选择器不能选中100年前的数据，但是可以选中未来时间 */
export const disabledHundredYearsWithoutNow = time => {
  const now = new Date()
  const minDate = new Date(now)
  minDate.setFullYear(now.getFullYear() - 100)

  return time < minDate
}

/** 校验注册密码 */
export const handleValidatePassword = (_, value, callback) => {
  // 至少包含数字或大小写字母中的两种类型
  const hasNumber = /\d/.test(value)
  const hasLower = /[a-z]/.test(value)
  const hasUpper = /[A-Z]/.test(value)
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\,.<>\/?]/.test(value)

  // 计算基本类型满足数量
  let typeCount = 0
  if (hasNumber) typeCount++
  if (hasLower) typeCount++
  if (hasUpper) typeCount++
  if (hasSpecialChar) typeCount++

  if (typeCount < 2) {
    callback(new Error('密码至少包含数字、小写字母、大写字母、特殊字符中的两种'))
  } else {
    callback()
  }
}

/** 校验注册资金 */
export const handleValidateCapital = (_, value, callback) => {
  if (!value) {
    callback()
    return
  }
  const capital = parseFloat(value)
  if (capital > 100000000000) {
    callback(new Error('注册资金不能超过一千亿'))
  } else {
    callback()
  }
}
