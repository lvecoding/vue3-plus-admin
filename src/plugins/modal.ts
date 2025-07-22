import useAppStore from '@/store/modules/app'
import { DeviceType } from '@/utils/deviceDetector'
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus'
import { t } from 'i18next'
import { showToast } from 'vant'
let loadingInstance

export default {
  // 消息提示
  msg(content) {
    ElMessage.info({
      message: t(content),
      grouping: true
    })
  },
  // 错误消息
  msgError(content) {
    const isPc = useAppStore()?.deviceType === DeviceType.PC
    if (isPc) {
      ElMessage.error(t(content))
      return
    }
    showToast(t(content))
  },
  // 成功消息
  msgSuccess(content) {
    const isPc = useAppStore()?.deviceType === DeviceType.PC
    if (isPc) {
      ElMessage.success(t(content))
      return
    }
    showToast(t(content))
  },
  // 警告消息
  msgWarning(content) {
    ElMessage.warning(t(content))
  },
  // 弹出提示
  alert(content) {
    ElMessageBox.alert(t(content), t('系统提示'))
  },
  // 错误提示
  alertError(content) {
    ElMessageBox.alert(t(content), t('系统提示'), { type: 'error' })
  },
  // 成功提示
  alertSuccess(content) {
    ElMessageBox.alert(t(content), t('系统提示'), { type: 'success' })
  },
  // 警告提示
  alertWarning(content, options = {}) {
    return ElMessageBox.alert(t(content), t('系统提示'), { type: 'warning', ...options })
  },
  // 通知提示
  notify(content) {
    ElNotification.info(t(content))
  },
  // 错误通知
  notifyError(content) {
    ElNotification.error(t(content))
  },
  // 成功通知
  notifySuccess(content) {
    ElNotification.success(t(content))
  },
  // 警告通知
  notifyWarning(content) {
    ElNotification.warning(t(content))
  },
  // 确认窗体
  confirm(content) {
    return ElMessageBox.confirm(content, t('系统提示'), {
      confirmButtonText: t('确定'),
      cancelButtonText: t('取消'),
      type: 'warning'
    })
  },
  // 提交内容
  prompt(content) {
    return ElMessageBox.prompt(content, t('系统提示'), {
      confirmButtonText: t('确定'),
      cancelButtonText: t('取消'),
      type: 'warning'
    })
  },
  // 打开遮罩层
  loading(content) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: t(content),
      background: 'rgba(0, 0, 0, 0.7)'
    })
  },
  // 关闭遮罩层
  closeLoading() {
    loadingInstance.close()
  }
}
