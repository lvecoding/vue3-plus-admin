<template>
  <div class="message fs-14" :class="{ 'message-user': isUser }">
    <template v-if="isUser">
      <div
        v-if="isPc"
        ref="copyRef"
        :class="['icon-copy fs-18', showCopy ? 'show' : '']"
        @click="copyContent"
        @mouseleave="handleMouseLeave"
      >
        <el-icon><DocumentCopy /></el-icon>
      </div>
      <div ref="contentRef" class="user" @mouseenter="showCopy = true" @mouseleave="handleMouseLeave">
        {{ message.content }}
      </div>
    </template>
    <template v-else>
      <div class="message-content">
        <img src="../../../assets/images/icon-customer-server.png" class="avatar" />
        <div class="immsg-text" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <div class="text markdown-content" ref="contentRef" v-html="processedContent"></div>
          <div v-if="isStream && !processedContent" class="animate-text-loading">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      <div
        v-if="isPc"
        ref="copyRef"
        :class="['icon-copy', showCopy ? 'show' : '']"
        @click="copyContent"
        @mouseleave="handleMouseLeave"
      >
        <el-icon><DocumentCopy /></el-icon>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick, ref, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { getCurrentInstance } from 'vue'
import useAppStore from '@/store/modules/app'
import { DeviceType } from '@/utils/deviceDetector'

const { proxy } = getCurrentInstance()
const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isStream: {
    type: Boolean,
    default: false
  }
})

const appStore = useAppStore()
const isPc = computed(() => appStore.deviceType === DeviceType.PC) // 是否是手机环境
const isUser = computed(() => props.message.role === 'user')
const contentRef = ref(null)
const copyRef = ref(null)
let showCopy = ref(false)
const emit = defineEmits(['insertText'])
// 监听内容变化
watch(
  () => props.message.content,
  () => {
    if (!isUser.value) {
      highlightCode()
    }
  }
)
watch(
  () => props.isStream,
  () => {
    if (!props.isStream) {
      setupClickableItems()
    }
  }
)
// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  sanitize: false
})

// 处理内容
const processContent = content => {
  if (!content) return ''

  // 预处理：将列表项转换为可点击文案
  const listItemToClickable = text => {
    return text.replace(/^([-]\s+)([^*].+)/gm, (match, prefix, textContent) => {
      return `${prefix}<span class="clickable-item" data-text="${encodeURIComponent(textContent.trim())}">${textContent.trim()}</span>`
    })
  }

  // 分析内容中的 think 标签
  let result = ''
  let isInThinkBlock = false
  let currentBlock = ''

  // 逐字符分析，处理 think 标签
  for (let i = 0; i < content.length; i++) {
    if (content.slice(i, i + 7) === '<think>') {
      isInThinkBlock = true
      if (currentBlock) {
        // 将之前的普通内容转换为 HTML
        result += marked.parse(currentBlock)
      }
      currentBlock = ''
      i += 6 // 跳过 <think>
      continue
    }

    if (content.slice(i, i + 8) === '</think>') {
      isInThinkBlock = false
      // 将 think 块包装在特殊 div 中
      result += `<div class="think-block">${marked.parse(currentBlock)}</div>`
      currentBlock = ''
      i += 7 // 跳过 </think>
      continue
    }

    currentBlock += content[i]
  }

  // 处理剩余内容
  if (currentBlock) {
    result += isInThinkBlock
      ? `<div class="think-block">${marked.parse(listItemToClickable(currentBlock))}</div>`
      : marked.parse(listItemToClickable(currentBlock))
  }

  const cleanHtml = DOMPurify.sanitize(result, {
    ADD_TAGS: ['think', 'code', 'pre', 'span'],
    ADD_ATTR: ['class', 'language', 'data-text']
  })

  // 在净化后的 HTML 中查找代码块并添加复制按钮
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = cleanHtml

  // 查找所有代码块
  const preElements = tempDiv.querySelectorAll('pre')
  preElements.forEach(pre => {
    const code = pre.querySelector('code')
    if (code) {
      // 创建包装器
      const wrapper = document.createElement('div')
      wrapper.className = 'code-block-wrapper'

      // 添加复制按钮
      const copyBtn = document.createElement('button')
      copyBtn.className = 'code-copy-button'
      copyBtn.title = '复制代码'
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="code-copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      `

      // 添加成功消息
      const successMsg = document.createElement('div')
      successMsg.className = 'copy-success-message'
      successMsg.textContent = '已复制!'

      // 组装结构
      wrapper.appendChild(copyBtn)
      wrapper.appendChild(pre.cloneNode(true))
      wrapper.appendChild(successMsg)

      // 替换原始的 pre 元素
      pre.parentNode.replaceChild(wrapper, pre)
    }
  })

  return tempDiv.innerHTML
}

// 修改计算属性
const processedContent = computed(() => {
  if (!props.message.content) return ''
  return processContent(props.message.content)
})

