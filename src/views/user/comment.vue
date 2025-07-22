<template>
  <div class="user-container">
    <custom-form ref="queryFormRef" :form="queryFormSetting" @search="getList" @reset="getList" />
    <custom-table
      :columns="columns"
      :table-data="list"
      :loading="loading"
      :total="total"
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNum"
      @change="getList"
      class="mt-8"
    />
  </div>
</template>

<script setup lang="tsx">
import CustomForm from '@/components/CustomForm/index.vue'
import CustomTable from '@/components/CustomTable/index.vue'
import { computed, onMounted, getCurrentInstance, ref } from 'vue'
import { listComment, delComment } from '@/api/ows/comment'
import { t } from 'i18next'

const { proxy }: any = getCurrentInstance()

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
      component: 'el-input',
      attrs: { placeholder: '搜索关键字', style: 'width: 300px' }
    }
  ]
}))

let list = ref<any[]>([])
let loading = ref<boolean>(false)
let total = ref<number>(0)
let columns = computed(() => {
  return [
    {
      label: '评论内容',
      prop: 'content'
    },
    {
      label: '项目名称',
      prop: 'projectName'
    },
    {
      label: '评论时间',
      prop: 'createTime'
    },
    {
      label: '操作',
      formatter: (row: any) => {
        return (
          <>
            <el-button link type='primary' icon='Edit' onClick={() => handleView()}>
              {t('详情')}
            </el-button>
            <el-button link type='primary' icon='Edit' onClick={() => handleRemove(row)}>
              {t('删除')}
            </el-button>
          </>
        )
      }
    }
  ]
})
/** 获取评论列表 */
const getList = async () => {
  loading.value = true
  const formValue = await queryFormRef.value.getFormValue()
  try {
    const { rows: data, total: count }: any = await listComment({
      ...queryParams.value,
      ...formValue
    })
    list.value = data
    total.value = count
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getList()
})

/** 查看评论 */
const handleView = () => {}
/** 删除评论 */
const handleRemove = async row => {
  const commentsId = row.commentsId
  await delComment(commentsId)
  getList()
  proxy.$modal.msgSuccess(t('删除成功'))
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
