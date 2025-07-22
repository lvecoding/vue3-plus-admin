<template>
  <div class="user-container">
    <custom-form ref="queryFormRef" :form="queryFormSetting" @search="getList" @reset="getList" />

    <custom-table
      :columns="columns"
      :table-data="tableData"
      :total="dataCount"
      :loading="loading"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @change="getList"
      class="mt-20"
    />
  </div>
</template>

<script setup lang="tsx">
import CustomTable from '@/components/CustomTable/index.vue'
import CustomForm from '@/components/CustomForm/index.vue'
import { ref, getCurrentInstance } from 'vue'
import { t } from 'i18next'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { listMyFollow, unFollow } from '@/api/customer/follow'
const { proxy }: any = getCurrentInstance()
const { sys_customer_category } = proxy.useDict('sys_customer_category') // 用户类型

let queryParams = ref({
  pageNum: 1,
  pageSize: 10
})
let queryFormRef = ref()
let queryFormSetting = computed(() => ({
  mode: 'search',
  attrs: { labelWidth: '0px' },
  formItems: [
    {
      prop: 'followedName',
      label: '',
      component: 'el-input',
      attrs: { placeholder: '输入昵称搜索', style: 'width: 300px' }
    }
  ]
}))
let columns = ref<any[]>([
  {
    label: '昵称',
    prop: 'followedName'
  },
  {
    label: '关注时间',
    prop: 'followTime'
  },
  {
    label: '用户角色',
    formatter: row => {
      return <dict-tag options={sys_customer_category.value} value={row.followedType} />
    }
  },
  {
    label: t('操作'),
    formatter: (row: any) => {
      return (
        <>
          <el-button type='primary' link onClick={() => handleViewHome(row)}>
            {t('查看主页')}
          </el-button>
          <el-popconfirm
            title={t('确定取消关注该用户吗？')}
            width='240px'
            placement='bottom-start'
            onConfirm={() => handleDelete(row)}
          >
            {{
              reference: () => (
                <el-button type='danger' link>
                  {t('取消关注')}
                </el-button>
              )
            }}
          </el-popconfirm>
        </>
      )
    }
  }
])
let tableData = ref<any[]>([])
let dataCount = ref<number>(0)
let loading = ref<boolean>(false)
const getList = async () => {
  loading.value = true
  const formValue = await queryFormRef.value.getFormValue()
  try {
    const { rows: data, total }: any = await listMyFollow({
      ...queryParams.value,
      ...formValue
    })
    tableData.value = data
    dataCount.value = total
  } finally {
    loading.value = false
  }
}
onMounted(async () => {
  getList()
})

/** 删除反馈记录 */
const handleDelete = async row => {
  await unFollow({
    followedId: row?.followedId
  })
  ElMessage.success('取消关注成功')
  getList()
}

/** 查看用户主页 */
const handleViewHome = () => {
  ElNotification.warning({
    title: '功能开发中',
    message: '该功能正在开发中，敬请期待！'
  })
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
</style>
