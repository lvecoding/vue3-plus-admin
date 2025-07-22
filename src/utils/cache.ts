// 本地缓存工具
const storage = localStorage // 或sessionStorage

export const setCache = (key: string, value: any) => {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('缓存设置失败', e)
    storage.removeItem(key)
  }
}

export const getCache = (key: string) => {
  try {
    const data = storage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('缓存读取失败', e)
    return null
  }
}

export const clearCache = (key: string) => {
  storage.removeItem(key)
}
