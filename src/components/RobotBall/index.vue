<template>
  <div class="robot-ball-box">
    <div :class="['option-list', show && 'active-option-list']">
      <el-popover placement="left" v-if="show">
        <template #reference>
          <div class="option-item">
            <img src="../../assets/images/icon/icon-scan.png" class="icon-code" />
            {{ $t('扫码咨询') }}
          </div>
        </template>
        <template #default>
          <div class="icon-wechat-code">
            <img :src="configInfo.siteContactPic" style="width: 124px; height: 124px;" />
          </div>
        </template>
      </el-popover>
      <el-popover width="240px" placement="left" v-if="show">
        <template #reference>
          <div class="option-item">
            <img src="../../assets/images/icon/icon-phone.png" class="icon-code" />
            {{ $t('热线电话') }}
          </div>
        </template>
        <template #default>
          <div class="flex aic"><span class="color-theme">咨询电话：</span>{{ configInfo.siteCompanyPhone }}</div>
        </template>
      </el-popover>
      <div
        class="option-item"
        @click="
          () => {
            showChat = true
            show = false
          }
        "
      >
        <img src="../../assets/images/icon/icon-people.png" class="icon-code" />
        {{ $t('聊天') }}
      </div>
      <div class="option-item" @click="HandleClickHelp">
        <img src="../../assets/images/icon/icon-document.png" class="icon-code" />
        {{ $t('手册') }}
      </div>
    </div>

    <div
      class="server-box"
      :style="{
        left: `${ballPosition.x}px`,
        bottom: `${ballPosition.y}px`
      }"
    >
      <div
        class="robot-ball cursor-pointer"
        @click="handleClick"
        @mouseenter="scaleShow = true"
        @mouseleave="scaleShow = false"
        :class="[show && 'robot-ball-active']"
        :style="{ transform: scaleShow ? 'scale(1.1)' : 'scale(1.0)' }"
      >
        <transition name="icon-transition" mode="out-in">
          <el-icon v-if="show || showChat" style="color: #fff;" :class="['fs-18', isPc ? '' : 'fs-32']"><ArrowDownBold /></el-icon>
          <img v-else src="../../assets/images/icon/icon-user.png" style="width: 28px; font-size: 0;" />
        </transition>
      </div>
      <div class="chat-box fs-12">客服</div>
      <!-- AI客服聊天框 -->
      <ai-chat v-model="showChat" />
    </div>

    <div :class="['icon-up cursor-pointer', showTop && 'active-icon-up']" @click="handleScrollToTop">
      <img v-if="isPc" src="../../assets/images/icon-up.png" />
      <img v-else src="../../assets/images/footer/icon-up.png" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import AiChat from './components/AIChat.vue'
import useAppStore from '@/store/modules/app'
import { computed } from 'vue'
import { DeviceType } from '@/utils/deviceDetector'
import { getSite } from '@/api/ows/site'

let show = ref<boolean>(false)
let showChat = ref<boolean>(false)
const scaleShow = ref<boolean>(false)
const appStore = useAppStore()
const isPc = computed(() => appStore.deviceType === DeviceType.PC) // 是否是手机环境
const configInfo = ref<any>()

/** 鼠标点击 */
const handleClick = () => {
  if (!isPc.value) {
    showChat.value = !showChat.value
    return
  }
  if (showChat.value) {
    showChat.value = false
    scaleShow.value = !scaleShow.value
    return
  }
  show.value = !show.value
  scaleShow.value = !scaleShow.value
}

watch(
  () => showChat.value,
  val => {
    if (val) {
      cancelWatchTouch()
    } else {
      handleWatchTouch()
    }
  }
)

/** 监听滚动 */
let showTop = ref<boolean>(false)
const handleScroll = () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop > 200 && !showTop.value) {
    showTop.value = true
    return
  }
  if (scrollTop < 200 && showTop.value) {
    showTop.value = false
  }
}
const HandleClickHelp = () => {
  window.open(configInfo.value.helpUrl)
}
const getConfigInfo = async () => {
  const { data } = await getSite()
  configInfo.value = data
}
/** 滚动到顶部 */
const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const showChatBox = () => {
  handleClick()
  showChat.value = true
  show.value = false
}

/** 手动操作悬浮小球 */
const ballPosition = ref({
  x: 0, // 初始右侧位置
  y: 0
})
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })
const startTouchPos = ref({ x: 0, y: 0 })

// 磁吸阈值（距离边缘多少像素时吸附）
const SNAP_THRESHOLD = 30

// 处理触摸开始
const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  startPos.value = { ...ballPosition.value }
  startTouchPos.value = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  }

  // 防止页面滚动
  // e.preventDefault()
}

