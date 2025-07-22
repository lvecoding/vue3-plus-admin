<template>
  <div class="layout-container">
    <nav-bar bg />
    <div class="customer-layout-container flex">
      <div v-if="activeMenuInfo?.subMenuList?.length" class="side-container">
        <div class="side-title">{{ activeMenuInfo?.label || '' }}</div>
        <div
          v-for="(item, index) in activeMenuInfo.subMenuList"
          :key="index"
          :class="['side-item', route.path === item.path && 'active-side-item']"
          @click="handleGoPath(item.path, item?.query)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="ml-20" :style="{ width: activeMenuInfo?.subMenuList?.length ? 'calc(100% - 180px)' : '100%' }">
        <app-main class="app-main" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppMain from '@/layout/components/AppMain.vue'
import useUserStore from '@/store/modules/user'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menuList } from './menuData'
import { ElNotification } from 'element-plus'
import { t } from 'i18next'

const userStore = useUserStore()
let userMenuList = computed(() => {
  // @ts-expect-error
  const role = userStore?.userInfo?.user?.currCustInfo?.custType
  if (!role) {
    return []
  }
  return menuList
    .filter((item: any) => !item?.roles || (item?.roles?.includes(role) && !item.hidden))
    .map(item => {
      return {
        ...item,
        subMenuList: item?.subMenuList?.filter(
          (subItem: any) => (!subItem?.roles || subItem?.roles?.includes(role)) && !subItem.hidden
        )
      }
    })
})
const activeMenuInfo = computed(() => {
  const activeInfo = userMenuList.value?.find(item => item.path === route.path)
  return (activeInfo || {}) as {
    subMenuList?: any[]
    label?: string
    path?: string
  }
})
const route = useRoute()
const router = useRouter()
/** 跳转页面 */
const handleGoPath = (path = '', query = undefined) => {
  if (!path) {
    return ElNotification.warning({
      title: t('系统提示'),
      message: t('功能正在开发中，敬请期待！')
    })
  }
  router.push({
    path,
    query
  })
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: 100%;
  width: 100%;
  position: relative;
  overflow-y: hidden;
}
.layout-container {
  background-color: #f2f2f2;
  min-height: 100%;
  padding-top: calc(var(--nav-bar-height) + 10px);
}
.customer-layout-container {
  width: var(--page-content-width);
  padding: 10px 0 30px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  min-height: calc(100vh - 74px);
  margin: 0 auto;
}
.side-container {
  // top: 94px;
  width: 180px;
  height: calc(100vh - 130px);
  overflow: auto;
  background-color: #fff;
  border-radius: 10px;

  // box-shadow: 0 0 45px 0 rgb(0 0 0 / 10%);
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .side-title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
  }
  .side-item {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
    cursor: pointer;
  }
  .active-side-item {
    color: var(--text-color-theme);
  }
}
</style>
