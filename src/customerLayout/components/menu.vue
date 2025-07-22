<template>
  <section :class="['menu-container fs-15', show && 'active-menu-container']">
    <header class="menu-header">
      <el-icon class="icon-operation fs-20 cursor-pointer" @click="handleClose"><Operation /></el-icon>
      <img src="../../assets/images/icon-customer-server.png" class="icon-logo cursor-pointer" />
      <span class="cursor-pointer">工作台</span>
    </header>

    <main class="menu-content fs-15">
      <div class="menu-item" @click="handleGoPath('/customer/workbench')">
        <img src="../../assets/images/icon/icon-home.svg" class="menu-icon" />
        <div class="menu-item-value">工作台</div>
      </div>
      <div class="menu-title fs-14">通用</div>
      <div v-for="(item, index) in menuList" :key="index" class="menu-item" @click="handleGoPath(item.path)">
        <img :src="item.icon" class="menu-icon" />
        <div class="menu-item-value">{{ item.label }}</div>
      </div>
    </main>
  </section>
</template>

<script lang="ts" setup>
import useUserStore from '@/store/modules/user'
import { getAssetsFile } from '@/utils/image'
import { computed, onUnmounted, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
let show = ref<boolean>(false)
/** 监听全局点击 */
const handleDocumentClick = (e: MouseEvent) => {
  const menuEl = document.querySelector('.menu-container')
  const targetEl = e.target as HTMLElement

  // 如果点击的不是菜单本身且菜单处于展开状态
  if (menuEl && !menuEl.contains(targetEl) && show.value) {
    handleClose()
  }
}
watch(
  () => props.modelValue,
  val => {
    if (val) {
      document.addEventListener('click', handleDocumentClick)
    } else {
      document.removeEventListener('click', handleDocumentClick)
    }
    setTimeout(() => {
      show.value = val
    }, 10)
  },
  { immediate: true, deep: true }
)
const options: {
  label: string
  path: string
  icon: string
  roles?: string[]
}[] = [
  {
    label: '项目协作',
    path: '/customer/project',
    icon: getAssetsFile('icon/icon-menu.svg'),
    roles: ['ENTREPRENEUR', 'INVESTOR', 'ENGINEER']
  },
  { label: '工程师', path: '/customer/engineer/search', icon: getAssetsFile('icon/icon-engineer.svg'), roles: ['ENTREPRENEUR'] },
  { label: '供应商', path: '/customer/supplier/search', icon: getAssetsFile('icon/icon-supplier.svg'), roles: ['ENTREPRENEUR'] },
  {
    label: '合同管理',
    path: '/customer/contract',
    icon: getAssetsFile('icon/icon-contract.svg'),
    roles: ['ENGINEER', 'AGENT', 'INVESTOR', 'SUPPLIER', 'ENTREPRENEUR']
  },
  {
    label: '结算管理',
    path: '/customer/settlementManagement/capitalDetail',
    icon: getAssetsFile('icon/icon-settlement.svg'),
    roles: ['ENGINEER', 'AGENT', 'INVESTOR', 'SUPPLIER', 'ENTREPRENEUR']
  },
  {
    label: '知识库',
    path: '/customer/knowledge/overview',
    icon: getAssetsFile('icon/icon-knowledge.svg'),
    roles: ['ENGINEER', 'AGENT', 'INVESTOR', 'SUPPLIER', 'ENTREPRENEUR']
  }
]
/** 根据当前登录的角色类型筛选出对应的菜单栏 */
const menuList = computed(() => {
  // @ts-expect-error
  const role = useUserStore()?.userInfo?.user?.currCustInfo?.custType || ''
  const list = options.filter(item => !item.roles || item.roles?.includes(role))
  return list || []
})
/** 关闭 */
const handleClose = () => {
  emit('update:modelValue', false)
}

/** 点击跳转 */
const handleGoPath = (url: string) => {
  window.open(url, '_blank')
}

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style lang="scss" scoped>
.menu-container {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: -280px;
  width: 280px;
  height: 100%;
  background-color: #fff;
  transition: all 0.3s;
}
.active-menu-container {
  left: 0;
  box-shadow: 0 10px 20px 0 rgb(0 0 0 / 30%);
}
.menu-header {
  display: flex;
  align-items: center;
  height: var(--nav-bar-height);
  padding: 0 20px;
  border-bottom: solid 1px #e9edf0;
  color: #6e6e6e;
}
.icon-operation {
  color: rgb(166 166 166);
  &:hover {
    color: var(--text-color-theme);
  }
}
.icon-logo {
  height: 24px;
  margin-left: 20px;
  margin-right: 10px;
}
.menu-content {
  padding: 20px;
}
.menu-item {
  display: flex;
  align-items: center;
  height: 32px;
  overflow: hidden;
  border-radius: 4px;
  padding: 0 20px;
  margin-top: 10px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.1s;
  color: var(--text-title-color);
  &:hover {
    background-color: #f5f5f5;
  }
  .menu-item-value {
    margin-left: 15px;
  }
  .menu-icon {
    width: 18px;
  }
}
.menu-title {
  color: #6e6e6e;
  padding: 0 20px;
  margin-top: 40px;
  margin-bottom: 16px;
}
</style>
