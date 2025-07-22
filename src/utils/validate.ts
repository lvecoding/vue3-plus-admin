/**
 * 路径匹配器
 * @param {string} pattern
 * @param {string} path
 * @returns {Boolean}
 */
export function isPathMatch(pattern, path) {
  const regexPattern = pattern.replace(/\//g, '\\/').replace(/\*\*/g, '.*').replace(/\*/g, '[^\\/]*')
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path)
}

/**
 * 判断value字符串是否为空
 * @param {string} value
 * @returns {Boolean}
 */
export function isEmpty(value) {
  if (value == null || value == '' || value == undefined || value == 'undefined') {
    return true
  }
  return false
}

/**
 * 判断url是否是http或https
 * @param {string} url
 * @returns {Boolean}
 */
export function isHttp(url) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} phone
 * @returns {Boolean}
 */
export function validPhone(phone) {
  const reg = /^1[3-9]\d{9}$/ // 手机号正则表达式
  return reg.test(phone)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 校验身份证号码
 * @param idCard 身份证号码
 * @returns 是否有效
 */
export const validateIdCard = (idCard: string): boolean => {
  // 长度校验
  if (idCard.length !== 18) {
    return false
  }

  // 格式校验
  const reg = /^\d{17}(\d|X)$/
  if (!reg.test(idCard)) {
    return false
  }

  // 校验码校验
  const weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 权重因子
  const checkCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码对应值
  let sum = 0

  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weight[i]
  }

  const mod = sum % 11
  const lastChar = idCard[17].toUpperCase()

  return lastChar === checkCode[mod]
}

/**
 * 校验银行卡号
 * @param bankCardNumber 银行卡卡号
 * @returns 是否有效
 */
export const validateBankCardNumber = (bankno: string): boolean => {
  let lastNum = bankno.substr(bankno.length - 1, 1) //取出最后一位（与luhm进行比较）
  let first15Num = bankno.substr(0, bankno.length - 1) //前15或18位
  let newArr = []
  for (let i = first15Num.length - 1; i > -1; i--) {
    //前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1))
  }
  let arrJiShu = [] //奇数位*2的积 <9
  let arrJiShu2 = [] //奇数位*2的积 >9
  let arrOuShu = [] //偶数位数组
  for (let j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 == 1) {
      //奇数位
      if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2)
      else arrJiShu2.push(parseInt(newArr[j]) * 2)
    } //偶数位
    else arrOuShu.push(newArr[j])
  }
  let jishu_child1 = [] //奇数位*2 >9 的分割之后的数组个位数
  let jishu_child2 = [] //奇数位*2 >9 的分割之后的数组十位数
  for (let h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10)
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10)
  }
  let sumJiShu: any = 0 //奇数位*2 < 9 的数组之和
  let sumOuShu: any = 0 //偶数位数组之和
  let sumJiShuChild1: any = 0 //奇数位*2 >9 的分割之后的数组个位数之和
  let sumJiShuChild2: any = 0 //奇数位*2 >9 的分割之后的数组十位数之和
  let sumTotal: any = 0
  for (let m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m])
  }
  for (let n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n])
  }
  for (let p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p])
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p])
  }
  //计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2)
  //计算Luhm值
  let k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10
  let luhm: any = 10 - k
  let my = false
  if (lastNum == luhm) {
    //Luhm验证通过
    my = true
  } else {
    //银行卡号必须符合Luhm校验
    my = false
  }
  return my
}
