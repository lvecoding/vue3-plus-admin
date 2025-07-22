import dayjs from 'dayjs'

// 在script部分添加
export const formatPrice = (price: string) => {
  let num = parseFloat(price)
  if (isNaN(num)) return price

  const units = ['', '万', '百万', '千万', '亿']
  let unitIndex = 0

  while (num >= 10000 && unitIndex < units.length - 1) {
    num /= 10000
    unitIndex++
  }

  if (!units[unitIndex]) {
    return '￥' + parseFloat(num.toFixed(0))
  }
  // 保留最多2位小数
  return parseFloat(num.toFixed(0)) + units[unitIndex]
}

/**
 * 格式化两个日期之间的时间段
 * @param startDate 开始日期 (Date对象或可被dayjs解析的字符串)
 * @param endDate 结束日期 (Date对象或可被dayjs解析的字符串)
 * @returns 格式化的时间段字符串 (xx月 或 xx年xx月)
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string = new Date()): string => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)

  if (!start.isValid() || !end.isValid()) return ''

  // 计算月份差
  const months = end.diff(start, 'month')
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years > 0) {
    return `${years}年${remainingMonths > 0 ? `${remainingMonths}个月` : ''}`.replace(/年$/, '年')
  }
  if (months <= 0) {
    return '不满一个月'
  }
  return `${months}个月`
}
