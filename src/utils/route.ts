/** 路由跳转 */
export const handleGoPath = (path: string) => {
  if (!path) {
    return
  }
  window.open(path, path.includes('Vue3PlusAdmin.com') || path.includes('localhost') ? '_self' : '_blank')
}
