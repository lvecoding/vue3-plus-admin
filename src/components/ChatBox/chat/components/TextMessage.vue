<script lang="ts" setup>
import { ref, watch } from 'vue'
import { textReplaceEmoji } from '../../emojis'
import { textReplaceLink, textReplaceMention } from '../string'
import ImageMessage from './ImageMessage.vue'
const props = defineProps<{
  content: string
  isUser: boolean
  messageType: string
}>()

let textContent = ref('')
watch(
  () => props.content,
  val => {
    let data = val
    data = textReplaceLink(data)
    data = textReplaceEmoji(data)
    data = textReplaceMention(data)
    textContent.value = data
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div
    v-if="messageType === 'TXT'"
    class="immsg-text"
    :class="{
      user: isUser
    }"
  >
    <div v-html="textContent" />
  </div>
  <div
    v-if="messageType === 'PIC'"
    class="immsg-image"
    :class="{
      user: isUser
    }"
  >
    <image-message :src="props.content" />
  </div>
</template>

<style lang="scss" scoped>
.immsg-image {
  min-width: 30px;
  max-width: 540px;
  min-height: 20px;
  height: auto;
  border-radius: 5px;
}
.immsg-text {
  min-width: 30px;
  min-height: 20px;
  max-width: 540px;
  height: auto;
  padding: 3px;
  border-radius: 5px;
  background: rgb(244 245 245 / 100%);
  color: var(--text-title-color);
  &.user {
    background: rgb(141 0 255 / 12%);
  }
  div {
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: 14px;
    padding: 6px;
    font-family: HarmonyOS;
    :deep(.emoji) {
      vertical-align: text-bottom;
      margin: 0 3px;
      width: 20px;
    }
    :deep(a) {
      color: var(--text-color-theme);
      text-decoration: revert;
    }
  }
}
</style>
