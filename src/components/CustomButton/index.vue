<template>
  <el-button
    round
    :class="[
      'custom-btn cursor-pointer',
      props.buttonType === 'theme' && 'theme-btn',
      props.buttonType === 'black' && 'black-btn',
      active && props.buttonType !== 'black' ? 'active-btn' : ''
    ]"
    @mouseenter="
      () => {
        if (isPc) {
          active = true
        }
      }
    "
    @mouseleave="
      () => {
        if (isPc) {
          active = false
        }
      }
    "
  >
    <div class="aic flex" :style="{ paddingLeft: `${parseFloat(props.size || 14) + 4}px` }">
      {{ $t(props.text || '') }}
      <div :style="{ fonstSize: (props.size || 14) + 'px', width: (props.size || 14) * 2 + 'px' }" class="icon-arrow">
        <svg-icon
          icon-class="arrowLine"
          class="icon-arrow-line"
          :style="{ width: (active && (props.size || 14) + 'px') || '' }"
        />
        <svg-icon icon-class="arrowRight" class="icon-arrow-right" />
      </div>
    </div>
  </el-button>
</template>

<script lang="ts" setup>
import useAppStore from '@/store/modules/app'
import { DeviceType } from '@/utils/deviceDetector'
import { computed } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  // 按钮主题色类型，目前分为theme（主题色），default（白色），black（黑色）三种
  buttonType: {
    type: String,
    value: 'default'
  },

  // 文案
  text: {
    type: String,
    value: ''
  },

  // icon大小
  size: {
    type: Number,
    value: 14
  },

  // 鼠标悬浮是否改变背景色
  hoverChangeBg: {
    type: Boolean,
    value: true
  }
})
let active = ref<boolean>(false)
const isPc = computed(() => useAppStore().deviceType === DeviceType.PC) // 是否是手机环境
</script>

<style lang="scss" scoped>
.custom-btn {
  width: 170px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 14px;
  box-sizing: border-box;
  background: #fff;
  border: none;
  font-weight: bold;
  font-family: HarmonyOS Bold;
  color: var(--text-color-theme);
  border-radius: 30px;
  transition: all 0.2s;
}
.theme-btn {
  background: linear-gradient(75deg, #8d00ff 0%, #d80080 100%);
  font-family: HarmonyOS Bold;
  color: #fff;
}
.black-btn {
  background: black;
  font-family: HarmonyOS Bold;
  color: #fff;
}
.active-btn {
  background: #d80080;
  box-shadow: 0 0 15px 0 #d80080;
  color: #fff;
}
.icon-box {
  width: 30px;
  display: flex;
  align-items: center;
}
.icon-arrow-line {
  width: 0;
  transition: all 0.2s;
}
.icon-arrow {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 3px;
}

@media screen and (max-width: 1024px) {
  .custom-btn {
    width: 340px;
    height: 80px;
    font-size: 26px;
    border-radius: 100px;
  }
}
</style>
