<template>
  <section class="resume-message-box">
    <main class="flex aic">
      <div class="icon-box">
        <el-icon><Document /></el-icon>
      </div>
      {{ info.name }}
    </main>
    <footer class="footer-btn" @click="handleViewResume">预览在线简历</footer>
  </section>

  <!-- 预览在线简历 -->
  <el-dialog v-model="visible" :title="info?.name" width="800px">
    <resume-box :can-edit="false" :customer-id="info.id" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ResumeBox from '@/components/ResumeBox/index.vue'

const { info } = defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})

/** 点击预览简历 */
let visible = ref<boolean>(false)
const handleViewResume = () => {
  visible.value = true
}
</script>

<style lang="scss" scoped>
.resume-message-box {
  width: 280px;
  border-radius: 6px;
  position: relative;
  padding: 12px;
  word-break: break-word;
  background: linear-gradient(180deg, rgb(141 0 255 / 12%), #fff 60%);
  border: 1px solid rgb(141 0 255 / 20%);
  font-size: 14px;
  color: var(--text-title-color);
  .icon-box {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--text-color-theme);
    margin-right: 10px;
    color: #fff;
    font-size: 24px;
  }
  .footer-btn {
    height: 34px;
    background: rgb(141 0 255 / 20%);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-title-color);
    line-height: 34px;
    padding: 0 5px;
    cursor: pointer;
    overflow: hidden;
    text-align: center;
    transition: background 0.2s;
    margin-top: 16px;
  }
}
.user-container {
  height: calc(100vh - 200000px);
  overflow: auto;
}
</style>
