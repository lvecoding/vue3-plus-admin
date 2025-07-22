<template>
  <div class="nav-bar-container fs-15">
    <section class="flex aic">
      <el-icon class="icon-operation fs-20 cursor-pointer" @click="showMenu = true"><Operation /></el-icon>
      <div class="flex aic cursor-pointer" @click="handleGoIndex">
        <img src="../../assets/images/icon-customer-server.png" class="icon-logo" />
        <span class="cursor-pointer">{{ activeMenuInfo?.label }}</span>
      </div>
      <!-- 特殊处理项目管理菜单栏，下拉可选择项目 -->
      <div v-if="activeMenuInfo?.label === '首页'" class="flex aic">
        <div class="ml-6 mr-6">/</div>
        <project-select />
      </div>
    </section>

    <section class="flex aic">
      <div :class="['notice-box cursor-pointer fs-18', appStore.unReadNum && 'mr-35']" @click="showNotice = true">
        <el-badge :show-zero="false" :value="appStore.unReadNum" :max="99" class="item">
          <el-icon><Bell /></el-icon>
        </el-badge>
      </div>
      <!-- 帮助中心 -->
      <el-dropdown trigger="click" @command="handleCommand">
        <img src="../../assets/images/icon/question.svg" class="icon-question" />
        <template #dropdown>
          <el-dropdown-menu class="custom-dropdown">
            <el-dropdown-item v-for="item of questionOptions" :key="item.value" :command="item.value">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown trigger="click" @command="handleCommand">
        <div v-if="userInfo" class="avatar-box cursor-pointer">
          <img :src="userInfo?.avatar || defaultAvatar" @error="handleAvatarError" id="nav-user-avatar" class="user-avatar" />
          <div class="user-info">
            <div class="user-name line-1">{{ userInfo?.realName || userInfo?.nickName }}</div>
            <div v-if="role" class="user-role fs-12">{{ role }}</div>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="custom-dropdown">
            <el-dropdown-item v-for="item of userInfoOptions" :key="item.value" :command="item.value">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </section>
  </div>

  <!-- 通知中心 -->
  <notice v-model="showNotice" show-type="list" />

  <!-- 切换角色 -->
  <select-role
    v-model="showSwitchRole"
    ref="selectRoleRef"
    :roleLabel="role"
    :title="'请选择您要切换的其他角色'"
    :showIcon="true"
    :hasRoles="currRoles"
    @update:select-role="handleUpdateSelectRole"
  >
    <template #footer>
      <div class="introduce-footer" v-if="hasRole">
        <el-button
          class="cancel-btn"
          style="margin: 0"
          v-if="currRole === selectedRole.toLocaleUpperCase()"
          @click="showSwitchRole = false"
          >取消</el-button
        >
        <div v-else class="introduce-footer">
          <el-button class="cancel-btn" @click="showSwitchRole = false">取消</el-button>
          <el-button class="confirm-btn" @click="handleChangeRole">确认切换</el-button>
        </div>
      </div>
      <div class="introduce-footer" v-else>
        <el-button class="cancel-btn" @click="showSwitchRole = false">取消</el-button>
        <el-button class="confirm-btn" @click="handleConfirm">去入驻</el-button>
      </div>
    </template>
  </select-role>

  <!-- 总菜单 -->
  <main-menu v-model="showMenu" />
</template>

