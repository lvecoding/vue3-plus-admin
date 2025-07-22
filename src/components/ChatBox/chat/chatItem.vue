<script lang="ts" setup>
import { IMessage, AlignEnum, StatusEnum } from './types'
import { humanizeTime } from '@/utils/datetime'
import TextMessage from './components/TextMessage.vue'
import ResumeMessage from './components/ResumeMessage.vue'
import RequestResumeMessage from './components/RequestResumeMessage.vue'
import SystemMessage from './components/SystemMessage.vue'
import useUserStore from '@/store/modules/user'
import { computed } from 'vue'
const { item } = defineProps<{
  align?: 'leftRight' | 'left'
  showCheckbox?: boolean
  showAvatar?: boolean
  item: IMessage
  raw: any
  isSelected?: boolean
  onContextMenu: (event: MouseEvent, item: any) => void
  showToolsMenus?: boolean
}>()
// @ts-expect-error
const userInfo = useUserStore()?.userInfo?.user || {}
const messageContent = computed(() => {
  if (item.type === 'SYSTEM') {
    return JSON.parse(item.content || '')?.[userInfo?.currCustInfo?.id] || ''
  }
  return item.content
})
const emits = defineEmits([
  'selected-element',
  'element-event',
  'click-avatar',
  'click-name',
  'agree-resume',
  'refuse-resume',
  'agree-send-resume',
  'refuse-send-resume'
])
</script>

