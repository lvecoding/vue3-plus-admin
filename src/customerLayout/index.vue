<template>
  <nav-bar-dashboard />
  <div class="customer-layout-container fs-15 flex">
    <!-- 侧边栏 -->
    <div v-if="pathMenuList?.length" class="side-container">
      <div
        v-for="(item, index) in pathMenuList"
        :key="index"
        :class="['side-item', item.path === route.path && 'active-side-item', thumbnail && 'thumbnail-side-item']"
        @click="handleGoPath(item.path)"
      >
        <img :src="item.icon" class="side-icon" />
        <div :class="['side-label', thumbnail && 'fs-13']">{{ item.label }}</div>
      </div>
    </div>

    <app-main class="app-main" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted } from 'vue'
import navBarDashboard from './components/navBar.vue'
import AppMain from '@/layout/components/AppMain.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { t } from 'i18next'
import { menuList } from './menuData'
import useUserStore from '@/store/modules/user'

const route = useRoute()
let thumbnail = computed(() => {
  const menuInfo: any = menuList.find(
    item => item.path === route.path || item?.subMenuList?.some(subItem => subItem.path === route.path)
  )
  return menuInfo?.label === '首页'
})
// 设置当前页面左侧菜单栏集合
let pathMenuList = computed(() => {
  const menuInfo: any = menuList.find(
    item => item.path === route.path || item?.subMenuList?.some(subItem => subItem.path === route.path)
  )
  // @ts-expect-error
  const role = useUserStore()?.userInfo?.user?.currCustInfo?.custType
  if (menuInfo) {
    return menuInfo.subMenuList?.filter((item: any) => (!item.roles || item.roles.includes(role)) && !item.hidden)
  }
  return []
})
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
onUnmounted(() => {
  sessionStorage.removeItem('nav-bar-type')
})
</script>

<style lang="scss" scoped>
.app-main {
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
  padding: 20px;
}
.customer-layout-container {
  box-sizing: border-box;
  background-color: #fff;
  min-height: calc(100vh - var(--nav-bar-height));
  padding-top: calc(var(--nav-bar-height));
}
.side-container {
  position: sticky;
  top: var(--nav-bar-height);
  height: calc(100vh - var(--nav-bar-height));
  overflow: auto;
  background-color: #f1f5f6;
  padding: 0 10px 100px;
  .side-item {
    width: 190px;
    display: flex;
    align-items: center;
    height: 32px;
    overflow: hidden;
    border-radius: 4px;
    padding: 0 10px;
    margin-top: 16px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: all 0.1s;
    color: var(--text-title-color);
    &:hover {
      background-color: #e9edf0;
    }
    .side-icon {
      width: 20px;
    }
    .side-label {
      margin-left: 15px;
    }
  }
  .active-side-item {
    background-color: #edddf6 !important;
  }
  .thumbnail-side-item {
    width: 50px;
    padding: 6px 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: auto;
    .side-label {
      margin-left: 0;
      white-space: wrap;
      text-align: center;
      margin-top: 6px;
    }
  }
}
</style>
