<template>
  <section class="chat-box">
    <header class="el-header">
      <slot name="header"></slot>
    </header>
    <main class="main-content">
      <chat
        ref="my-chat"
        :items="chatList"
        data-source-mode="pulldown"
        :custom-render="customMessageRender"
        :onScrollLoadMore="getMessage"
        :callback="handleMessage"
      />
    </main>

    <div class="chat-footer">
      <chat-editor
        :members="members"
        :loading="loading"
        :status="status"
        :callback="handleMessage"
        @no-suitable="handleNoSuitable"
      />
    </div>
  </section>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import Chat from './chat/ChatPlus.vue'
import ChatEditor from './ChatEditor.vue'
import { ElMessage } from 'element-plus'
import { messageList } from '@/api/imessage'
import { StatusEnum } from './chat/types'
import useUserStore from '@/store/modules/user'
import defaultAvatar from '@/assets/images/default-avatar.png'
import { useTemplateRef, nextTick, watch, onUnmounted, onMounted } from 'vue'
import { connectWebsocket } from './subscribe'
import { getToken } from '@/utils/auth'
import useAppStore from '@/store/modules/app'

const emit = defineEmits(['readMessage', 'sendMessageSuccess', 'noSuitable'])
const props = defineProps({
  members: {
    type: Array,
    default: () => []
  },
  messageType: {
    type: String,
    default: 'IMESSAGE'
  },
  receiverId: {
    type: String,
    default: ''
  },
  sendId: {
    type: String,
    default: ''
  },
  receiveName: {
    type: String,
    default: ''
  },
  unRead: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  }
})
watch(
  () => props.sendId,
  () => {
    chatList.value = [] // 重置数据
    query.value.pageNum = 1
    getMessage()
  }
)
let myChatRef = useTemplateRef('my-chat')
let loading = ref<boolean>(false)
let query = ref({ pageNum: 1, pageSize: 50 })
let chatList = ref<any[]>([])
// @ts-expect-error
const userInfo = useUserStore()?.userInfo?.user || {}
let sendMessageList: any[] = []
let loadingMessageList: any[] = []
/** 获取聊天消息 */
const getMessage = async () => {
  try {
    const { rows: data }: any = await messageList(props.messageType, props.sendId, query.value)
    sendMessageList = data
      .map(item => ({
        ...item,
        senderAvatar: item.sender === props.sendId ? props.avatar : item.senderAvatar
      }))
      .reverse()
      .concat(chatList.value)
    // 设置已读
    if (query.value.pageNum === 1 && props.unRead) {
      emit('readMessage')
    }
    handleSetChatList()
    query.value.pageNum++
    return data.length < query.value?.pageSize ? false : true
  } catch (e: any) {
    console.error('API error:', e?.msg)
    // throw new Error(e?.msg)
    return false
  }
}

