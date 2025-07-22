<template>
  <div class="tinymce-boxz">
    <Editor v-model="content" tinymceScriptSrc="/tinymce/tinymce.min.js" :api-key="apiKey" :init="init" />
  </div>
</template>

<script lang="ts" setup>
import { getToken } from '@/utils/auth'
import Editor from '@tinymce/tinymce-vue'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
import { computed } from 'vue'

const uploadUrl = import.meta.env.VITE_APP_BASE_API + 'file/image_upload' // 图片上传地址
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + 'file/upload' // 上传文件服务器地址
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  //默认值
  modelValue: {
    type: String,
    default: ''
  },

  // 上传的文件大小
  fileSize: {
    type: Number,
    default: 30
  },

  // 预置文案
  placeholder: {
    type: String,
    default: '请输入内容'
  },
  customConfig: {
    type: Object,
    default: () => {
      return {
        toolbar: [
          'undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent ',
          'styleselect formatselect fontselect fontsizeselect |   image media emoticons lineheight '
        ],
        menubar: true
      }
    }
  },

  minHeight: {
    type: Number,
    default: 220
  },
  height: {
    type: Number,
    default: 800
  },
  minWidth: {
    type: Number,
    default: 300
  }
})
const content = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
let apiKey = 'jfqcrgegt45klcovgwd6zwkjgl7mxfluw52m839ypfqgg1yk' //https://github.com/tinymce/tinymce-vue/blob/main/src/demo/views/Iframe.vue
const init = computed(() => {
  return {
    language: 'zh_CN', //语言类型
    onboarding: false,
    base_url: '/tinymce', // 指定本地路径
    promotion: false,
    // suffix: '.min',
    placeholder: props.placeholder, //textarea中的提示信息
    min_width: props?.minWidth || 300, //编辑器最小宽度,
    min_height: props?.minHeight || 220,
    height: props?.height || 800, //注：引入autoresize插件时，此属性失效
    resize: 'both', //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
    branding: false, //tiny技术支持信息是否显示
    content_style:
      'img {width:100%;height:auto} video {width:100%;height:auto} body { font-size: 14px;color: #333; line-height: 24px;}',
    // statusbar: false,  //最下方的元素路径和字数统计那一栏是否显示
    // elementpath: false, //元素路径是否显示

    font_formats:
      '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;', //字体样式
    plugins:
      'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave emoticons', //插件配置 axupimgs indent2em
    toolbar: [
      'fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat ',
      'styleselect formatselect fontselect fontsizeselect |  table image axupimgs media emoticons charmap hr pagebreak insertdatetime  selectall visualblocks searchreplace | code print preview | indent2em lineheight formatpainter'
    ], //工具栏配置，设为false则隐藏
    paste_data_images: true, //图片是否可粘贴
    ...props.customConfig, //自定义配置
    //此处为图片上传处理函数
    images_upload_handler: blobInfo =>
      new Promise((resolve, reject) => {
        const file = blobInfo.blob()
        const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg', 'image/gif', 'image/webp']
        const isJPG = type.includes(file.type)
        //检验文件格式
        if (!isJPG) {
          ElMessage.error(`图片格式错误!`)
          return false
        }
        // 校检文件大小
        if (props.fileSize) {
          const isLt = file.size / 1024 / 1024 < props.fileSize
          if (!isLt) {
            ElMessage.error(`上传文件大小不能超过 ${props.fileSize} MB!`)
            return false
          }
        }
        const formData = new FormData()
        formData.append('file', file)
        fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: getToken() // 如果需要认证
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.code === 200) {
              resolve(data?.data?.imagePathBig)
            } else {
              reject({
                message: data.msg,
                remove: true
              })
            }
          })
          .catch(error => {
            reject({
              message: '上传失败: ' + error.message,
              remove: true
            })
          })
      }),

    file_picker_types: 'file media', //file image media分别对应三个类型文件的上传：link插件，image和axupimgs插件，media插件。想屏蔽某个插件的上传就去掉对应的参数
    // 文件上传处理函数
    file_picker_callback: function (callback, value, meta) {
      let filetype //限制文件的上传类型,需要什么就添加什么的后缀
      if (meta.filetype == 'image') {
        filetype = '.jpg, .jpeg, .png, .gif, .ico, .svg, .webp'
      } else if (meta.filetype == 'media') {
        filetype = '.mp3, .mp4, .avi, .mov'
      } else {
        filetype =
          '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4, .jpg, .jpeg, .png, .gif, .ico, .svg'
      }
      let inputElem = document.createElement('input') as HTMLElement //创建文件选择
      inputElem.setAttribute('type', 'file')
      inputElem.setAttribute('accept', filetype)
      inputElem.click()
      inputElem.onchange = () => {
        let file = inputElem.files[0] //获取文件信息
        // 校检文件大小
        if (props.fileSize) {
          const isLt = file.size / 1024 / 1024 < props.fileSize
          if (!isLt) {
            ElMessage.error(`上传文件大小不能超过 ${props.fileSize} MB!`)
            return false
          }
        }
        const formData = new FormData()
        formData.append('file', file)
        fetch(uploadFileUrl, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: getToken() // 如果需要认证
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.code === 200) {
              callback(data?.data?.fileUrl)
            } else {
              ElMessage.error(`${data.msg}`)
            }
          })
          .catch(error => {
            ElMessage.error(`${error?.message || '上传失败'}`)
          })
      }
    }
  }
})

//内容有变化，就更新内容，将值返回给父组件
watch(
  () => content.value,
  newVal => {
    if (newVal !== props.modelValue) {
      emit('update:modelValue', newVal)
    }
  }
)
</script>

<style scoped>
.tinymce-boxz > textarea {
  display: none;
}
</style>
<style>
/* 隐藏apikey没有绑定这个域名的提示 */
.tox-notifications-container .tox-notification--warning {
  display: none !important;
}
.tox.tox-tinymce {
  max-width: 100%;
}
.tox {
  /* z-index: 9999 !important; */
}
.tox-statusbar__path-item {
  display: none !important;
}
.tox-promotion,
.tox .tox-promotion {
  display: none !important;
}
</style>
