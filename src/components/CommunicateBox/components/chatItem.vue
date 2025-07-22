<template>
  <div :class="['chat-user-item', select === chatInfo?.id && 'active-chat-user-item']" @click="handleSelectChat">
    <div class="avatar">
      <el-badge :show-zero="false" :value="chatInfo?.unReadCount" :max="99" class="item">
        <img :src="chatInfo?.senderAvatar || defaultAvatar" @error="handleImageLoadError" />
      </el-badge>
    </div>
    <div class="chat-info">
      <div class="name-box">
        <div class="flex-1 line-1">{{ chatInfo?.senderName }}</div>
        <div v-if="chatInfo?.lastMessageTime" class="time">{{ humanizeTime(new Date(chatInfo.lastMessageTime).getTime()) }}</div>
      </div>
      <div class="message-content line-1">
        <template v-if="!chatInfo.lastMessageContent">暂无消息~</template>
        <template v-else-if="chatInfo.lastMessageType === 'TXT'">
          {{ chatInfo?.lastMessageContent }}
        </template>
        <template v-else-if="chatInfo.lastMessageType === 'C_EXPRESSIVE'">[自定义表情]</template>
        <template v-else-if="chatInfo.lastMessageType === 'PIC'">[图片]</template>
        <template v-else-if="chatInfo.lastMessageType === 'REQUEST_RESUME'">[请求在线简历]</template>
        <template v-else-if="chatInfo.lastMessageType === 'SEND_RESUME'">[请求发送在线简历]</template>
        <template v-else-if="chatInfo.lastMessageType === 'SYSTEM'">
          <template v-if="typeof JSON.parse(chatInfo.lastMessageContent || '')?.[userInfo?.currCustInfo?.id] === 'string'">{{
            JSON.parse(chatInfo.lastMessageContent || '')?.[userInfo?.currCustInfo?.id]
          }}</template>
          <template v-else>{{
            JSON.parse(JSON.parse(chatInfo.lastMessageContent || '')?.[userInfo?.currCustInfo?.id]?.content || '')?.name ||
            '[在线简历]'
          }}</template>
        </template>
        <template v-else-if="chatInfo.lastMessageType === 'RESUME'">{{
          JSON.parse(chatInfo?.lastMessageContent || '')?.name || '[在线简历]'
        }}</template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import defaultAvatar from '@/assets/images/default-avatar.png'
import useUserStore from '@/store/modules/user'
import { humanizeTime } from '@/utils/datetime'
import { ref, watch } from 'vue'

const emit = defineEmits(['selectChat'])
const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  select: {
    type: String,
    default: ''
  }
})

// @ts-expect-error
let userInfo = useUserStore()?.userInfo?.user
let chatInfo = ref<{
  senderAvatar?: string
  senderName?: string
  lastMessageTime?: string
  lastMessageType?: string
  lastMessageContent?: string
  id?: string
  unReadCount?: number
  receiver?: string
}>({})
watch(
  () => props.info,
  val => {
    chatInfo.value = val
  },
  { immediate: true, deep: true }
)

/** 处理图片加载失败问题 */
const handleImageLoadError = () => {
  chatInfo.value.senderAvatar = defaultAvatar
}

/** 选中某一项聊天 */
const handleSelectChat = () => {
  emit('selectChat', chatInfo.value.id)
}
</script>

<style lang="scss" scoped>
.active-chat-user-item {
  // background: rgba(248, 248, 248, 1);
  background: rgb(243 243 243 / 100%);
}
.chat-user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  .avatar {
    position: relative;
    width: 50px;
    height: 50px;
    .unread-dot {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: red;
      color: #fff;
      border: solid 1px rgb(243 243 243 / 100%);
      z-index: 2;
    }
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .chat-info {
    flex: 1;
    width: 0;
    margin-left: 20px;
    .name-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #333;
      font-weight: 600;
    }
    .time {
      color: #999;
      margin-left: 10px;
      font-weight: normal;
    }
  }
  .message-content {
    margin-top: 6px;
    color: #999;
  }
}
</style>
