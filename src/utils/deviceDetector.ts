// utils/deviceDetector.ts
import { ref } from 'vue'

export enum DeviceType {
  PC = 'pc',
  TABLET = 'tablet',
  MOBILE = 'mobile'
}

// 添加设备类型检测函数
const initialDeviceType = (): DeviceType => {
  // const width = window.innerWidth * (window.devicePixelRatio || 1)
  const width = window.innerWidth
  if (width > 1024) {
    return DeviceType.PC
  } else {
    return DeviceType.MOBILE
  }
}

export const useDeviceDetection = () => {
  const nowDeviceType = ref(initialDeviceType())

  const checkDeviceType = () => {
    nowDeviceType.value = initialDeviceType()
  }

  // 添加设备变化监听
  const onDeviceChange = (callback: (type: DeviceType) => void) => {
    const handler = () => {
      const newType = initialDeviceType()
      if (newType !== nowDeviceType.value) {
        nowDeviceType.value = newType
        callback(newType)
      }
    }

    window.addEventListener('resize', handler)

    // 返回移除监听的方法
    return () => {
      window.removeEventListener('resize', handler)
    }
  }

  return { nowDeviceType, onDeviceChange, checkDeviceType }
}
