<template>
  <!-- 表格展示形式 -->
  <div v-if="props.showType === 'table'" class="user-container">
    <custom-form ref="queryFormRef" :form="queryFormSetting" @search="getList" @reset="getList" />
    <custom-table
      :columns="columns"
      :table-data="list"
      :loading="loading"
      :total="listCount"
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNum"
      @change="getList"
      class="mt-8"
    />
  </div>

  <!-- 列表展示 -->
  <div v-if="props.showType === 'list'" class="drawer-message-container">
    <el-drawer v-model="show" :z-index="99999" title="消息通知">
      <section class="message-container">
        <header class="message-header">
          <el-tabs v-model="activeTab" @tab-change="handleChangeTab">
            <el-tab-pane label="我的消息" name="0">
              <template #label>
                <el-badge :show-zero="false" :value="unReadInfo?.messageCount || 0" :max="99">我的消息</el-badge>
              </template>
            </el-tab-pane>
            <el-tab-pane label="我的代办" name="1">
              <template #label>
                <el-badge :show-zero="false" :value="unReadInfo?.todoCount || 0" :max="99">我的待办</el-badge>
              </template>
            </el-tab-pane>
            <el-tab-pane v-if="!isProd && showIMessage" label="我的沟通" name="2">
              <template #label>
                <el-badge :show-zero="false" :value="unReadInfo?.imessageCount || 0" :max="99">我的沟通</el-badge>
              </template>
            </el-tab-pane>
          </el-tabs>
        </header>

        <main
          v-infinite-scroll="handleGetList"
          :infinite-scroll-disabled="loading || !hasMore"
          :infinite-scroll-delay="200"
          class="message-content"
        >
          <message-item
            v-for="(item, index) in list"
            :key="index"
            :info="item"
            @click="handleViewDetail(item)"
            @read="handleSetRead(item)"
          />
          <div v-if="hasMore && loading" class="icon-loading">
            加载数据中<el-icon class="ml-4"><Loading /></el-icon>
          </div>
          <template v-if="!loading && !list.length">
            <el-empty :description="$t('暂无相关数据~')" class="mt-100" />
          </template>
        </main>

        <footer class="notice-btn">
          <!-- 一键已读 -->
          <el-button
            v-if="useAppStore()?.unReadNum"
            link
            :loading="loading"
            type="primary"
            class="read-btn cursor-pointer"
            @click.stop="handleSetAllRead"
            >{{ $t('一键已读') }}</el-button
          >
          <div v-else></div>
          <div class="aic flex cursor-pointer" @click="handleGoNoticeCenter">
            {{ $t('进入通知中心') }}
            <el-icon class="ml-2 mt-1"><CaretRight /></el-icon>
          </div>
        </footer>
      </section>
    </el-drawer>
  </div>
</template>

<script setup lang="tsx">
import CustomForm from '@/components/CustomForm/index.vue'
import CustomTable from '@/components/CustomTable/index.vue'
import MessageItem from './components/messageItem.vue'
import { computed, getCurrentInstance, ref } from 'vue'
import { t } from 'i18next'
import { allNotifyRead, batchNotifyRead, notifyFilter, notifyRead, notifyUnread } from '@/api/notify'
import { nextTick } from 'vue'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
// import { ElNotification } from 'element-plus'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
const { proxy }: any = getCurrentInstance()
const { notify_type } = proxy.useDict('notify_type')
const { notify_biz_type } = proxy.useDict('notify_biz_type')

const emit = defineEmits(['update:modelValue'])
const isProd = import.meta.env.VITE_APP_ENV === 'production'
const showIMessage = computed(() => {
  // @ts-expect-error
  return ['ENTREPRENEUR', 'ENGINEER'].includes(useUserStore()?.userInfo?.user?.currCustInfo?.custType)
})
const props = defineProps({
  // 展示形式
  showType: {
    type: String,
    default: 'table'
  },

  modelValue: {
    type: Boolean,
    default: false
  }
})
// 监听禁止滚动
watch(
  () => props.modelValue,
  val => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }
)
const show = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
watch(
  () => show.value,
  val => {
    if (!val) {
      return
    }
    queryParams.value.pageNum = 1
    list.value = []
    getList()
  }
)
let unReadInfo = computed<any>(() => {
  return useAppStore()?.unReadInfo
})
let activeTab = ref('0')
let hasMore = ref<boolean>(true) // 是否有更多数据
let selectedType = '0'
let queryParams = ref({
  pageNum: 1,
  pageSize: 10
})
let queryFormRef = ref()
let queryFormSetting = computed(() => ({
  mode: 'search',
  formItems: [
    {
      prop: 'keyword',
      label: '',
      component: 'el-input',
      attrs: { placeholder: '请输入关键词搜索', style: 'width: 300px' }
    },
    {
      prop: 'type',
      label: '',
      component: 'el-select',
      defaultValue: '0',
      options: notify_type,
      attrs: { placeholder: '请选择消息类型', style: 'width: 300px', clearable: false }
    }
  ]
}))

