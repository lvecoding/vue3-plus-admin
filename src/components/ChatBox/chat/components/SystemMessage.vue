<template>
  <div class="flex jcc">
    <div v-if="content" class="system-message">{{ content }}</div>
  </div>
</template>

<script setup lang="ts">
const { content } = defineProps({
  content: String
})
</script>

<style lang="scss" scoped>
.system-message {
  padding: 3px 15px;
  border-radius: 15px;
  background-color: #f8f8f8;
  color: var(--text-title-color);
  font-size: 12px;
  margin: 26px auto;
  display: inline-block;
}
</style>
