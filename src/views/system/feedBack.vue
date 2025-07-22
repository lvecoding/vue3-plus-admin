<template>
  <div class="app-container">
    <el-input
      v-model="keyword"
      :suffix-icon="Search"
      :placeholder="$t('搜索关键词')"
      clearable
      style="width: 200px"
      @keyup.enter="getList"
    />
    <el-button type="primary" :icon="Search" class="ml-20" @click="getList">{{ $t('查询') }}</el-button>

    <custom-table
      :columns="columns"
      :table-data="tableData"
      :total="dataCount"
      :loading="loading"
      :tableSetting="tableSetting"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @change="getList"
      class="mt-20"
    />
  </div>

  <!-- 回复 -->
  <el-dialog :title="dialogTitle" width="30%" v-model="addDialogVisible">
    <div class="record-content">
      <div class="record-item">
        <div class="form-item-title">反馈内容：</div>
        <div class="form-item-content">{{ recordInfo.content }}</div>
      </div>
      <div class="record-item">
        <div class="form-item-title">截图内容：</div>
        <div class="form-item-content">
          <template v-if="recordInfo.pics">
            <image-preview
              v-for="(item, index) in recordInfo.pics.split(',')"
              :key="index"
              style="width: 100px; height: 100px; margin-right: 10px"
              :src="item"
            />
          </template>
          <div v-else>-</div>
        </div>
      </div>
      <div class="record-item">
        <div class="form-item-title">反馈类型：</div>
        <div class="form-item-content">
          <dict-tag :options="sys_feedback_type" :value="recordInfo.type" />
        </div>
      </div>
      <div class="record-item">
        <div class="form-item-title">反馈人：</div>
        <div class="form-item-content">{{ recordInfo.customerName }}</div>
      </div>
      <div class="record-item">
        <div class="form-item-title">角色名称：</div>
        <div class="form-item-content">
          <dict-tag :options="sys_customer_category" :value="recordInfo.customerRole" />
        </div>
      </div>
    </div>

    <custom-form
      v-if="dialogTitle === '回复'"
      ref="addFormRef"
      :form="addFormSetting"
      :loading="formLoading"
      @cancel="handleCloseDialog"
      @submit="handleAddForm"
    />
    <custom-table
      v-if="dialogTitle === '记录'"
      :columns="recordColumns"
      :table-data="recordData"
      :table-setting="{ attrs: { border: true } }"
      :pagination-setting="{ show: false }"
      class="mb-10"
    />
  </el-dialog>
</template>

<script setup lang="tsx">
import CustomTable from '@/components/CustomTable/index.vue'
import CustomForm from '@/components/CustomForm/index.vue'
import { listFeedBack, replayFeedback, replayDetail } from '@/api/system/feedBack'
import { Search } from '@element-plus/icons-vue'
import { ref, getCurrentInstance } from 'vue'
import { t } from 'i18next'
const permission = {
  reply: ['system:feedback:reply'],
  record: ['system:feedback:record']
}
const { proxy }: any = getCurrentInstance()
const { sys_feedback_state } = proxy.useDict('sys_feedback_state') // 用户反馈状态
const { sys_feedback_type } = proxy.useDict('sys_feedback_type') // 用户反馈类型
const { sys_customer_category } = proxy.useDict('sys_customer_category') // 用户反馈类型