<script lang="ts" setup>
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import SelectRole from '@/components/SelectRole/index.vue'
import ProjectSelect from './projectSelect.vue'
import Notice from '@/views/user/notice.vue'
import MainMenu from './menu.vue'
import defaultAvatar from '@/assets/images/default-avatar.png'
import { computed, getCurrentInstance, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { switchRole } from '@/api/customer'
import { menuList } from '../menuData'

const { proxy }: any = getCurrentInstance()
const { sys_customer_category } = proxy.useDict('sys_customer_category')
const questionOptions = [
  { label: '帮助中心', value: 'help' },
  { label: '问题反馈', value: 'feedback' }
]
const userInfoOptions = ref([
  { label: '角色切换', value: 'switchRole' },
  { label: '官网首页', value: 'home' },
  { label: '退出登录', value: 'logout' }
])
let userInfo: any = computed(() => {
  // @ts-expect-error
  return useUserStore()?.userInfo?.user
})
let showMenu = ref<boolean>(false)
let selectedRole = ref<string>('entrepreneur')
const role = computed(() => {
  return sys_customer_category?.value?.find((item: any) => item.value === userInfo.value?.currCustInfo?.custType)?.label
})
const currRole = computed(() => {
  return sys_customer_category?.value?.find((item: any) => item.value === userInfo.value?.currCustInfo?.custType)?.value
})
const currRoles = computed(() => {
  return userInfo.value?.custInfos
    ?.filter(item => item?.custType != 'NULL')
    .map(el => {
      return el?.custType
    })
})
let hasRole = computed(() => {
  return currRoles.value?.includes(selectedRole.value.toLocaleUpperCase())
})
const showSwitchRole = ref<boolean>(false)
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
let showNotice = ref<boolean>(false)
const activeMenuInfo = computed(() => {
  const menuInfo = menuList.find(
    item => item.path === route.path || item?.subMenuList?.some(subItem => subItem.path === route.path)
  )
  return menuInfo
})

/** 图片加载失败 */
const handleAvatarError = () => {
  if (!userInfo.value) return
  userInfo.value.currCustInfo['avatar'] = defaultAvatar
}

/** 操作下拉菜单 */
const handleCommand = async (command: string) => {
  if (command === 'logout') {
    return logout()
  }
  if (command === 'switchRole') {
    showSwitchRole.value = true
    return
  }
  if (command === 'home') {
    router.push('/home')
    return
  }

  if (command === 'help') {
    window.open('https://help.Vue3PlusAdmin.com', '_blank')
    return
  }
  if (command === 'feedback') {
    window.open('/feedback', '_blank')
    return
  }
}
/** 退出登录 */
const logout = async () => {
  await proxy.$modal.confirm('确定退出登录吗？')
  await useUserStore().logOut()
  router.push('/customer/login')
}

/** 选中要切换到角色 */
const handleUpdateSelectRole = (selectRole: string) => {
  selectedRole.value = selectRole
}
/** 确认切换角色 */
const handleChangeRole = async () => {
  const info = userInfo.value.custInfos.find(item => item.custType === selectedRole.value.toLocaleUpperCase())
  await switchRole({}, info.id)
  window.location.reload()
}
/** 点击确认按钮 */
const handleConfirm = () => {
  showSwitchRole.value = false
  window.location.href = `/settlement?role=${selectedRole.value}`
}

const handleGoIndex = () => {
  if (!activeMenuInfo.value?.path) {
    return
  }
  router.push(activeMenuInfo.value?.path)
}
</script>

<style lang="scss" scoped>
.nav-bar-container {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--nav-bar-height);
  padding: 0 20px;
  background-color: #fff;
  border-bottom: solid 1px #e9edf0;
  color: var(--text-title-color);
}
.icon-operation {
  color: rgb(166 166 166);
  &:hover {
    color: var(--text-color-theme);
  }
}
.icon-logo {
  height: 22px;
  margin-left: 20px;
  margin-right: 10px;
}
.notice-box {
  position: relative;
  line-height: 0;
  margin-right: 25px;
}
.icon-question {
  width: 20px;
  height: 20px;
  margin-right: 25px;
  cursor: pointer;
}
.avatar-box {
  display: flex;
  align-items: center;
  color: var(--text-title-color);
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 22px;
    background-color: #fff;
    object-fit: cover;
  }
  .user-info {
    margin-left: 6px;
  }
  .user-name {
    max-width: 100px;
  }
  .user-role {
    display: inline-block;
    margin-top: 4px;
    padding: 4px 8px;
    background: linear-gradient(75deg, #8d00ff 0%, #d80080 100%);
    border-radius: 20px;
    color: #fff;
  }
}
</style>