// 处理触摸移动
const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return

  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY

  // 计算位移
  const deltaX = currentX - startTouchPos.value.x
  const deltaY = currentY - startTouchPos.value.y

  console.log('查看偏移数据==>', startPos.value.x + deltaX, startPos.value.y - deltaY)

  ballPosition.value = {
    x: Math.min(startPos.value.x + deltaX, 0),
    y: Math.min(startPos.value.y - deltaY, window.innerHeight - 220) // Y轴方向相反
  }

  e.preventDefault()
}

// 处理触摸结束（实现磁吸效果）
const handleTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false

  // 检查是否需要左吸附
  if (ballPosition.value.x < SNAP_THRESHOLD) {
    ballPosition.value.x = 0
  }
  // 检查是否需要右吸附
  else if (ballPosition.value.x > window.innerWidth - SNAP_THRESHOLD) {
    ballPosition.value.x = window.innerWidth - 50 // 小球宽度
  }

  // 检查是否需要顶部吸附
  if (ballPosition.value.y < SNAP_THRESHOLD) {
    ballPosition.value.y = 0
  }
  // 检查是否需要底部吸附
  else if (ballPosition.value.y > window.innerHeight - SNAP_THRESHOLD) {
    ballPosition.value.y = window.innerHeight - 50 // 小球高度
  }
}
/** 监听滑动 */
const handleWatchTouch = () => {
  const ballElement: any = document.querySelector('.server-box')
  if (ballElement) {
    ballElement.addEventListener('touchstart', handleTouchStart, { passive: false })
    ballElement.addEventListener('touchmove', handleTouchMove, { passive: false })
    ballElement.addEventListener('touchend', handleTouchEnd, { passive: false })
  }
}
/** 取消监听滑动 */
const cancelWatchTouch = () => {
  const ballElement: any = document.querySelector('.server-box')
  if (ballElement) {
    ballElement.removeEventListener('touchstart', handleTouchStart)
    ballElement.removeEventListener('touchmove', handleTouchMove)
    ballElement.removeEventListener('touchend', handleTouchEnd)
  }
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  getConfigInfo()
  handleWatchTouch()
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  cancelWatchTouch()
})

defineExpose({ showChatBox })
</script>

<style lang="scss" scoped>
/* 进入/离开的激活状态 */
.icon-transition-enter-active,
.icon-transition-leave-active {
  transition: all 0.3s ease-in-out;
  position: absolute; /* 避免布局抖动 */
}

/* 进入前/离开后的状态 */
.icon-transition-enter-from,
.icon-transition-leave-to {
  opacity: 0;
}
.robot-ball-box {
  position: fixed;
  z-index: 800;
  bottom: 40px;
  right: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.server-box {
  position: relative;
  z-index: 2;
  width: 50px;
  height: 50px;
  margin: 0 auto;
}
.robot-ball {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  background-color: var(--text-color-theme);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.robot-ball-active {
  transition: all 0.2s;
  transform: scale(1.3);
}
.chat-box {
  background: #fff;
  border-radius: 10px;
  width: 50px;
  height: 54px;
  position: absolute;
  z-index: 2;
  left: 0;
  bottom: -25px;
  text-align: center;
  line-height: 80px;
  color: var(--text-color-theme);
  box-shadow: 0 0 20px rgb(0 0 0 / 14%);
}
.option-list {
  z-index: 800;
  width: 80px;
  height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 16px;
  transition: all 0.3s;
  box-shadow: 0 0 12px rgb(0 0 0 / 12%);
}
.option-item {
  width: 100%;
  height: 76px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  color: #333;
  cursor: pointer;
  border-bottom: solid #e8e8e8 1px;
  &:hover {
    color: var(--text-color-theme);
  }
  &:first-child {
    border-bottom: none;
  }
  .icon-code {
    width: 25px;
    height: 25px;
    margin-bottom: 4px;
  }
}
.active-option-list {
  height: calc(76px * 4);
}
.icon-wechat-code {
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon-up {
  width: 50px;
  height: 0;
  transition: all 0.3s;
  margin: 40px auto 0;
  img {
    width: 100%;
    height: 100%;
  }
}
.active-icon-up {
  height: 67px;
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 1024px) {
  .server-box {
    width: 100px;
    height: 100px;
    margin-left: 15px;
  }
  .chat-box {
    width: 100px;
    height: 120px;
    bottom: -60px;
    line-height: 180px;
    font-size: 24px !important;
  }
  .robot-ball-box {
    bottom: 100px;
    width: 100px;
    right: 35px;
  }
  .icon-up {
    width: 140px;
    margin-top: 60px;
  }
  .active-icon-up {
    height: 140px;
  }
}
</style>
