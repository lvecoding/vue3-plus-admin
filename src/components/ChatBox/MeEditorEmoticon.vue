<script lang="ts" setup>
import { emojis } from './emojis'

const emit = defineEmits(['on-select'])
const onSendEmoticon = (type: any, value: any, img = '') => {
  if (img) {
    const imgSrcReg = /<img.*?src='(.*?)'/g
    let match = imgSrcReg.exec(img)
    if (match) {
      emit('on-select', { type, value, img: match[1] })
    }
  } else {
    emit('on-select', { type, value, img })
  }
}
</script>
<template>
  <section class="el-container is-vertical section height100 custom-scrollbar">
    <header class="el-header em-header border-bottom">系统表情</header>
    <main class="symbol-box">
      <div class="options">
        <div
          v-for="(img, key) in emojis"
          v-html="img"
          :key="key"
          @click="onSendEmoticon(1, key, img)"
          class="option pointer flex-center"
        />
      </div>
    </main>
  </section>
</template>
<style lang="scss" scoped>
.section {
  height: 250px;
  overflow: hidden;
  background-color: #fff;
  padding-bottom: 10px;
  border-radius: 3px;
  .em-header {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    .sys-btn {
      color: #409eff;
      cursor: pointer;
    }
  }
  .em-main {
    height: 100px;
    padding-bottom: 20px;
  }
  .em-footer {
    height: 32px;
  }
  .tabs {
    display: flex;
    align-items: center;
    .tab {
      position: relative;
      height: 26px;
      width: 26px;
      margin: 2px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      &.active {
        background-color: var(--im-active-bg-color);
      }
      .tip {
        position: absolute;
        left: 0;
        top: -32px;
        height: 26px;
        min-width: 20px;
        white-space: pre;
        padding: 0 5px;
        font-size: 12px;
        border-radius: 2px;
        background-color: var(--im-active-bg-color);
        display: none;
        align-items: center;
        color: var(--im-text-color);
      }
      &:hover {
        .tip {
          display: flex;
        }

        background-color: var(--im-active-bg-color);
      }
    }
  }
  .symbol-box {
    overflow: auto;
    padding: 10px;
    .title {
      width: 50%;
      height: 25px;
      line-height: 25px;
      color: #ccc;
      font-weight: 400;
      padding-left: 8px;
      font-size: 12px;
    }
    .options {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .option {
        height: 32px;
        width: 32px;
        margin: 2px;
        font-size: 24px;
        user-select: none;
        transition: all 0.5s;
        &:hover {
          transform: scale(1.5);
        }
      }
    }
    ::-webkit-scrollbar {
      width: 4px; /* 滚动条宽度 */
    }
  }
  .collect-box {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    .upload-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #858585;
      span {
        font-size: 13px;
      }
    }
    .item {
      position: relative;
      width: 70px;
      height: 70px;
      background-color: #eff1f7;
      margin: 5px;
      border-radius: 5px;
      overflow: hidden;
      .mask {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        width: 25px;
        height: 25px;
        background-color: #f5f5f5;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
      }
      &:hover {
        .mask {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
.custom-scrollbar {
  scrollbar-width: thin; /* 可选值：auto | thin | none */
  scrollbar-color: #888 #f1f1f1; /* 滑块颜色 轨道颜色 */
}
html[theme-mode="dark"] {
  .collect-box .item {
    background-color: #2c2c32;
  }
}
</style>
