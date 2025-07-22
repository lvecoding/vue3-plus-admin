<template>
  <section
    :class="['ai-chat-container', show && 'active-chat-container']"
    :style="{ height: isPc ? 'auto' : contentHeight + 'px' }"
  >
    <header class="chat-header">
      <el-icon v-if="!isPc && show" class="icon-close" @click="handleClose"><CircleClose /></el-icon>
    </header>

    <!-- 聊天内容 -->
    <main ref="messagesRef" class="chat-body">
      <chat-message
        v-for="(message, index) in messageList"
        :key="index"
        :message="message"
        :is-stream="isStreaming && index === messageList.length - 1"
        @insert-text="handleSendMessage"
      />

      <!-- 没有消息列表时展示问候语 -->
      <template v-if="!messageList.length">
        <empty-message />
      </template>
    </main>

    <footer class="chat-footer">
      <el-input v-model="content" :placeholder="$t('请输入您的问题')" class="chat-ai-input" @keyup.enter="sendMessage('')">
        <template #suffix>
          <!-- 停止会话 -->
          <template v-if="isStreaming">
            <el-tooltip class="box-item" effect="dark" :content="$t('停止生成')" placement="top">
              <img src="../../../assets/images/icon-stop.png" class="icon-stop" @click="stopStreaming" />
            </el-tooltip>
          </template>
          <template v-else>
            <!-- 发送 -->
            <el-tooltip v-if="!content?.length" effect="dark" :content="$t('请输入您的问题')" placement="top">
              <div class="send-btn fs-14">
                <img src="../../../assets/images/sendArrow.svg" class="icon-arrow" />
              </div>
            </el-tooltip>
            <div v-else class="send-btn active-send-btn" @click="sendMessage('')">
              <img src="../../../assets/images/sendArrow.svg" class="icon-arrow" />
            </div>
          </template>
        </template>
      </el-input>
    </footer>
  </section>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { ref } from 'vue'
import { nextTick } from 'vue'
import { onMounted } from 'vue'
import ChatMessage from './ChatMessage.vue'
import EmptyMessage from './EmptyMessage.vue'
import { sendAIMessage } from '@/api/ai'
import useAppStore from '@/store/modules/app'
import { DeviceType } from '@/utils/deviceDetector'

const KEY = 'AI_CUSTOMER_SERVICE_ID'
const MESSAGE_LIST_KEY = 'AI_CUSTOMER_SERVICE_ID_MESSAGE_LIST'
const emit = defineEmits(['update:modelValue'])
const list = JSON.parse(sessionStorage.getItem(MESSAGE_LIST_KEY) || '[]')
const isPc = computed(() => useAppStore()?.deviceType === DeviceType.PC)
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
let show = ref<boolean>(false)
let content = ref<string>('')
let messageList = ref<
  {
    role?: string
    content?: string
    timestamp?: Date
  }[]
>(list)
let chatId = localStorage.getItem(KEY) || ''
let isStreaming = ref<boolean>(false)
let messagesRef = ref<HTMLElement | null>(null)
watch(
  () => props.modelValue,
  newVal => {
    show.value = newVal
  },
  { immediate: true }
)

