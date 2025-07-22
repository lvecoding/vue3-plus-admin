<template>
  <router-view />
</template>

<script lang="ts" setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'
import useAppStore from './store/modules/app'
import { onMounted } from 'vue'
import { nextTick } from 'vue'

const appStore = useAppStore()
appStore.initDeviceListener()

const disableIOSZoom = () => {
  const viewport = document.querySelector('meta[name=viewport]')
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
  }
}

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
  disableIOSZoom()
})
</script>
