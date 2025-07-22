<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="appStore.sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!settingsStore.topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="settingsStore.topNav" />

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <header-search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="主题模式" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect theme-switch-wrapper" @click="toggleTheme">
            <svg-icon v-if="settingsStore.isDark" icon-class="sunny" />
            <svg-icon v-if="!settingsStore.isDark" icon-class="moon" />
          </div>
        </el-tooltip>
        <!-- 消息通知 -->
        <div class="right-menu-item hover-effect mr-10" style="line-height: normal" @click="showNotice = true">
          <el-badge :show-zero="false" :value="appStore.unReadNum" :max="99">
            <el-icon><Bell /></el-icon>
          </el-badge>
        </div>

        <language-select id="language-select" class="right-menu hover-effect" />
        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar" @error="handleLoadAvatarError" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <!-- 消息中心 -->
  <notice v-model="showNotice" show-type="list" />
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import LanguageSelect from '@/components/LanguageSelect'
import HeaderSearch from '@/components/HeaderSearch'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import defaultAvatar from '@/assets/images/default-avatar.png'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { notifyUnread } from '@/api/notify'
import Notice from '@/views/user/notice.vue'
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

let avatar = ref(userStore?.user?.currCustInfo?.avatar || defaultAvatar)
function toggleSideBar() {
  appStore.toggleSideBar()
}

function handleCommand(command) {
  switch (command) {
    case 'setLayout':
      setLayout()
      break
    case 'logout':
      logout()
      break
    default:
      break
  }
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await userStore.logOut()
      userStore.handleLogin()
    })
    .catch(() => {})
}

const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout')
}

function toggleTheme() {
  settingsStore.toggleTheme()
}

/** 图片加载失败 */
const handleLoadAvatarError = () => {
  avatar.value = defaultAvatar
}

/** 统计未读消息 */
let showNotice = ref(false)
const getNotifyUnread = async () => {
  if (!useUserStore().token) {
    return
  }
  const { data } = await notifyUnread()
  appStore.unReadNum = (data?.todoCount || 0) + (data?.messageCount || 0) || 0
}

onMounted(() => {
  // getNotifyUnread()
})
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: var(--navbar-bg);
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgb(0 0 0 / 2.5%);
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .topmenu-container {
    position: absolute;
    left: 50px;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-flex;
      align-items: center;
      padding: 0 12px;
      height: 100%;
      font-size: 18px;
      color: var(--navbar-text);
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgb(0 0 0 / 2.5%);
        }
      }
      &.theme-switch-wrapper {
        display: flex;
        align-items: center;
        svg {
          transition: transform 0.3s;
          &:hover {
            transform: scale(1.15);
          }
        }
      }
    }
    .avatar-container {
      margin-right: 16px;
      display: flex;
      align-items: center;
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        i {
          cursor: pointer;
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
