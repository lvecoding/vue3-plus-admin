<template>
  <umo-editor ref="editorRef" v-bind="options" />
</template>

<script setup lang="ts">
import { UmoEditor } from '@umoteam/editor'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import Paragraph from '@tiptap/extension-paragraph'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  onSave: {
    type: Function,
    default: null
  },
  fileSize: {
    type: Number,
    default: 30 //默认30M
  },
  autoSaveInterval: {
    type: Number,
    default: 60000 //默认1分钟间隔保存一次 1000毫秒 = 1秒 * 60
  },
  projectId: {
    type: Number,
    default: -1
  }
})

const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + 'file/upload' // 上传文件服务器地址

const emit = defineEmits(['update:onSave', 'update:attachmentUpload'])
const editorRef = ref<any>(null)
const templates = [
  {
    title: '工作任务',
    description: '工作任务模板',
    content:
      '<h1>工作任务</h1><h3>任务名称：</h3><p>[任务的简短描述]</p><h3>负责人：</h3><p>[执行任务的个人姓名]</p><h3>截止日期：</h3><p>[任务需要完成的日期]</p><h3>任务详情：</h3><ol><li>[任务步骤1]</li><li>[任务步骤2]</li><li>[任务步骤3]...</li></ol><h3>目标：</h3><p>[任务需要达成的具体目标或结果]</p><h3>备注：</h3><p>[任何额外信息或注意事项]</p>'
  },
  {
    title: '工作周报',
    description: '工作周报模板',
    content:
      '<h1>工作周报</h1><h2>本周工作总结</h2><hr /><h3>已完成工作：</h3><ul><li>[任务1名称]：[简要描述任务内容及完成情况]</li><li>[任务2名称]：[简要描述任务内容及完成情况]</li><li>...</li></ul><h3>进行中工作：</h3><ul><li>[任务1名称]：[简要描述任务当前进度和下一步计划]</li><li>[任务2名称]：[简要描述任务当前进度和下一步计划]</li><li>...</li></ul><h3>问题与挑战：</h3><ul><li>[问题1]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>[问题2]：[描述遇到的问题及当前解决方案或需要的支持]</li><li>...</li></ul><hr /><h2>下周工作计划</h2><h3>计划开展工作：</h3><ul><li>[任务1名称]：[简要描述下周计划开始的任务内容]</li><li>[任务2名称]：[简要描述下周计划开始的任务内容]</li><li>...</li></ul><h3>需要支持与资源：</h3><ul><li>[资源1]：[描述需要的资源或支持]</li><li>[资源2]：[描述需要的资源或支持]</li><li>...</li></ul>'
  }
]
const options = ref({
  editorKey: 'editor-key',
  toolbar: {
    defaultMode: 'classic',
    menus: ['base', 'insert', 'table', 'tools', 'export'],
    importWord: {
      enabled: false,
      async onCustomImportMethod() {
        return await Promise.resolve({
          value: '<p>测试导入word</p>'
        })
      }
    }
  },
  document: {
    title: '测试文档',
    content: props.content,
    // characterLimit: 10000,//不限制字数
    autoSave: {
      enabled: true,
      interval: props.autoSaveInterval
    }
  },
  extensions: [
    // 设置允许使用class和style进行插入html
    Paragraph.extend({
      addAttributes() {
        return {
          style: {
            default: null,
            rendered: true
          },
          class: {
            default: null,
            rendered: true
          }
        }
      }
    })
  ],
  page: {
    showBookmark: true
  },
  templates,
  cdnUrl: 'https://cdn.umodoc.com',
  shareUrl: 'https://umodoc.com',
  file: {
    maxSize: 1024 * 1024 * props.fileSize
  },
  ai: {
    assistant: {
      enabled: true,
      async onMessage() {
        return await Promise.resolve('<p>AI助手测试</p>')
      }
    }
  },
  user: {},
  users: [],
  async onSave(content: string, page: number, document: { content: string }) {
    // localStorage.setItem('document.content', document.content)
    console.log('document.content', document.content)
    console.log('onSave', { content, page, document })
    editorRef.value && editorRef.value.setContent(document.content)
    emit('update:onSave', document.content)
    return new Promise((resolve, reject) => {
      //需要返回一个Promise给编辑器来判断保存是否成功
      setTimeout(() => {
        const success = true
        if (success) {
          resolve('自动保存成功')
        } else {
          reject(new Error('操作失败'))
        }
      }, 500)
    })
  },
  async onFileUpload(file: File & { url?: string }) {
    if (!file) {
      throw new Error('没有找到要上传的文件')
    }
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(uploadFileUrl, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: getToken() // 如果需要认证
      }
    })
    return response
      .json()
      .then(data => {
        if (data.code === 200) {
          console.log(data.data, 'data.data')
          emit('update:attachmentUpload', { file: file, callbackData: data.data })
          return {
            id: data.data.fileId,
            url: data.data.fileUrl,
            name: file.name,
            type: file.type,
            size: file.size
          }
        } else {
          ElMessage.error(`${data.msg}`)
        }
      })
      .catch(error => {
        ElMessage.error(`${error?.message || '上传失败'}`)
      })
  },
  onFileDelete(id: string, url: string) {
    console.log(id, url)
  }
})
defineExpose({ editorRef })
</script>

<style lang="scss">
.umo-code-block .umo-node-code-block-content code {
  font-size: 14px !important;
}
.umo-toolbar-actions-button:not(:last-child) {
  display: none !important;
}
.umo-editor-placeholder-text::before {
  content: "点击 + 插入组件";
  display: block;
  color: #999;
  font-style: italic;
  user-select: none;
  pointer-events: none;
}
.umo-footer {
  display: none;
}
.umo-page-node-footer {
  display: none;
}
.umo-dropdown__menu--right > div:nth-child(1) {
  display: none;
}
.umo-toolbar-actions {
  display: none !important;
}
.umo-page-node-header {
  display: none !important;
}
</style>
