<template>
  <section class="resume-message-box">
    <main class="flex aic">
      <div class="icon-box">
        <el-icon><Document /></el-icon>
      </div>
      {{ content }}
    </main>
    <footer class="aic flex">
      <div :class="['refuse-btn', canClick && 'cursor-pointer']" @click="handleRefuseResume">
        拒绝
        <div v-if="!canClick" class="disabled-btn" />
      </div>
      <div :class="['agree-btn', canClick && 'cursor-pointer']" @click="handleAgreeResume">
        同意
        <div v-if="!canClick" class="disabled-btn" />
      </div>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { content, bizStatus, isSend } = defineProps({
  content: {
    type: String,
    default: ''
  },
  bizStatus: {
    type: String,
    default: ''
  },
  isSend: {
    type: Boolean,
    default: false
  }
})
let canClick = computed(() => {
  return !['AGREE_RESUME', 'REFUSE_RESUME', 'REFUSE_SEND_RESUME', 'AGREE_SEND_RESUME'].includes(bizStatus)
})
const emit = defineEmits(['agreeResume', 'refuseResume', 'agreeSendResume', 'refuseSendResume'])

/** 同意简历发送 */
const handleAgreeResume = () => {
  if (!canClick.value) {
    return
  }
  if (isSend) {
    emit('agreeSendResume')
    return
  }
  emit('agreeResume')
}

/** 拒绝简历发送 */
const handleRefuseResume = () => {
  if (!canClick.value) {
    return
  }
  if (isSend) {
    emit('refuseSendResume')
    return
  }
  emit('refuseResume')
}
</script>

<style lang="scss" scoped>
.resume-message-box {
  width: 280px;
  border-radius: 6px;
  position: relative;
  padding: 12px;
  word-break: break-word;
  background: linear-gradient(180deg, rgb(141 0 255 / 12%), #fff 60%);
  border: 1px solid rgb(141 0 255 / 20%);
  font-size: 14px;
  color: var(--text-title-color);
  .icon-box {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--text-color-theme);
    margin-right: 10px;
    color: #fff;
    font-size: 24px;
  }
  .refuse-btn {
    position: relative;
    display: inline-block;
    height: 34px;
    min-width: 121px;
    background: rgb(240 242 245 / 80%);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #333;
    line-height: 34px;
    padding: 0 5px;
    margin-right: 12px;
    overflow: hidden;
    text-align: center;
    transition: background 0.2s;
    margin-top: 16px;
  }
  .agree-btn {
    position: relative;
    display: inline-block;
    height: 34px;
    min-width: 121px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 34px;
    padding: 0 5px;
    margin-right: 12px;
    overflow: hidden;
    text-align: center;
    transition: background 0.2s;
    margin-top: 16px;
    background: rgb(141 0 255 / 20%);
    color: var(--text-title-color);
  }
  .disabled-btn {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(255 255 255 / 50%);
    border-radius: 4px;
  }
}
.user-container {
  height: calc(100vh - 200000px);
  overflow: auto;
}
</style>