/** 发送消息 */
const handleMessage = async (event: string, data: any) => {
  if (loading.value) {
    return ElMessage.warning('消息发送中…')
  }
  loading.value = true
  try {
    let params = {}
    switch (event) {
      case 'text_event':
        const value = data.items[0].content
        if (!value) {
          return ElMessage.error('消息不能为空！')
        }
        params = {
          conversationType: props.messageType,
          messageContent: data.items[0].content,
          receiver: props.sendId,
          sender: props.receiverId,
          type: 'TXT',
          bizStatus: 'DEFAULT' // 默认正常状态
        }
        break
      case 'image_event':
        params = {
          conversationType: props.messageType,
          messageContent: data?.url,
          receiver: props.sendId,
          sender: props.receiverId,
          type: 'PIC',
          bizStatus: 'DEFAULT' // 默认正常状态
        }
        break
      case 'resume_event':
        params = {
          conversationType: props.messageType,
          messageContent: JSON.stringify({
            name: userInfo?.currCustInfo?.name + '的在线简历', // 简历名称
            url: '', // 简历Url
            id: userInfo?.currCustInfo?.id // 用户ID
          }),
          receiver: props.sendId,
          sender: props.receiverId,
          type: 'RESUME',
          conversationMessageId: data?.conversationMessageId,
          bizStatus: data?.bizStatus // 默认正常状态
        }
        // 更改对应消息的状态
        const messageIndex = chatList.value.findIndex(item => item.id === data?.conversationMessageId)
        messageIndex !== -1 && (chatList.value[messageIndex].bizStatus = data?.bizStatus)
        break
      case 'request_resume_event':
        params = {
          conversationType: props.messageType,
          messageContent: data.items[0].content,
          receiver: props.sendId,
          sender: props.receiverId,
          type: 'REQUEST_RESUME',
          bizStatus: 'REQUEST_RESUME' // 设置为请求简历状态
        }
        break
      case 'send_resume_event':
        params = {
          conversationType: props.messageType,
          messageContent: JSON.stringify({
            name: userInfo?.currCustInfo?.name + '的在线简历', // 简历名称
            url: '', // 简历Url
            id: userInfo?.currCustInfo?.id // 用户ID
          }),
          receiver: props.sendId,
          sender: props.receiverId,
          type: 'SEND_RESUME',
          bizStatus: 'SEND_RESUME' // 设置为请求简历状态
        }
        break
      case 'system_event':
        params = {
          conversationType: props.messageType,
          messageContent: JSON.stringify(data?.content),
          receiver: props.sendId,
          sender: props.receiverId,
          type: 'SYSTEM',
          conversationMessageId: data?.conversationMessageId,
          bizStatus: data?.bizStatus // 默认正常状态
        }
        // 更改对应消息的状态
        const index = chatList.value.findIndex(item => item.id === data?.conversationMessageId)
        index !== -1 && (chatList.value[index].bizStatus = data?.bizStatus)
        break
    }
    _handleMessage(params)
    return true
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
const _handleMessage = params => {
  const timer = new Date().getTime()
  const info = {
    ...params,
    messageTime: timer,
    senderAvatar: userInfo?.avatar || userInfo?.currCustInfo?.avatar || defaultAvatar,
    senderName: userInfo?.nickname || userInfo?.currCustInfo?.name,
    sender: props.receiverId
  }
  console.log('发送消息=>', info)
  loadingMessageList.push(info)
  emit('sendMessageSuccess', {
    ...info,
    senderName: props?.receiveName
  })
  handleSetChatList()
  socketInstance.send(
    '/app/queue/send_imessage',
    {
      authorization: getToken()
    },
    JSON.stringify(params)
  )
}

/** 设置聊天记录 */
const handleSetChatList = () => {
  chatList.value = sendMessageList.concat(loadingMessageList)
  nextTick(() => {
    myChatRef?.value?.scrollToBottom(false)
  })
}

const customMessageRender = (item: any) => {
  const {
    id: msg_id,
    messageTime: send_time,
    senderName: nickname,
    senderAvatar: avatar,
    messageContent,
    status = StatusEnum.SENT,
    sender,
    type,
    bizStatus
  } = item
  return {
    msg_id: msg_id,
    time: send_time,
    name: nickname,
    avatar: avatar,
    content: messageContent,
    senderId: sender,
    type,
    status,
    bizStatus
  }
}

let socketInstance: any = useAppStore()?.socketInstance
let host = import.meta.env.VITE_APP_BASE_API + 'imessage_conversation?token=' + getToken()
const initSocket = async () => {
  if (!socketInstance) {
    const info: any = await connectWebsocket({
      url: host
    })
    socketInstance = info?.client
    useAppStore().socketInstance = info?.client // 更新全局socket实例
  }
  socketInstance.subscribe('/user/topic/imessage', function (message) {
    const info = JSON.parse(message.body)
    console.log('订阅：会话消息==>', info)
    // 校验消息是否是当前双方消息
    if (info?.sender !== props.sendId && info.receiver !== props.sendId) return

    sendMessageList.push(info)
    loadingMessageList = loadingMessageList.filter(item => item.messageContent !== info?.messageContent)
    handleSetChatList()
    // 页面展示，设置已读
    if (document.visibilityState === 'visible') {
      emit('readMessage')
    }
  })
}

/** 监听页面展示 */
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    emit('readMessage')
  }
}

/** 设置不合适 */
const handleNoSuitable = () => {
  emit('noSuitable')
}

onMounted(() => {
  initSocket()

  // 监听页面是否展示，展示即设置消息已读
  document.addEventListener('visibilitychange', handleVisibilityChange)
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  // socketInstance?.disconnect()
  // 取消订阅
  socketInstance?.unsubscribe('/user/topic/imessage')
  socketInstance = null
})
</script>

<style lang="scss" scoped>
.chat-box {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .main-content {
    flex: 1;
    overflow: auto;
  }
}
.chat-footer {
  flex-shrink: 0;
}
</style>
