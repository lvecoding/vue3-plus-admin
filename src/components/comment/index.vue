<template>
  <div class="comment-cantainer">
    <div>
      <commentEditor
        :key="updateIndex"
        @update:model-value="handleAdd"
        @click-cancel="handleCancel"
        :placeholder="placeholderInput"
      />
    </div>
    <div class="comment-list pt-30">
      <div class="comment-item" v-for="(item, index) in commentList" :key="index">
        <div class="flex aic">
          <img :src="item.authorAvatar" style="width: 20px; height: 20px; border-radius: 100%;" />
          <span class="color-theme pl-6">{{ item.authorName }}</span>
        </div>
        <div class="pl-40 comment-box">
          <div v-if="isEdit && item.commentId === currCommentId">
            <el-input v-model="item.commentDes" @blur="handleUpdate(item)" @keyup.enter="handleUpdate(item)" />
          </div>
          <div class="pt-8 pb-4 pr-20" v-html="item.commentDes" v-else></div>
          <div class="flex pt-3" style="height: 20px;">
            <div class="color-333">{{ item.createTime }}</div>
            <div class="reply-btn">
              <el-text class="pl-6 pointer" tag="ins" v-if="item.isMine && showEditor" @click="handleEdit(item)">编辑</el-text>
              <el-text tag="ins" class="pl-6 pointer" @click="handleReply(item)">回复</el-text>
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                @confirm="handleDel(item.commentId)"
                cancel-button-text="取消"
                :title="$t(`确定删除该条评论吗?\n删除后将不可被恢复`)"
              >
                <template #reference>
                  <el-text tag="ins" class="pl-6 pointer" v-if="item.isMine">删除</el-text>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
        <!-- 回复列表 -->
        <div class="reply-list pl-40">
          <div class="reply-box pt-10" v-for="(reply, Rindex) in item.childComments" :key="Rindex">
            <div class="flex aic" style="height: 20px;">
              <img :src="reply.authorAvatar" style="width: 20px; height: 20px; border-radius: 100%;" />
              <span class="color-theme pl-6">{{ reply.authorName }}</span>
              <span class="color-gray pl-6 pr-6 pointer">回复</span>
              <span>{{ reply.repliedName }}</span>
            </div>
            <div class="pl-30 pt-6">
              <div v-if="isEdit && reply.commentId === currCommentId" class="reply-edit">
                <el-input v-model="reply.commentDes" @blur="handleUpdate(reply)" @keyup.enter="handleUpdate(reply)" />
              </div>
              <div v-else>{{ reply.commentDes }}</div>

              <div class="flex pt-3 aic" style="height: 20px;">
                <div class="color-333">{{ reply.createTime }}</div>
                <el-text class="pl-6 pointer reply-delete" tag="ins" v-if="reply.isMine && showEditor" @click="handleEdit(reply)"
                  >编辑</el-text
                >
                <el-text tag="ins" class="pl-6 reply-delete pointer" @click="handleReply(reply)">回复</el-text>
                <el-popconfirm
                  width="220"
                  @confirm="handleDel(reply.commentId)"
                  trigger="click"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  :title="`确定删除该条回复吗?\n删除后将不可被恢复`"
                >
                  <template #reference>
                    <el-text tag="ins" v-if="reply.isMine" class="pl-6 reply-delete pointer">删除</el-text>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </div>
        </div>
        <el-divider />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import commentEditor from './commentEditor.vue'

interface ICommentItem {
  commentId: number
  commentDes: string
  authorName: string
  authorAvatar: string
  createTime: string
  isMine: boolean
  repliedName: string
  childComments: ICommentItem[]
}
const props = defineProps({
  dataList: {
    type: Array<ICommentItem>,
    default: () => {
      return []
    }
  },
  customBtn: {
    type: Boolean,
    default: false
  },
  maxLenghtContent: {
    type: Number,
    default: 100
  },
  showEditor: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: '添加评论 按Enter发送 / Shift+Enter 换行'
  }
})
const updateIndex = ref(0)
const currReplyCommentInfo = ref<any>()
const placeholderInput = ref(props.placeholder)
const commentList = ref<ICommentItem[]>([])
const isEdit = ref(false)
const currCommentId = ref(0)

watch(
  () => props.dataList,
  () => {
    console.log('评论列表', props.dataList)
    commentList.value = props.dataList
  },
  { immediate: true, deep: true }
)
const handleCancel = () => {
  placeholderInput.value = props.placeholder
  currReplyCommentInfo.value = null
  updateIndex.value++
}
const emit = defineEmits(['addComment', 'addReply', 'delComment', 'updateComment'])
const handleAdd = (content: string) => {
  if (!content) return
  if (content) {
    if (currReplyCommentInfo.value) {
      //回复评论
      emit('addReply', {
        content: content,
        parentId: currReplyCommentInfo.value.commentId,
        commentId: currReplyCommentInfo.value.commentId
      })
      placeholderInput.value = props.placeholder
      updateIndex.value++
      currReplyCommentInfo.value = null
    } else {
      //添加评论
      emit('addComment', content)
      updateIndex.value = 0
    }
  }
}
const handleReply = item => {
  console.log(item, '回复评论')
  currReplyCommentInfo.value = item
  placeholderInput.value = `回复：${item.authorName}`
  updateIndex.value++
}
const handleDel = commentId => {
  emit('delComment', commentId)
}

const handleEdit = item => {
  console.log(item, 'item>>>>>')
  isEdit.value = true
  currCommentId.value = item.commentId
}
const handleUpdate = item => {
  item.commentDes = item.commentDes.trim()
  if (item.commentDes) {
    emit('updateComment', item)
    isEdit.value = false
    currCommentId.value = 0
  }
}
</script>

<style lang="scss" scoped>
.flex-end {
  justify-content: end;
}
.reply-btn {
  display: none;
}
.comment-box:hover .reply-btn {
  display: block;
}
.reply-delete {
  display: none;
}
.reply-box:hover .reply-delete {
  display: block;
}
.comment-list {
  font-size: 12px;
  .comment-item {
    // padding-top: 10px;
  }
}
.color-333 {
  color: #87888a;
}
</style>
