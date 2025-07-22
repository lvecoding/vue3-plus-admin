<template>
  <el-button v-bind="$attrs" @click="handleClick">
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface DButtonProps {
  time?: number
  isDebounce?: boolean
}
defineOptions({
  name: 'DButton'
})

const props = withDefaults(defineProps<DButtonProps>(), {
  time: 300,
  isDebounce: true
})

// 抛出事件
const emits = defineEmits(['click'])
const record = ref(0)
const handleClick = () => {
  if (!props.isDebounce) return emits('click')
  const newTime = new Date()
  if (newTime.getTime() - record.value > props.time) {
    emits('click')
  }
  record.value = newTime.getTime()
}
</script>
