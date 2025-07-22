<template>
  <div class="communicate-container">
    <div
      v-dropsize="{
        min: 200,
        max: 500,
        direction: 'right',
        key: 'aside-session'
      }"
      class="el-aside aside-session"
    >
      <div v-for="item in chatUserList" :key="item.id">
        <chat-item :info="item" :select="selectChatId" @select-chat="handleSelectChat" />
      </div>
      <div v-if="!chatUserList.length">
        <el-empty class="empty" description="暂无数据" style="padding: 100px 0" />
      </div>
    </div>
    <div class="chat-container">
      <chat-box
        v-if="selectChatInfo"
        :receiver-id="selectChatInfo?.receiver"
        :send-id="selectChatInfo?.sender"
        :receive-name="selectChatInfo?.senderName"
        :unRead="selectChatInfo?.unReadCount"
        :avatar="selectChatInfo?.senderAvatar"
        :status="selectChatInfo?.bizStatus"
        message-type="IMESSAGE"
        @read-message="handleSetRead"
        @send-message-success="handleSetMessageSuccess"
        @no-suitable="handleNoSuitable"
      >
        <template #header>
          <div class="chat-header">
            {{ selectChatInfo?.senderName }}
            <!-- 创业者才能收藏我的工程师 -->
            <div
              v-if="userInfo?.custType === 'ENTREPRENEUR'"
              :class="['icon-collect', selectChatInfo.isCollect ? 'border-theme' : '']"
              @click="handleCollect"
            >
              <span :class="['collect-text', selectChatInfo.isCollect ? 'color-theme' : '']">成为我的工程师</span>
              <el-icon v-if="!selectChatInfo.isCollect"><Star /></el-icon>
              <el-icon v-if="selectChatInfo.isCollect" class="color-theme"><StarFilled /></el-icon>
            </div>
          </div>
        </template>
      </chat-box>
    </div>
  </div>
</template>

<script setup lang="ts">
import chatItem from './components/chatItem.vue'
import { conversationDelete, conversationList } from '@/api/conversation'
import { engineerCollect, engineerUnCollect, isEngineerCollect, setStatusInappropriate } from '@/api/engineer'
import { setRead } from '@/api/imessage'
import { connectWebsocket } from '@/components/ChatBox/subscribe'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import { getToken } from '@/utils/auth'
import { onUnmounted } from 'vue'
import { getCurrentInstance } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const { proxy }: any = getCurrentInstance()
const route = useRoute()
let chatUserList = ref<any[]>([])
let selectChatId = ref<string>('')
let selectChatInfo = ref<{
  receiver?: string
  sender?: string
  unReadCount?: number
  senderName?: string
  senderAvatar?: string
  isCollect?: boolean
  bizStatus?: string
} | null>(null)
let userInfo = useUserStore()?.userInfo?.user?.currCustInfo
/** 获取群聊列表 */
const handleGetConversationList = async () => {
  let type = ''
  if (route?.path?.includes('communicate')) {
    type = 'IMESSAGE'
  }
  const { rows: data }: any = await conversationList(type)
  chatUserList.value = data
  return Promise.resolve()
}

/** 设置已读 */
const handleSetRead = async () => {
  await setRead(selectChatId.value)
  handleGetConversationList()
}

/** 切换聊天 */
const handleSelectChat = (id: any) => {
  if (!id) {
    return
  }
  selectChatId.value = id
  selectChatInfo.value = chatUserList.value.find(item => item.id === id)
  handleSetCollect() // 查询是否收藏
}
const handleSetCollect = async () => {
  if (!selectChatInfo.value) return
  const { data }: any = await isEngineerCollect(selectChatInfo.value?.sender)
  selectChatInfo.value.isCollect = data
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
  socketInstance.subscribe('/user/topic/conversation', function (message) {
    console.log('订阅：消息列表==>', JSON.parse(message.body))
    const info = JSON.parse(message.body)
    const index = chatUserList.value.findIndex(item => item.id === info.id)
    if (index !== -1) {
      chatUserList.value[index] = {
        ...chatUserList.value[index],
        ...info
      }
      selectChatInfo.value && (selectChatInfo.value.bizStatus = info?.bizStatus) // 更新当前选中聊天的状态
      // 将当前项数组移动到第一项
      chatUserList.value.unshift(chatUserList.value.splice(index, 1)[0])
    } else {
      chatUserList.value.unshift(info)
    }
  })
}

/** 设置消息发送成功 */
const handleSetMessageSuccess = info => {
  const index = chatUserList.value.findIndex(item => item.sender === info.receiver)
  if (index !== -1) {
    chatUserList.value[index].lastMessageContent = info.messageContent
    chatUserList.value[index].lastMessageTime = info.messageTime
    chatUserList.value[index].lastMessageType = info.type
    chatUserList.value[index].bizStatus = info.bizStatus
    // 将当前项数组移动到第一项
    chatUserList.value.unshift(chatUserList.value.splice(index, 1)[0])
  }
}

/** 设置不合适 */
const handleNoSuitable = async () => {
  await setStatusInappropriate({
    custId: selectChatInfo.value?.sender
  }) // 设置不合适状态
  await conversationDelete(selectChatId.value)
  handleGetConversationList() // 刷新数据
  selectChatInfo.value = null
}

/** 收藏为我的工程师 */
const handleCollect = async () => {
  if (!selectChatInfo.value) {
    return
  }
  if (selectChatInfo.value?.isCollect) {
    await engineerUnCollect(selectChatInfo.value?.sender)
    selectChatInfo.value.isCollect = false
    proxy.$modal.msgSuccess('取消收藏成功')
    return
  }
  await engineerCollect({
    custId: selectChatInfo.value?.sender
  })
  selectChatInfo.value.isCollect = true
  proxy.$modal.msgSuccess('收藏成功')
}

onMounted(async () => {
  await handleGetConversationList()
  initSocket() // 订阅消息列表变更
  handleSelectChat(+(route.query?.id || ''))
})
onUnmounted(() => {
  socketInstance?.disconnect()
  socketInstance = null
  useAppStore().socketInstance = null // 更新全局socket实例
})
</script>

<style scoped lang="scss">
.communicate-container {
  position: relative;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  height: 100%;
  .aside-session {
    width: 320px;
    position: relative;
    user-select: none;
    border-right: 1px solid #f5f5f5;
    padding: 10px;
  }
  .chat-container {
    flex: 1;
    padding: 20px 0;
    .icon-collect {
      font-size: 14px;
      width: 130px;
      height: 24px;
      border: solid 1px #999;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      cursor: pointer;
    }
    .collect-text {
      margin-right: 4px;
    }
  }
}
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 1px #f0f0f0;
  padding-bottom: 14px;
  font-size: 16px;
}
.border-theme {
  border-color: var(--text-color-theme) !important;
}
</style>
