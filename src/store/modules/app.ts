import i18next from 'i18next'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { DeviceType, useDeviceDetection } from '@/utils/deviceDetector'

const storedSelectProject = localStorage.getItem('selectProject')
const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false,
      hide: false
    },
    device: 'desktop',
    deviceType: DeviceType.MOBILE, // 默认是移动端环境
    size: Cookies.get('size') || 'default',
    language: Cookies.get('language') || 'zh_CN',
    showHomeAnimation: true,
    unReadNum: 0, // 未读消息总数
    unReadInfo: {}, // 未读消息数据
    socketInstance: null, // 消息socket实例
    AIMessageList: [], // AI客服消息列表
    selectProject: storedSelectProject ? JSON.parse(storedSelectProject) : null, // 全局选中查看详情的项目
    // 添加监听器引用
    deviceListener: null as (() => void) | null
  }),
  actions: {
    initDeviceListener() {
      // 移除之前的监听器
      this.removeDeviceListener()

      const { nowDeviceType, onDeviceChange } = useDeviceDetection()

      // 初始设置
      this.deviceType = nowDeviceType.value

      // 添加变化监听
      this.deviceListener = onDeviceChange(newType => {
        this.deviceType = newType
      })
    },

    removeDeviceListener() {
      if (this.deviceListener) {
        this.deviceListener()
        this.deviceListener = null
      }
    },
    toggleSideBar(withoutAnimation) {
      if (this.sidebar.hide) {
        return false
      }
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = withoutAnimation
      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    closeSideBar({ withoutAnimation }) {
      Cookies.set('sidebarStatus', 0)
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    toggleDevice(device) {
      this.device = device
    },
    setSize(size) {
      this.size = size
      Cookies.set('size', size)
    },
    setLanguage(language) {
      this.language = language
      i18next.changeLanguage(language)
      Cookies.set('language', language)
    },
    toggleSideBarHide(status) {
      this.sidebar.hide = status
    },
    setShowHomeAnimation(isShow) {
      this.showHomeAnimation = isShow
    },
    setSelectProject(project) {
      this.selectProject = project
      localStorage.setItem('selectProject', JSON.stringify(project))
    }
  }
})

export default useAppStore
