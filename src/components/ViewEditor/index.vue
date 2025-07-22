<template>
  <div class="view-editor-container"><umo-editor ref="viewerRef" v-bind="options" /></div>
</template>

<script lang="ts" setup>
import { UmoEditor } from '@umoteam/editor'
import { nextTick, onMounted, ref } from 'vue'
const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})
const viewerRef = ref()
const options = ref({
  editorKey: 'view-editor-key',
  document: {
    title: '预览文档',
    readOnly: true,
    content: props.content // 直接使用传入的内容
  },

  page: {
    showBookmark: false,
    showBreakMarks: false,
    showLineNumber: false,
    showToc: false
  }
})
onMounted(() => {
  nextTick(() => {
    viewerRef.value.setToolbar({ mode: 'ribbon', show: false })
  })
})
</script>

<style lang="scss" scoped>
.view-editor-container {
  :deep(.umo-toolbar) {
    display: none;
  }
  :deep(.umo-page-node-header) {
    display: none;
  }
  :deep(.umo-zoomable-container) {
    padding: 0;
  }
  :deep(.umo-editor-container .umo-main) {
    background-color: #fff;
  }
  :deep(.umo-zoomable-container .umo-zoomable-content) {
    // box-shadow: none;
  }
  :deep(.umo-footer) {
    display: none;
  }
  :deep(.umo-page-node-footer) {
    display: none;
  }
  :deep(.umo-editor-content .umo-editor) {
    padding: 10px;
  }
}
</style>
<style lang="scss" scoped>
:deep(.umo-code-block .umo-node-code-block-content code) {
  font-size: 14px;
}
</style>
