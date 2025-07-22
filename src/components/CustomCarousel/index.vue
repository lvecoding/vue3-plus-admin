<template>
  <el-carousel
    ref="carousel"
    motion-blur
    :interval="props.time * 1000"
    indicator-position="outside"
    :autoplay="false"
    :arrow="bannerList.length > 1 ? 'hover' : 'never'"
    class="banner-container"
    @change="handleChange"
  >
    <el-carousel-item v-for="item in bannerList" :key="item.id">
      <div class="banner-box" @click="handleClickBanner(item?.link || '')">
        <img :src="item.pic" />
        <div v-if="item.bcontent" class="banner-title fs-82">{{ item.bcontent }}</div>
        <div v-if="item.introduction" class="banner-desc fs-28">{{ item.introduction }}</div>
        <div v-if="item.button && Array.isArray(item.button) && item.button.length" class="banner-btn flex aic">
          <custom-button
            v-for="(buttonItem, buttonIndex) in item.button"
            :key="buttonItem.name"
            :button-type="buttonIndex % 2 === 0 ? 'theme' : 'default'"
            :text="buttonItem.name"
            :class="[buttonIndex && 'ml-80', 'custom-button']"
            @click.stop="handleClickBanner(buttonItem?.link)"
          />
        </div>
      </div>
    </el-carousel-item>
    <!-- 定时滚动条 -->
    <div v-if="props.list.length > 1" class="scroll-bar-container">
      <div v-for="(item, index) in props.list" :key="index" class="scroll-bar-box" @click="handleGoIndex(index)">
        <div :class="['scroll-bar-item', index === activeIndex && 'active-scroll-bar']" />
      </div>
    </div>
  </el-carousel>
</template>

<script lang="ts" setup>
import customButton from '@/views/home/components/customButton.vue'
import { nextTick, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  index: {
    type: Number,
    default: 0
  },
  time: {
    type: Number,
    default: 7
  }
})

let bannerList = ref<any[]>([])
watch(
  () => props.list,
  val => {
    console.log('查看数据==>', val)
    if (val && val.length) {
      bannerList.value = val.map((item: any) => {
        return {
          ...item,
          button: (item.button && Array.isArray(item.button) && item.button.filter(button => button?.name)) || []
        }
      })
      nextTick(() => {
        activeIndex.value = 0
        handleSetLoop()
      })
    }
  },
  { deep: true, immediate: true }
)

let activeIndex = ref<number>(-1)
let carousel = ref<any>(null)
/** 每个七秒滚动 */
let timer: number | undefined = 0
const handleSetLoop = () => {
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % props.list.length
    carousel.value.setActiveItem(activeIndex.value)
  }, 7 * 1000)
}
/** 切换到指定位置的index */
const handleGoIndex = (index: number) => {
  console.log('查看数据==>', index, activeIndex.value)
  if (index === activeIndex.value) {
    return
  }
  clearInterval(timer)
  activeIndex.value = index
  carousel.value && carousel.value.setActiveItem(index)
  handleSetLoop()
}
/** 左右切换 */
const handleChange = current => {
  clearInterval(timer)
  activeIndex.value = current
  handleSetLoop()
}

/** 点击banner */
const handleClickBanner = (path: string) => {
  if (!path) {
    return
  }
  window.open(path, path.includes('Vue3PlusAdmin.com') || path.includes('localhost') ? '_self' : '_blank')
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.banner-container {
  position: relative;
  width: 100%;
  height: 750px;
  margin-top: calc(-1 * var(--nav-bar-height));
}
:deep(.el-carousel__container) {
  height: 100% !important;
}
.banner-box {
  width: 100%;
  height: 100%;
  padding-left: 240px;
  padding-top: 150px;
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .banner-info {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: HarmonyOS Bold;
  }
  .banner-title {
    position: relative;
    z-index: 2;
    font-weight: 900;
    color: #fff;
  }
  .banner-desc {
    position: relative;
    z-index: 2;
    font-weight: 500;
    letter-spacing: 4px;
    color: #fff;
  }
  .banner-btn {
    position: relative;
    z-index: 2;
    margin-top: 60px;
  }
}
.scroll-bar-container {
  position: absolute;
  top: 610px;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -15px;
  .scroll-bar-box {
    position: relative;
    width: 135px;
    height: 3px;
    border-radius: 150px;
    background-color: rgb(255 255 255 / 70%);
    margin-left: 15px;
    cursor: pointer;
    .scroll-bar-item {
      width: 0;
      height: 100%;
      border-radius: 150px;
      background-color: rgb(141 0 255 / 100%);
      transition: width 0.1s ease;
    }
    .active-scroll-bar {
      width: 100%;
      transition: width 7s;
    }
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 1024px) {
  .banner-box {
    padding-top: 300px;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .banner-desc {
    margin-top: 30px;
    white-space: pre-line;
    text-align: center;
  }
}
</style>
