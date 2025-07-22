<template>
  <el-dropdown type="info" trigger="click" :disabled="!options?.length" @command="handleCommand" @click.stop="handleClick">
    <span class="el-dropdown-link cursor-pointer">
      {{ selectProject?.projectName || '请选择项目' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in options" :key="item.projectId" :command="item?.projectId">{{
          item?.projectName
        }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="projectSelect">
import { computed, getCurrentInstance, ref } from 'vue'
import { listSelectProject } from '@/api/project/index'
import useAppStore from '@/store/modules/app'

// 定义子组件向父组件传值/事件
const { proxy }: any = getCurrentInstance()
const appStore = useAppStore()
/** 选中项目 */
const handleCommand = value => {
  const projectInfo = options.value.find(item => item?.projectId === value)
  appStore.setSelectProject(projectInfo)
}
/** 菜单栏点击 */
const handleClick = () => {
  if (!options.value?.length) {
    proxy.$modal.msgError('您还未创建任何项目')
  }
}
let selectProject = computed(() => {
  return (appStore?.selectProject || {}) as any
})
let options = ref<any[]>([])

const getData = async () => {
  const { data }: any = await listSelectProject({})
  options.value = data
}
getData()
</script>

<style lang="scss" scoped>
.el-dropdown-link {
  color: #666 !important;
}
</style>
