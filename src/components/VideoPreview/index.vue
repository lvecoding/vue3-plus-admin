<template>
  <video
    :src="`${realSrc}`"
    muted
    :width="props.width || 80"
    class="video-item"
    :poster="props.poster"
    @click="handlePreviewVideo"
  ></video>
  <el-dialog v-model="dialogVisible" width="50%" append-to-body>
    <video v-if="dialogVisible" :src="`${realSrc}`" controls autoplay style="width: 100%;" class="mt-20"></video>
  </el-dialog>
</template>

<script setup>
import { isExternal } from '@/utils/validate'
import { ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  width: {
    type: [Number, String],
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  }
})

const realSrc = computed(() => {
  if (!props.src) {
    return
  }
  let real_src = props.src.split(',')[0]
  if (isExternal(real_src)) {
    return real_src
  }
  return import.meta.env.VITE_APP_BASE_API + real_src
})

/** 预览视频 */
let dialogVisible = ref(false)
const handlePreviewVideo = () => {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.video-item {
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
}
</style>
