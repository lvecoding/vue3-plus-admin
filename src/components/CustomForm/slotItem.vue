<template>
  <component v-if="slotInfo.formatter" :is="slotInfo.formatter()"></component>
  <template v-else>{{ $t(slotInfo.text || '') }}</template>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  }
})

let slotInfo = ref<{
  formatter?: Function
  text?: string
}>({})
watch(
  () => props.info,
  val => {
    slotInfo.value = val
  },
  { deep: true, immediate: true }
)
</script>
