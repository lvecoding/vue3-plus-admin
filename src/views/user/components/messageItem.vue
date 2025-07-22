<template>
  <section class="message-box">
    <el-badge :is-dot="info?.readed === 0">
      <img :src="info?.senderAvatar || defaultAvatar" class="avatar" @error="info.senderAvatar = defaultAvatar" />
    </el-badge>
    <main class="message-content">
      <div class="message-header">
        <!-- <span class="name">{{ info?.senderName || '系统' }}</span> -->
        <span class="title line-1">{{ info?.title }}</span>
      </div>
      <p v-html="info?.content" class="message-body"></p>
      <div class="time">
        {{ beautifyTime(info.messageTime) }}
        <el-button v-if="!isProd" @click="emit('click')">{{
          info?.bizType && msgStatus.includes(info?.bizType) ? '查看' : '去处理'
        }}</el-button>

        <!-- <el-button v-else @click="emit('read')">标记为已读</el-button> -->
      </div>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { beautifyTime } from '@/utils/datetime'
import defaultAvatar from '@/assets/images/icon-customer-server.png'
const isProd = import.meta.env.VITE_APP_ENV === 'production'
const msgStatus = [
  'PROJECT_TERMINATE',
  'PROJECT_START',
  'PROJECT_ENGINEER',
  'CUSTOMER_APPROVE_REJECTED',
  'CUSTOMER_APPROVE_PASS',
  'CUSTOMER_REGISTER',
  'ACCEPTANCE_APPROVE_REJECTED',
  'ACCEPTANCE_APPROVE_PASS',
  'PROJECT_TERMINATE_PASS',
  'PROJECT_LEADER',
  'PROJECT_ENGINEER',
  'JOB_APPLY',
  'JOB_APPROVE_PASS',
  'JOB_APPROVE_REJECTED'
]
const emit = defineEmits<{
  (e: 'click'): void
  (e: 'read'): void
}>()
const { info } = defineProps<{
  info: {
    content?: string
    senderAvatar?: string
    senderName?: string
    title?: string
    messageTime?: string
    readed?: number
    bizType?: string
  }
}>()
</script>

<style lang="scss" scoped>
.message-box {
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0;
  &:last-child {
    .message-content {
      border-bottom: none;
    }
  }
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
  }
  .message-content {
    position: relative;
    flex: 1;
    margin-left: 20px;
    padding-bottom: 20px;
    border-bottom: solid 1px #f0f2f5;
  }
  .message-header {
    display: flex;
    align-items: center;
    color: #33383d;
    font-size: 13px;
    .title {
      flex: 1;
      margin-left: 12px;
    }
  }
  .message-body {
    color: #000;
    margin-top: 12px;
  }
  .time {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 10px;
    color: #83898f;
  }
}
</style>
