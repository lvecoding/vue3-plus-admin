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
      <QuillEditor ref="editor" :options="editorOption" style="height: 80px" @send-message="onSendMessage" />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import QuillEditor, { Quill } from './quill-editor'
import defaultAvatar from '@/assets/images/default-avatar.png'
import MeEditorEmoticon from './MeEditorEmoticon.vue'
import { deltaToMessage } from './utils'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
// import { getCurrentInstance } from 'vue'
import { computed } from 'vue'

const emit = defineEmits(['no-suitable'])
const uploadImgUrl = ref<string>(import.meta.env.VITE_APP_BASE_API + 'file/image_upload') // 上传的图片服务器地址
const { members, callback, status } = defineProps({
  members: {
    type: Array,
    default: () => []
  },
  callback: Function,
  status: {
    type: String,
    default: ''
  }
})
const editorOption = {
  theme: 'snow',
  placeholder: '按Enter发送 / Shift+Enter 换行',
  formats: ['emoji', 'mention'],
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
      renderItem: (data: any) => {
        const el = document.createElement('div')
        el.className = 'ed-member-item'
        el.innerHTML = `<img src="${data.avatar}" class="avator"/>`
        el.innerHTML += `<span class="nickname">${data.nickname}</span>`
        return el
      },
      source: function (searchTerm: string, render: any) {
        if (!members.length) return render([])

        const items = [
          { id: 0, nickname: '所有人', avatar: defaultAvatar, value: '所有人' },
          ...members.map((item: any) => {
            return {
              id: item.id,
              nickname: item.nickname,
              avatar: item.avatar,
              value: item.nickname
            }
          })
        ]
        render(items.filter((item: any) => item.nickname.toLowerCase().indexOf(searchTerm) !== -1))
      },
      mentionContainerClass: 'ql-mention-list-container me-scrollbar me-scrollbar-thumb'
    }
  }
}
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
            callback('image_event', {
              url: data?.data?.imagePathSmall
            })
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
/** 设置不合适 */
const handleNoSuitable = async () => {
  emit('no-suitable')
}
/** 求简历 */
const handleResume = async () => {
  const ok = await callback('request_resume_event', {
    items: [{ content: '我想要一份您的简历，您是否同意' }]
  })
  ok && getQuill().setContents([], Quill.sources.USER)
}
/** 发简历 */
const handleSendResume = async () => {
  const ok = await callback('send_resume_event')
  ok && getQuill().setContents([], Quill.sources.USER)
}
// @ts-expect-error
const userType = useUserStore()?.userInfo?.user?.currCustInfo?.custType
let navs = computed(() => [
  {
    title: '图片',
    svg: 'picture',
    show: true,
    click: handleImageUpload
  },
  {
    title: '发简历',
    text: '发简历',
    show: userType === 'ENGINEER',
    disabled: status === 'REQUEST_RESUME' || status === 'SEND_RESUME',
    click: handleSendResume
  },
  {
    title: '求简历',
    text: '求简历',
    show: userType === 'ENTREPRENEUR',
    disabled: status === 'REQUEST_RESUME' || status === 'SEND_RESUME',
    click: handleResume
  },
  { title: '不合适', text: '不合适', show: userType === 'ENTREPRENEUR', click: handleNoSuitable }
])
let editor = ref<HTMLElement>()
let emoticonRef = ref<HTMLElement>()
async function onSendMessage() {
  let delta = getQuill().getContents()
  let data = deltaToMessage(delta)
  if (data.items.length === 0) return

  if (data.msgType == 1) {
    if (data.items[0].content.length > 1024) {
      return ElMessage.error('发送内容超长，请分条发送')
    }

    const ok = await callback('text_event', data)
    ok && getQuill().setContents([], Quill.sources.USER)
    return
  }

  if (data.msgType == 3) {
    const ok = await callback('image_event', {
      url: data.items[0].content,
      size: 10000
    })

    ok && getQuill().setContents([], Quill.sources.USER)
    return
  }
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
