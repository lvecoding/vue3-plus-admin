<script setup lang="ts">
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import '@/components/ChatBox/style/editor-mention.scss'
import { ref, onMounted, onUnmounted } from 'vue'
import Quill from 'quill'
import { defaultOptions } from '@/components/ChatBox/quill-editor/const'
import { mergeOptions } from '@/components/ChatBox/quill-editor/util'
import { Mention, MentionBlot } from 'quill-mention'
import EmojiBlot from '@/components/ChatBox/quill-editor/formats/emoji'
import ImageBlot from './formats/image'
Quill.register({ 'blots/mention': MentionBlot, 'modules/mention': Mention })
Quill.register('blots/emoji', EmojiBlot)
Quill.register('blots/image', ImageBlot)

defineExpose({
  getQuill
})

const emit = defineEmits(['ready', 'change', 'blur', 'focus', 'sendMessage', 'cancel', 'inputChange'])

const model = defineModel()

const { options } = defineProps({
  options: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

const editor = ref(null)

let quill: Quill | null = null

function getQuill(): Quill | null {
  return quill
}

const initialize = () => {
  if (!editor.value) return

  quill = new Quill(editor.value, mergeOptions(defaultOptions, options))

  quill.on('selection-change', range => {
    emit(!range ? 'blur' : 'focus', quill)
  })

  quill.on('text-change', () => {
    console.log('text-change')
    if (!editor.value) return

    let text = quill?.getText().replace(/\n+$/, '')

    // @ts-expect-error
    let html = editor.value?.children[0].innerHTML

    if (html === '<p><br></p>') html = ''

    model.value = html

    emit('change', { html, text, quill })
  })
  quill.root.addEventListener('input', () => {
    emit('inputChange')
  })

  emit('ready', quill)
}

/** 发送消息 */
const handleSendMessage = () => {
  emit('sendMessage')
}
const handleCancel = () => {
  emit('cancel')
}
onMounted(() => {
  initialize()
})

onUnmounted(() => {
  quill = null
})
</script>

<template>
  <section class="quill-editor">
    <section ref="editor"></section>
    <div class="flex flex-1 flex-end">
      <el-button plain @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSendMessage">发表</el-button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.quill-editor {
  font-size: 14px !important;
}
.send-btn {
  font-size: 14px;
  font-weight: normal;
  color: rgb(157 160 163 / 100%);
  text-align: right;
  cursor: pointer;
  margin-top: 6px;
  &:hover {
    color: rgb(157 160 163 / 80%);
  }
}
.flex-end {
  justify-content: end;
}
</style>
