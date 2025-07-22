export const isTextOverflow = (id: string) => {
  const element = document.getElementById(id) as HTMLElement
  return element.scrollWidth > element.clientWidth
}
import { ElMessage } from 'element-plus'
// 输入框长度限制并提示和截断
export const limitInput = (value, maxLength, errorMessage) => {
  if (value.length > maxLength) {
    ElMessage.error(errorMessage)
    return value.slice(0, maxLength)
  }
  return value
}
