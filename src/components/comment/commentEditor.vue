<template>
  <section class="el-container is-vertical editor">
    <div class="toolbar border-top">
      <el-popover
        placement="top-start"
        trigger="click"
        raw
        :width="500"
        ref="emoticonRef"
        popper-style="padding: 0"
        popper-class="custom-popover-class"
      >
        <template #reference>
          <el-button class="toolbar-item">
            <svg-icon icon-class="smileyFace" class="toolbar-icon" />
            <p class="title">表情符号</p>
          </el-button>
        </template>
        <template #default>
          <MeEditorEmoticon @on-select="onEmoticonEvent" />
        </template>
      </el-popover>

      <template v-for="nav in navs" :key="nav.title">
        <el-button v-if="nav.show" :disabled="nav.disabled" class="toolbar-item" @click="nav.click">
          <svg-icon v-if="nav.svg" :icon-class="nav.svg" class="toolbar-icon" />
          <div v-if="nav.text" class="icon-tag">{{ nav.text }}</div>
          <p v-if="!nav.disabled" class="title">{{ nav.title }}</p>
        </el-button>
      </template>
    </div>
    <main class="editor-container">
      <QuillEditor
        ref="editor"
        :options="editorOption"
        @input-change="onTextChange"
        style="height: 100px"
        @send-message="onSendMessage"
        @cancel="onCancel"
      />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import QuillEditor from './quill-editor'
import MeEditorEmoticon from '@/components/ChatBox/MeEditorEmoticon.vue'
import { deltaToMessage } from '@/components/ChatBox/utils'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { computed } from 'vue'
import { textReplaceEmoji } from '@/components/ChatBox/emojis'
const textReplaceLink = text => {
  let exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
  return text.replace(exp, `<a href='$1' alt='link' class="color-theme">$1</a>`)
}
const props = defineProps({
  placeholder: {
    type: String,
    default: '添加评论 按Enter发送 / Shift+Enter 换行'
  }
})
const onTextChange = () => {
  const quill = getQuill()
  const text = quill?.getText().trim()
  const hasContent = text.length > 0

  if (hasContent) {
    quill.root.setAttribute('data-placeholder', '')
  } else {
    quill.root.setAttribute('data-placeholder', '添加评论 按Enter发送 / Shift+Enter 换行')
  }
}
const placeholderText = ref(props.placeholder)
const emit = defineEmits(['update:modelValue', 'clickCancel'])
const uploadImgUrl = ref<string>(import.meta.env.VITE_APP_BASE_API + 'file/image_upload') // 上传的图片服务器地址
const editorOption = ref({
  theme: 'snow',
  placeholder: placeholderText.value,
  formats: ['emoji', 'image'],
  modules: {
    toolbar: false,

    keyboard: {
      bindings: {
        enter: {
          key: 'Enter',
          // 回车发送消息
          handler: onSendMessage
        }
      }
    },

    mention: {
      allowedChars: /^[\u4e00-\u9fa5]*$/,
      mentionDenotationChars: ['@'],
      positioningStrategy: 'fixed',
      mentionContainerClass: 'ql-mention-list-container me-scrollbar me-scrollbar-thumb'
    }
  }
})
// 上传图片
const handleImageUpload = () => {
  // 创建input元素触发文件选择
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/png, image/jpeg, image/gif, image/avif, image/jpg'
  input.onchange = e => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      fetch(uploadImgUrl.value, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: getToken() // 如果需要认证
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.code === 200) {
            // callback('image_event', {
            //   url: data?.data?.imagePathSmall
            // })
            console.log(data?.data?.imagePathSmall, 'data?.data?.imagePathSmall')
            const quill = getQuill()
            let index = getQuillSelectionIndex()
            console.log(index, 'index')
            quill.insertEmbed(index, 'image', {
              src: data?.data?.imagePathSmall,
              width: '100px',
              height: '60px'
            })
            quill.setSelection(index + 1)
          } else {
            ElMessage.error(data.msg)
          }
        })
        .catch(error => {
          ElMessage.error(error.message || '上传失败')
        })
    }
  }
  input.click()
}