let list = ref<any[]>([])
let listCount = ref<number>(0)
let loading = ref<boolean>(false)
let columns = computed(() => {
  return [
    {
      label: '标题',
      prop: 'title',
      width: '200px'
    },
    {
      label: '消息内容',
      formatter: row => {
        return <div v-html={row.content}></div>
      }
    },
    {
      label: '类型',
      width: '100px',
      formatter: row => {
        return <dict-tag options={notify_biz_type.value} value={row?.bizModuleType} />
      }
    },
    {
      label: '通知时间',
      width: '180px',
      prop: 'messageTime'
    },
    {
      label: '操作',
      width: '210px',
      fixed: 'right',
      formatter: row => {
        return (
          <el-button link type='primary' icon='List' onClick={() => handleViewDetail(row)}>
            {t('查看')}
          </el-button>
        )
      }
    }
  ]
})
/** 获取消息列表 */
const getList = async () => {
  const query = queryFormRef?.value?.getFormValue() || {}
  loading.value = true
  try {
    const { rows: data, total }: any = await notifyFilter({
      pageNum: queryParams.value.pageNum,
      pageSize: queryParams.value.pageSize,
      type: selectedType,
      ...query
    })
    hasMore.value = data.length >= queryParams.value.pageSize
    // 我的消息：批量设置当前列表数据为已读状态
    if (selectedType === '0') {
      handleBatchSetRead(data)
    }
    // 1. 处理表格形式数据
    if (props.showType === 'table') {
      listCount.value = total
      list.value = data
      return
    }
    // 2. 处理列表形式数据
    list.value = list.value.concat(data)
    await nextTick() // 等待DOM更新
  } catch (e) {
    console.log('报错=>', e)
    loading.value = false
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  if (!useUserStore()?.token) {
    return
  }
  props.showType === 'table' && getList()
})

/** 查看详情 */
/* eslint-disable */
const handleViewDetail = async row => {
  handleSetRead(row)
  let isProd = import.meta.env.VITE_APP_ENV === 'production'
  switch (row.bizType) {
    case 'CUSTOMER_REGISTER':
    case 'CUSTOMER_APPROVE_PASS':
      handleGoPath('/customer/user')
      break
    case 'CUSTOMER_APPROVE_REJECTED':
      // 获取角色类型
      router.push({
        path: '/settlement',
        query: {
          role: row.bizId
        }
      })
      break

    case 'FOLLOW':
      handleGoPath('/customer/user/follow')

      break

    case 'COLLECT':
    case 'PROJECT_APPROVE_PASS':
    case 'PROJECT_APPROVE_REJECTED':
    case 'PROJECT_FUNDING_SUCCESS':
    case 'PROJECT_START':
    case 'PROJECT_INVESTOR:':
    case 'PROJECT_INVESTOR_UPDATE':
    case 'PROJECT_LEADER':
    case 'PROJECT_ENGINEER':
    case 'PROJECT_INVESTOR':
    case 'PROJECT_ENGINEER':
      !isProd ? router.push({ path: '/customer/project' }) : router.push({ path: '/customer/user/project' })
      break
    case 'PROJECT_TERMINATE':
    case 'PROJECT_APPLY':
    case 'PROJECT_FUNDING':
      router.push({ path: '/customer/project/review' })
      break
    case 'PROJECT_MEMBER':
      !isProd ? router.push({ path: '/customer/project/member' }) : router.push({ path: '/customer/user/project' })
      break

    case 'JOB_APPLY':
      handleGoPath('/project/postAudit')
      break

    case 'JOB_APPROVE_PASS':
    case 'JOB_APPROVE_REJECTED':
      handleGoPath('/customer/engineer/add')
      break

    case 'PROJECT_TASK':
    case 'PROJECT_DAILY':
      router.push({ path: '/customer/project/taskBoard' })
      // TODO: 处理任务相关跳转
      break

    case 'COMMENT':
    case 'REPLY':
    case 'AT':
      // TODO: 处理项目评论相关跳转
      router.push({ path: '/customer/project' })
      break

    case 'ACCEPTANCE_APPLY':
    case 'ACCEPTANCE_SUBMIT_CUST':
    case 'ACCEPTANCE_SUBMIT_SYS':
    case 'ACCEPTANCE_APPROVE_PASS':
    case 'ACCEPTANCE_APPROVE_REJECTED':
      // TODO：处理项目验收相关跳转
      router.push({ path: '/customer/project' })
      break

    case 'PROJECT_TERMINATE_REJECTED':
    case 'PROJECT_TERMINATE_PASS':
      // TODO：处理项目终止相关跳转
      router.push({ path: '/customer/project' })
      break

    case 'FEEDBACK':
    case 'FEEDBACK_REPLY':
      // TODO：处理反馈相关跳转
      router.push({ path: '/customer/user/feedback' })
      break

    case 'CONTRACT_TASK':
    case 'CONTRACT_FINAL_TASK':
    case 'CONTRACT_REMIND_TASK':
    case 'CONTRACT_CANCEL_TASK':
      router.push({ path: '/customer/contract' })
      break
  }
  show.value = false
}