/** 发送消息 */
const handleSendMessage = value => {
  sendMessage(value)
}
// 修改发送消息函数
const sendMessage = async value => {
  if (isStreaming.value) return
  if (!content.value.trim() && !value) return

  const messageContent = value || content.value.trim()

  // 添加用户消息
  const userMessage = {
    role: 'user',
    content: messageContent,
    timestamp: new Date()
  }
  messageList.value.push(userMessage)

  // 清空输入
  !value && (content.value = '')
  // adjustTextareaHeight()

  // 准备发送数据
  const formData = new FormData()
  if (messageContent) {
    formData.append('prompt', messageContent)
  }
  // selectedFiles.value.forEach(file => {
  //   formData.append('files', file)
  // })

  // 添加助手消息占位
  const assistantMessage = {
    role: 'assistant',
    content: '',
    timestamp: new Date()
  }
  messageList.value.push(assistantMessage)
  isStreaming.value = true
  nextTick(() => {
    // 确保消息列表更新后滚动到底部
    scrollToBottom()
  })
  try {
    const reader: any = await sendAIMessage(formData, chatId)
    const decoder = new TextDecoder('utf-8')
    let accumulatedContent = '' // 添加累积内容变量

    while (isStreaming.value) {
      try {
        const { value, done } = await reader.read()
        console.error('读取流:', value, done)
        if (done) break

        // 累积新内容
        accumulatedContent += decoder.decode(value) // 追加新内容

        await nextTick(() => {
          // 更新消息，使用累积的内容
          const updatedMessage = {
            ...assistantMessage,
            content: accumulatedContent // 使用累积的内容
          }
          const lastIndex = messageList.value.length - 1
          messageList.value.splice(lastIndex, 1, updatedMessage)

          console.log('更新后的消息:', updatedMessage, messageList.value)
        })
        sessionStorage.setItem(MESSAGE_LIST_KEY, JSON.stringify(messageList.value)) // 缓存当前的聊天记录
        await scrollToBottom()
      } catch (readError) {
        console.error('读取流错误:', readError)
        break
      }
    }
    reader?.cancel()
  } catch (error) {
    console.error('发送消息失败:', error)
    assistantMessage.content = '抱歉，发生了错误，请稍后重试。'
  } finally {
    isStreaming.value = false
    await scrollToBottom()
  }
}
/** 停止接收流数据 */
const stopStreaming = () => {
  isStreaming.value = false
  const lastIndex = messageList.value?.length - 1
  if (!messageList.value?.[lastIndex]?.content) {
    messageList.value.splice(lastIndex, 1) // 如果累积内容为空，则移除占位消息
  }
}
/** 滚动到底部 */
const scrollToBottom = async () => {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

/** 关闭聊天框 */
const handleClose = () => {
  emit('update:modelValue', false)
}

let contentHeight = ref(0)
onMounted(() => {
  chatId = Date.now() + ''
  localStorage.setItem(KEY, chatId)
  // 设置延时，等待动画结束滚动到底部
  setTimeout(() => {
    scrollToBottom()
  }, 400)

  if (!isPc.value) {
    const visualViewport = window.visualViewport
    if (visualViewport) {
      contentHeight.value = visualViewport.height
    } else {
      // 兼容方案
      contentHeight.value = window.innerHeight
    }
    console.log('查看高度==>', contentHeight.value)
  }
})
</script>

<style lang="scss" scoped>
.ai-chat-container {
  position: absolute;
  bottom: 0;
  right: 20px;
  width: 0;
  height: 0;
  opacity: 0;

  // background-color: var(--page-bg-color);
  background-color: #fff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s;
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 20px;
    .icon-close {
      font-size: 20px;
      cursor: pointer;
      &:hover {
        color: var(--text-color-theme);
      }
    }
  }
  .chat-body {
    flex: 1;
    overflow: auto;
    padding: 20px;
  }
  .chat-footer {
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 50px 0 16px;
    background-color: #fff;
    :deep(.el-input__wrapper) {
      border-radius: 36px;
      box-shadow: 4px 4px 10px 6px rgb(0 0 0 / 6%);
      height: 48px;
      border: none;
      font-size: 16px;
      padding-left: 20px;
      padding-right: 20px;
    }
    .send-btn {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: #9e9e9e;
      background: rgb(203 203 203 / 100%);
      cursor: not-allowed;
    }
    .active-send-btn {
      background: linear-gradient(152.74deg, #8a22c2 1.94%, #8500f1 83%);
      color: #fff;
      cursor: pointer;
    }
  }
}
.active-chat-container {
  width: 450px;
  height: 70vh;
  box-shadow: rgb(15 15 15 / 16%) 0 5px 40px 0;
  opacity: 1;
}
.icon-stop {
  width: 34px;
  height: 34px;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 1024px) {
  .ai-chat-container {
    position: fixed;
    z-index: 99999;
    bottom: 0;
    right: 0;
    padding-top: 120px;
    padding-bottom: 20px;
    border-radius: 0;
    box-sizing: border-box;
  }
  .active-chat-container {
    width: 100vw;
    height: 100vh;
    .chat-footer {
      height: 120px;
      width: var(--page-content-width);
      margin: 0 auto;
      :deep(.el-input__wrapper) {
        height: 100px;
        font-size: 32px;
        border-radius: 60px;
        padding-left: 32px;
      }
      :deep(.el-input__inner) {
        height: 80px !important;
      }
      .send-btn {
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .chat-body {
      // padding: 20px 32px;
      width: var(--page-content-width);
      margin: 0 auto;
    }
    .chat-header {
      width: var(--page-content-width);
      margin: 0 auto;
      padding: 20px 0;
    }
  }
  .icon-stop {
    width: 56px;
    height: 56px;
  }
  .icon-close {
    font-size: 50px !important;
  }
}
</style>