<template>
  <div
    v-if="item.type !== 'SEND_RESUME' && item.type !== 'SYSTEM'"
    class="chat-container-item"
    :class="{
      'align-right':
        align === AlignEnum.LEFT_RIGHT && (item.senderId === userInfo?.currCustInfo?.id || item.senderId === userInfo?.userId)
    }"
  >
    <div class="chat-avatar" v-show="showAvatar">
      <el-image
        :src="item.avatar"
        fit="cover"
        style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer"
        @click="() => emits('click-avatar', item)"
      />
    </div>

    <div class="chat-content">
      <div class="chat-content-title">
        <span class="name" @click="emits('click-name', raw)">{{ item.name }}</span>
        <span class="time" :datetime="item.time">{{ humanizeTime(new Date(item.time).getTime()) }}</span>
      </div>

      <div class="chat-content-main">
        <div class="chat-content-message">
          <text-message
            v-if="item.type === 'REQUEST_RESUME'"
            content="方便发份简历过来吗"
            :message-type="'TXT'"
            :is-user="item.senderId === userInfo?.currCustInfo?.id || item.senderId === userInfo?.userId"
          />

          <resume-message v-else-if="item.type === 'RESUME'" :info="JSON.parse(item.content || '')" />
          <text-message
            v-else
            :content="item.content || ''"
            :message-type="item.type || 'TXT'"
            :is-user="item.senderId === userInfo?.currCustInfo?.id || item.senderId === userInfo?.userId"
          />
          <span class="sent-status sending" v-if="item?.status === StatusEnum.SENDING">
            <el-icon><Loading /></el-icon>
          </span>
          <span class="sent-status fail" v-if="item?.status === StatusEnum.ERROR">发送失败</span>
        </div>

        <div v-if="showToolsMenus" class="chat-tools-menus">
          <el-icon><DocumentCopy @click="emits('element-event', 'copy', raw)" /></el-icon>
          <el-icon><Delete @click="emits('element-event', 'delete', raw)" /></el-icon>
        </div>
      </div>
    </div>
  </div>

  <!-- 系统消息 -->
  <template v-if="item.type === 'SYSTEM'">
    <system-message v-if="typeof messageContent === 'string'" :content="messageContent" />
    <div v-else class="chat-container-item">
      <div class="chat-avatar" v-show="showAvatar">
        <el-image
          :src="messageContent.avatar"
          fit="cover"
          style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer"
          @click="() => emits('click-avatar', messageContent)"
        />
      </div>

      <div class="chat-content">
        <div class="chat-content-title">
          <span class="name" @click="emits('click-name', raw)">{{ messageContent.name }}</span>
          <span class="time" :datetime="item.time">{{ humanizeTime(new Date(item.time).getTime()) }}</span>
        </div>

        <div class="chat-content-main">
          <div class="chat-content-message">
            <resume-message :info="JSON.parse(messageContent.content || '')" />
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- 求简历 -->
  <template v-if="item.type === 'REQUEST_RESUME'">
    <system-message v-if="item.senderId === userInfo?.currCustInfo?.id" content="简历请求已发送" />
    <div v-else class="chat-container-item">
      <div class="chat-avatar" v-show="showAvatar">
        <el-image
          :src="item.avatar"
          fit="cover"
          style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer"
          @click="() => emits('click-avatar', item)"
        />
      </div>

      <div class="chat-content">
        <div class="chat-content-title">
          <span class="name" @click="emits('click-name', raw)">{{ item.name }}</span>
          <span class="time" :datetime="item.time">{{ humanizeTime(new Date(item.time).getTime()) }}</span>
        </div>

        <div class="chat-content-main">
          <div class="chat-content-message">
            <request-resume-message
              v-if="item.senderId !== userInfo?.currCustInfo?.id"
              :content="item.content || ''"
              :biz-status="item.bizStatus || ''"
              @agree-resume="emits('agree-resume')"
              @refuse-resume="emits('refuse-resume')"
            />
          </div>
        </div>
      </div>
    </div>
  </template>

  <!-- 发送简历 -->
  <template v-if="item.type === 'SEND_RESUME'">
    <template v-if="item.senderId === userInfo?.currCustInfo?.id">
      <system-message content="简历请求已发送" />
      <div class="flex jcc">
        <resume-message :info="JSON.parse(item.content || '')" />
      </div>
    </template>
    <div v-else class="chat-container-item">
      <div class="chat-avatar" v-show="showAvatar">
        <el-image
          :src="item.avatar"
          fit="cover"
          style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer"
          @click="() => emits('click-avatar', item)"
        />
      </div>

      <div class="chat-content">
        <div class="chat-content-title">
          <span class="name" @click="emits('click-name', raw)">{{ item.name }}</span>
          <span class="time" :datetime="item.time">{{ humanizeTime(new Date(item.time).getTime()) }}</span>
        </div>

        <div class="chat-content-main">
          <div class="chat-content-message">
            <request-resume-message
              v-if="item.senderId !== userInfo?.currCustInfo?.id"
              content="对方想发送简历给您，您是否同意"
              :biz-status="item.bizStatus || ''"
              :is-send="true"
              @agree-send-resume="emits('agree-send-resume')"
              @refuse-send-resume="emits('refuse-send-resume')"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.chat-container-item {
  display: flex;
  gap: 5px;
  border: 1px solid transparent;
  padding: 5px;
  margin: 3px 0;
  width: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  min-height: 70px;
  .chat-checkbox {
    order: 1;
    width: 26px;
  }
  .chat-avatar {
    width: 40px;
    order: 2;
  }
  .chat-checkbox,
  .chat-avatar {
    flex-shrink: 0;
    text-align: center;
  }
  .chat-content {
    order: 3;
    flex: auto;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    overflow: hidden;
    .chat-content-title {
      height: 18px;
      display: flex;
      align-items: center;
      gap: 5px;
      user-select: none;
      .name {
        font-size: 12px;
        cursor: pointer;
      }
      .time {
        color: #8f8f8f;
        font-size: 12px;
        font-weight: 300;
      }
    }
    .chat-content-main {
      display: flex;
      flex-direction: column;
      row-gap: 2px;
      overflow: hidden;
      .chat-content-message {
        display: flex;
        width: 100%;
        align-items: end;
        > div {
          max-width: 70%;
        }
        .text-content {
          // padding: 10px;
          border-radius: 5px;
          width: fit-content;
          white-space: pre-wrap;
          word-break: break-word;
          word-wrap: break-word;
          font-size: 14px;
        }
        .sent-status {
          margin: 0 10px;

          // font-size: 12px;
          color: #8f8f8f;
          &.fail {
            color: #ff8d8d;
          }
        }
      }
      .chat-tools-menus {
        height: 20px;
        display: flex;
        gap: 8px;
        align-items: center;
        visibility: hidden;
        transition: all 0.5s ease-in;
        i:active {
          transform: scale(1.2);
        }
        i:hover {
          color: var(--text-color-theme);
        }
      }
    }
  }
  &.align-right {
    .chat-avatar {
      order: 3;
    }
    .chat-content {
      order: 2;
      .chat-content-title {
        display: flex;
        flex-direction: row-reverse;
      }
      .chat-content-main {
        .chat-content-message,
        .chat-tools-menus {
          justify-content: right;
        }
        .chat-content-message {
          flex-direction: row-reverse;
        }
        .chat-content-quote {
          margin-left: auto;
        }
      }
    }
  }
  &.system {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    font-size: 13px;
    width: inherit;
    .system-content {
      background-color: #999;
      border-radius: 3px;
      padding: 3px 10px;
      max-width: 60%;
    }
  }
  &:hover {
    .chat-content {
      .chat-content-main {
        .chat-tools-menus {
          visibility: visible;
        }
      }
    }
  }
}
</style>