/** 获取未读消息数据 */
const getNotifyUnread = async () => {
  const { data }: any = await notifyUnread()
  const total = (data?.todoCount || 0) + (data?.messageCount || 0) + (data.imessageCount || 0) || 0
  const appStore = useAppStore()
  appStore.unReadNum = total
  appStore.unReadInfo = data
}
/** 标记为已读 */
const handleSetRead = async row => {
  await notifyRead(row.id) // 设置已读
  const index = list.value.findIndex(item => item.id === row.id) // 手动设置消息已读
  if (index !== -1) {
    list.value[index].readed = 1
  }
  getNotifyUnread() // 刷新未读消息数据
}
/** 批量标记为已读 */
const handleBatchSetRead = async dataList => {
  if (!dataList?.length) {
    return
  }
  const notifyIds = dataList.map(item => item.id)
  await batchNotifyRead({
    notifyIds: notifyIds.join(',')
  })
  notifyIds.map(id => {
    const index = list.value.findIndex(item => id === item.id) // 手动设置消息已读
    if (index !== -1) {
      list.value[index].readed = 1
    }
  })
  getNotifyUnread()
}

/** 滚动到底部获取更多消息 */
const handleGetList = () => {
  console.log('滚动到底部==', hasMore.value)
  if (!hasMore.value) {
    return
  }
  queryParams.value.pageNum++
  getList()
}

/** 切换tab */
const handleChangeTab = (tab: any) => {
  if (selectedType === tab) {
    return
  }

  if (tab === '2') {
    router.push('/customer/communicate')
    show.value = false
    nextTick(() => {
      activeTab.value = selectedType
    })
    return
  }
  selectedType = tab
  list.value = []
  queryParams.value.pageNum = 1
  hasMore.value = true
  getList() // 重新刷新数据
}

/** 跳转页面 */
const router = useRouter()
const handleGoPath = (path: string) => {
  if (!path) {
    return
  }
  router.push({ path })
}

/** 一键已读 */
const handleSetAllRead = async () => {
  loading.value = true
  try {
    await allNotifyRead()
    getNotifyUnread()
  } finally {
    loading.value = false
  }
}

/** 进入通知中心页面 */
const route = useRoute()
const handleGoNoticeCenter = () => {
  const path = route.path
  if (path.includes('/customer')) {
    sessionStorage.setItem('nav-bar-type', 'dashboard')
  } else {
    sessionStorage.setItem('nav-bar-type', 'home')
  }

  // 根据角色类型跳转不同的页面
  if (!useUserStore()?.userInfo?.user?.currCustInfo) {
    handleGoPath('/customer/user/notify')
  } else {
    handleGoPath('/system/notify')
  }
  show.value = false
}
</script>

<style lang="scss" scoped>
.user-container {
  position: relative;
  border-radius: 10px;
  min-height: calc(100vh - 130px);
  background-color: #fff;
  padding: 20px 20px 100px;
}
.drawer-message-container {
  font-size: 14px;
  :deep(el-drawer__body) {
    padding: 0 !important;
  }
}
.message-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  .message-header {
    position: relative;
    margin-bottom: -10px;
    margin-top: -20px;
  }
  .message-content {
    flex: 1;
    height: 0; // 重要！确保flex容器能正确计算高度
    overflow: auto;
    padding-bottom: 40px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 和 Edge */
    .icon-loading {
      width: 100%;
      margin: 40px auto 0;
      color: var(--text-title-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .notice-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    padding-right: 20px;
    padding-left: 20px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--text-color-theme);
    box-shadow: rgb(0 0 0 / 5%) 0 0 10px 0;
  }
}
</style>