let keyword = ref<string>('')
let queryParams = ref({
  pageNum: 1,
  pageSize: 10
})
let columns = ref<any[]>([
  {
    label: t('反馈内容'),
    prop: 'content',
    width: 400
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
    prop: 'feedbackTime'
  },
  {
    label: t('反馈类型'),
    prop: 'type',
    formatter: row => {
      return <dict-tag options={sys_feedback_type.value} value={row.type} />
    }
  },
  {
    label: t('反馈人'),
    prop: 'customerName'
  },
  {
    label: t('角色'),
    prop: 'customerRole',
    formatter: row => {
      return <dict-tag options={sys_customer_category.value} value={row.customerRole} />
    }
  },
  {
    label: t('状态'),
    prop: 'state',
    formatter: row => {
      return <dict-tag options={sys_feedback_state.value} value={row.state} />
    }
  },
  {
    label: t('操作'),
    formatter: (row: any) => {
      return (
        <>
          {row.state !== 1 && (
            <el-button v-hasPermi={permission.reply} link type='primary' onClick={() => handleReply(row)}>
              {t('回复')}
            </el-button>
          )}
          <el-button v-hasPermi={permission.record} link type='warning' onClick={() => handleDetail(row)}>
            {t('记录')}
          </el-button>
        </>
      )
    }
  }
])
let tableData = ref<any[]>([])
let tableSetting = ref<any>({
  attrs: { rowKey: 'id' }
})
let dataCount = ref<number>(0)
let loading = ref<boolean>(false)
const getList = async () => {
  loading.value = true
  try {
    const { rows: data, total }: any = await listFeedBack({
      pageNum: queryParams.value.pageNum,
      pageSize: queryParams.value.pageSize,
      keyword: keyword.value
    })
    tableData.value = data
    dataCount.value = total
  } finally {
    loading.value = false
  }
}
getList()

let addFormRef = ref()
let addDialogVisible = ref<boolean>(false)
let formLoading = ref<boolean>(false)
let dialogTitle = ref<string>(t('回复'))
let addFormSetting = ref<any>({
  attrs: { labelWidth: 100 },
  formItems: [
    {
      label: t('处理结果'),
      prop: 'state',
      component: 'el-select',
      attrs: {
        placeholder: t('请选择处理结果')
      },
      options: [
        { label: t('已处理'), value: 1 },
        { label: t('处理中'), value: 2 },
        { label: t('未处理'), value: 0 }
      ],
      rules: [{ required: true, message: t('请选择处理结果'), trigger: 'blur' }]
    },
    {
      label: t('回复内容'),
      prop: 'reply',
      component: 'el-input',
      attrs: { placeholder: t('请输入回复内容~'), type: 'textarea', rows: 2 },
      rules: [{ required: true, message: t('请输入回复内容'), trigger: 'blur' }]
    },
    {
      label: t('截图'),
      prop: 'replyPic',
      component: 'image-upload',
      attrs: { limit: 1 }
    }
  ]
})
let recordColumns = ref([
  {
    label: t('回复时间'),
    prop: 'replyTime'
  },
  {
    label: t('回复内容'),
    prop: 'reply'
  },
  {
    label: t('处理状态'),
    prop: 'status',
    width: 80,
    formatter: row => {
      return <dict-tag options={sys_feedback_state.value} value={row.state} />
    }
  },
  {
    label: t('处理人'),
    prop: 'replyName',
    width: 80
  }
])
let recordData = ref([])
const handleAddForm = async value => {
  formLoading.value = true
  try {
    await replayFeedback({
      ...value,
      feedbackId: recordInfo.value.id
    })
    handleCloseDialog()
    getList()
    proxy.$modal.msgSuccess('回复成功')
  } finally {
    formLoading.value = false
  }
}
/** 关闭弹框 */
const handleCloseDialog = () => {
  addFormRef.value.resetForm()
  addDialogVisible.value = false
}

/** 回复 */
let recordInfo = ref<any>(null)
const handleReply = row => {
  recordInfo.value = row
  dialogTitle.value = t('回复')
  addDialogVisible.value = true
}

/** 查看记录 */
const handleDetail = async row => {
  recordInfo.value = row
  dialogTitle.value = t('记录')
  addDialogVisible.value = true
  const { data }: any = await replayDetail(row.id)
  recordData.value = data?.owFeedbackDetailListVoList || []
}
</script>

<style lang="scss" scoped>
.record-content {
  margin-top: -10px;
  .record-item {
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .form-item-title {
    width: 100px;
    text-align: right;
  }
  .form-item-content {
    flex: 1;
  }
}
</style>