// 为代码块添加复制功能
const setupCodeBlockCopyButtons = () => {
  if (!contentRef.value) return

  const codeBlocks = contentRef.value.querySelectorAll('.code-block-wrapper')
  codeBlocks.forEach(block => {
    const copyButton = block.querySelector('.code-copy-button')
    const codeElement = block.querySelector('code')
    const successMessage = block.querySelector('.copy-success-message')

    if (copyButton && codeElement) {
      // 移除旧的事件监听器
      const newCopyButton = copyButton.cloneNode(true)
      copyButton.parentNode.replaceChild(newCopyButton, copyButton)

      // 添加新的事件监听器
      newCopyButton.addEventListener('click', async e => {
        e.preventDefault()
        e.stopPropagation()
        try {
          const code = codeElement.textContent || ''
          await navigator.clipboard.writeText(code)

          // 显示成功消息
          if (successMessage) {
            successMessage.classList.add('visible')
            setTimeout(() => {
              successMessage.classList.remove('visible')
            }, 2000)
          }
        } catch (err) {
          console.error('复制代码失败:', err)
        }
      })
    }
  })
}

const setupClickableItems = () => {
  if (!contentRef.value) return

  contentRef.value.querySelectorAll('.clickable-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault()
      const text = decodeURIComponent(item.dataset.text || '')
      emit('insertText', text)
    })
  })
}

// 在内容更新后手动应用高亮和设置复制按钮
const highlightCode = async () => {
  await nextTick()
  if (contentRef.value) {
    contentRef.value.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block)
    })

    // 设置代码块复制按钮
    setupCodeBlockCopyButtons()
  }
}

// 复制内容到剪贴板
const copyContent = async () => {
  try {
    // 获取纯文本内容
    let textToCopy = props.message.content

    // 如果是AI回复，需要去除HTML标签
    if (!isUser.value && contentRef.value) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = processedContent.value
      textToCopy = tempDiv.textContent || tempDiv.innerText || ''
    }

    // 兼容性处理
    if (navigator.clipboard) {
      // 标准现代浏览器
      await navigator.clipboard.writeText(textToCopy)
    } else {
      // 兼容旧浏览器
      const textarea = document.createElement('textarea')
      textarea.value = textToCopy
      textarea.style.position = 'fixed' // 避免滚动到底部
      document.body.appendChild(textarea)
      textarea.select()

      try {
        document.execCommand('copy')
        proxy.$modal.msgSuccess('复制成功')
      } catch (err) {
        proxy.$modal.msgError('复制失败，请手动复制')
      } finally {
        document.body.removeChild(textarea)
      }
      return
    }

    proxy.$modal.msgSuccess('复制成功')
  } catch (err) {
    console.error('复制失败:', err)
    proxy.$modal.msgError(`复制失败: ${err.message}`)
  }
}

/** 鼠标移入 */
const handleMouseEnter = () => {
  if (props.value?.isStream && !processedContent.value) return
  showCopy.value = true
}
/** 鼠标移开 */
const handleMouseLeave = () => {
  // 延时处理，避免鼠标快速移出时触发
  setTimeout(() => {
    if (contentRef.value && !contentRef.value.matches(':hover') && !copyRef.value.matches(':hover')) {
      showCopy.value = false
    }
  }, 300)
}

// 初始化时也执行一次
onMounted(() => {
  if (!isUser.value) {
    highlightCode()
  }
})

// const formatTime = timestamp => {
//   if (!timestamp) return ''
//   return new Date(timestamp).toLocaleTimeString()
// }
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  align-items: flex-end;
  margin-top: 16px;
  color: var(--text-title-color);
}
.message-user {
  justify-content: flex-end;
}
.message-content {
  max-width: calc(100% - 26px);
  display: flex;
  flex-direction: column;
  .avatar {
    height: 26px;
    width: 19px;
    margin-bottom: 10px;
  }
}
.immsg-text {
  box-sizing: border-box;
  min-height: 40px;
  min-width: 50px;
  height: auto;
  padding: 0 10px;
  border-radius: 0 8px 8px;

  // background: rgb(244 245 245 / 100%);
  background-color: #f6f6f6;
  color: var(--text-title-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.user {
  min-width: 30px;
  max-width: 300px;
  height: auto;
  border-radius: 8px 0 8px 8px;
  padding: 10px;
  color: var(--text-title-color);

  // background: rgb(141 0 255 / 12%);
  background-color: #edddf6;
}
.markdown-content {
  :deep(.clickable-item) {
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    color: var(--text-color-theme);
    text-decoration: underline;
  }
  :deep(a) {
    color: var(--text-color-theme);
    text-decoration: none;
  }
  :deep(table) {
    border-collapse: collapse;
    margin: 10px 0;
    width: 100%;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  :deep(th),
  :deep(td) {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  :deep(th) {
    background: rgb(0 0 0 / 5%);
    width: 200px;
  }
}
.animate-text-loading {
  display: inline-block;
  margin: 4px 16px;
}
.icon-copy {
  padding: 0 10px;
  opacity: 0;
  cursor: pointer;
  &:hover {
    color: var(--text-color-theme);
  }
}
.show {
  opacity: 1;
  transition: all 0.3s;
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 1024px) {
  .fs-20 {
    font-size: 38px !important;
  }
  .fs-14 {
    font-size: 28px !important;
  }
  .fs-16 {
    font-size: 32px !important;
  }
  .message-content {
    .avatar {
      height: 56px;
      width: 40px;
      margin-bottom: 20px;
    }
  }
  .message {
    margin-bottom: 30px;
  }
  .immsg-text {
    padding: 0 20px;
    line-height: 40px;
  }
  .user {
    padding: 20px;
    max-width: calc(100% - 100px);
    font-size: 32px;
  }
  .markdown-content {
    font-size: 32px;
  }
}
</style>
