<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import { onUnmounted, useTemplateRef } from 'vue'

const { loadStatus, fn } = defineProps<{
  loadStatus: number
  fn: (reload: boolean) => Promise<void>
}>()

const loadToolbarFotterTarget = useTemplateRef('load-toolbar-header')

const { stop } = useIntersectionObserver(loadToolbarFotterTarget, ([{ isIntersecting }]) => {
  isIntersecting && fn(false)
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div v-if="loadStatus !== 3" class="load-toolbar-header flex-center" ref="load-toolbar-header">
    <span v-if="loadStatus === 2" class="loading">加载数据中...</span>
    <span v-else class="loading">加载更多消息</span>
  </div>
</template>

<style lang="scss" scoped>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.load-toolbar-header {
  height: 38px;
  width: 100%;
  font-size: 13px;
  .loading {
    color: #999;
  }
}
</style>