let navs = computed(() => [
  {
    title: '图片',
    svg: 'picture',
    show: true,
    click: handleImageUpload
  }
])
let editor = ref<HTMLElement>()
let emoticonRef = ref<HTMLElement>()
async function onSendMessage() {
  let delta = getQuill().getContents()
  let data = deltaToMessage(delta)

  if (data.items.length === 0) return
  console.log(data, '消息内容')
  let str = ''
  data.items.forEach(item => {
    if (item.type === 3) {
      str += `</br><img src="${item.content.src}" style="width:100px;height:60px;object-fit:'contain'"></br>`
    } else {
      const regex = /\[(.*?)\]/g
      //   表情处理
      const matchContent = item.content.replace(regex, (match, content) => {
        return textReplaceEmoji(`[${content}]`) || match
      })
      str += matchContent.replace(/\n/g, '</br>')
    }
  })
  const urlRegex = /http?:\/\/(?!.*\.(jpg|jpeg|png|gif|bmp))(?:[^\s?#]+\??[^\s?#]*)+/gi
  //   链接处理
  const msgStr = str.replace(urlRegex, (match, content) => {
    return textReplaceLink(match) || content
  })
  emit('update:modelValue', msgStr)
  getQuill().setContents([])
}
const onCancel = () => {
  getQuill().setContents([])
  emit('clickCancel')
}
const getQuill = () => {
  // @ts-expect-error
  return editor?.value?.getQuill()
}
const getQuillSelectionIndex = () => {
  const quill = getQuill()
  if (!quill) return 0

  return (quill.getSelection() || {}).index || quill.getLength()
}

async function onEmoticonEvent(data: any) {
  // @ts-expect-error
  emoticonRef.value?.hide()
  if (data.type == 1) {
    const quill = getQuill()
    let index = getQuillSelectionIndex()

    if (index == 1 && quill.getLength() == 1 && quill.getText(0, 1) == '\n') {
      quill.deleteText(0, 1)
      index = 0
    }
    if (data.img) {
      quill.insertEmbed(index, 'emoji', {
        alt: data.value,
        src: data.img,
        width: '20px',
        height: '20px'
      })
    } else {
      quill.insertText(index, data.value)
    }

    quill.setSelection(index + 1, 0, 'user')
    return
  }
  console.error('报错==>', data)
}
</script>

<style lang="scss" scoped>
.editor {
  --tip-bg-color: rgb(241 241 241 / 90%);

  height: 100%;
  border-top: solid 1px #f0f0f0;
  padding-top: 4px;
  padding-bottom: 10px;
  .toolbar {
    height: 38px;
    display: flex;

    --el-popover-padding: 0;

    padding: 0 10px;
    .toolbar-item {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      user-select: none;
      cursor: pointer;
      padding: 0 0 0 6px !important;
      border: none !important;
      width: auto !important;
      margin: 0 10px 0 0 !important;
      .toolbar-icon {
        width: 20px;
        height: 20px;
        color: var(--text-title-color);
      }
      .icon-tag {
        height: 24px;
        border-radius: 4px;
        border: 1px solid #e6e8eb;
        padding: 0 10px;
        line-height: 22px;
        vertical-align: top;
        cursor: pointer;
        font-size: 13px;
        color: #999;
      }
      .title {
        display: none;
        position: absolute;
        top: 24px;
        left: 0;
        line-height: 26px;
        background-color: var(--tip-bg-color);
        color: var(--text-color-theme);
        min-width: 20px;
        font-size: 12px;
        padding: 0 5px;
        border-radius: 2px;
        white-space: pre;
        user-select: none;
        z-index: 999999999999;
      }
      &:hover {
        .title {
          display: block;
        }
        .toolbar-icon {
          color: var(--text-color-theme);
        }

        background-color: transparent;
      }
      &:active {
        background-color: transparent;
      }
    }
  }
}
.editor-container {
  padding: 10px;
}
html[theme-mode='dark'] {
  .editor {
    --tip-bg-color: #48484d;
  }
}
.custom-popover-class {
  // padding: 10px;
  padding: 0 !important;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<style lang="scss">
.ql-container.ql-snow {
  border: unset;
}
.ql-editor {
  padding: 8px;
  border: unset;
  font-size: 14px;
  line-height: 20px;
  color: var(--text-title-color);
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    background-color: unset;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: transparent;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: var(--im-scrollbar-thumb);
    }
  }
}
.ql-editor.ql-blank::before {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Alibaba PuHuiTi 2.0 45' !important;
  left: 8px;
  font-style: unset;
  color: #b8b3b3;
}
.ql-snow .ql-editor img {
  max-width: 100px;
  border-radius: 3px;
  background-color: #48484d;
  margin: 0 2px;
}
.ed-emoji {
  background-color: unset !important;
}
.quote-card-content {
  display: flex;
  background-color: #f6f6f6;
  flex-direction: column;
  padding: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  user-select: none;
  .quote-card-title {
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    justify-content: space-between;
    .quote-card-remove {
      margin-right: 5px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      transition: all 0.3s;
    }
  }
  &:hover .quote-card-title .quote-card-remove {
    font-size: 30px;
  }
  .quote-card-meta {
    margin-top: 4px;
    font-size: 12px;
    line-height: 20px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
html[theme-mode='dark'] {
  .ql-editor.ql-blank::before {
    color: #57575a;
  }
  .quote-card-content {
    background-color: var(--im-message-bg-color);
  }
}
</style>
