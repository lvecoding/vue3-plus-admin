<script lang="ts" setup>
defineProps<{
  show: boolean
  unread?: number
  scrollToBottom: (animation: boolean) => void
}>()
</script>

<template>
  <div class="skip-bottom pointer" :class="{ show }" @click="scrollToBottom(true)">
    <span v-if="unread">{{ unread }} 条未读消息</span>
    <span v-else>回到底部</span>
    <el-icon><CaretBottom /></el-icon>
  </div>
</template>

<style lang="scss" scoped>
.skip-bottom {
  position: absolute;
  right: 58px;
  bottom: -40px;
  min-width: 80px;
  height: 28px;
  font-size: 12px;
  background-color: var(--text-color-theme);

  // background-color: #1890ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: bottom 1s ease-in-out;
  border-radius: 10px 10px 0 0;
  padding: 0 10px;
  span {
    margin-right: 5px;
  }
  &.show {
    bottom: 0;
  }
}
html[theme-mode='dark'] {
  .skip-bottom {
    background-color: #2c2c32;
  }
}
</style>
