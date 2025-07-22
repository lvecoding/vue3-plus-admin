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
import { listUserFeedBack, deleteUserFeedBack } from '@/api/system/feedBack'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
const { proxy }: any = getCurrentInstance()
const { sys_feedback_state } = proxy.useDict('sys_feedback_state') // 用户反馈状态
const { sys_feedback_type } = proxy.useDict('sys_feedback_type') // 用户反馈类型

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
      prop: 'state',
      label: '',
      component: 'el-select',
      options: sys_feedback_state,
      attrs: { placeholder: '请选择反馈状态', style: 'width: 300px', clearable: true }
    },
    {
      prop: 'content',
      label: '',
      component: 'el-input',
      attrs: { placeholder: '搜索反馈内容', style: 'width: 300px' }
    }
  ]
}))
let columns = ref<any[]>([
  {
    label: t('反馈内容'),
    prop: 'content'
  },
  {
    label: t('截图'),
    prop: 'pics',
    formatter: row => {
      if (!row.pics) {
        return '-'
      }
      const list = row.pics.split(',')
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '-10px' }}>
          {list.map(item => {
            return <image-preview style='width: 60px; height: 60px;margin-right: 10px;margin-bottom: 10px' src={item} />
          })}
        </div>
      )
    }
  },
  {
    label: t('反馈时间'),
    width: 200,
    prop: 'feedbackTime'
  },
  {
    label: t('反馈类型'),
    width: 100,
    prop: 'type',
    formatter: row => {
      return <dict-tag options={sys_feedback_type.value} value={row.type} />
    }
  },
  {
    label: t('状态'),
    width: 100,
    prop: 'state',
    formatter: row => {
      return <dict-tag options={sys_feedback_state.value} value={row.state} />
    }
  },
  {
    label: t('操作'),
    width: 120,
    formatter: (row: any) => {
      return (
        row.state === 0 && (
          <el-popconfirm
            title={t('确定删除该条反馈记录吗？')}
            width='240px'
            placement='bottom-start'
            onConfirm={() => handleDelete(row)}
          >
            {{
              reference: () => (
                <el-button type='danger' link>
                  {t('删除')}
                </el-button>
              )
            }}
          </el-popconfirm>
        )
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
    const { rows: data, total }: any = await listUserFeedBack({
      ...queryParams.value,
      ...formValue
    })
    tableData.value = data
    dataCount.value = total
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  getList()
})

/** 删除反馈记录 */
const handleDelete = async row => {
  await deleteUserFeedBack(row?.id)
  ElMessage.success('删除成功')
  getList()
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
