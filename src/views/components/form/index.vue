<!--
 * custom-form表单组件使用示例
-->
<template>
  <div class="app-container">
    <custom-form ref="modifyRef" :form="formSetting" @cancel="handleDefaultCancel" @submit="handleDefaultSubmit" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import CustomForm from '@/components/CustomForm/index.vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import MemberSelect from '@/components/MemberSelect/index.vue'

const handleDefaultCancel = () => {
  console.log('默认取消事件')
}
const handleDefaultSubmit = () => {
  console.log('默认提交事件')
}
const handleCustomCancel = () => {
  console.log('自定义取消事件')
}
const handleCustomSubmit = () => {
  const formValue = modifyRef.value?.getFormValue() //获取表单数据
  console.log(formValue, '自定义提交事件')
}
const statusOptions = [
  { label: '待执行', value: 'pending' },
  { label: '执行中', value: 'processing' },
  { label: '已完成', value: 'completed' },
  { label: '失败', value: 'failed' }
]
const memberShow = ref<Boolean>(false)
const modifyRef = ref<HTMLElement | null>(null)
const formSetting = computed(() => {
  return {
    attrs: { labelWidth: 140 }, //el-form表单的所有属性都可以在此定义
    btns: [
      //表单提交按钮 自定义 也可以直接用封装好的默认按钮
      {
        text: '取消',
        events: {
          click: handleCustomCancel
        }
      },
      {
        text: '确定',
        attrs: { type: 'primary' },
        events: {
          click: handleCustomSubmit
        }
      }
    ],
    formItems: [
      {
        label: '任务名称',
        prop: 'text',
        component: 'el-input',
        defaultValue: '测试任务',
        attrs: {
          placeholder: '请输入任务名称'
        },
        rules: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }]
      },
      {
        label: '任务周期',
        prop: 'startDate_endDate',
        component: 'el-date-picker',
        attrs: {
          type: 'datetimerange',
          rangeSeparator: '至',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间'
        },
        defaultValue: [dayjs().format('YYYY-MM-DD HH:mm:ss'), dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')],
        rules: [{ required: true, message: '任务周期不能为空', trigger: 'blur' }]
      },
      {
        label: '任务状态',
        prop: 'status',
        component: 'el-select',
        options: statusOptions,
        defaultValue: 'pending',
        events: {
          change: value => {
            if (value === 'failed') {
              memberShow.value = false
            } else {
              memberShow.value = true
            }
          }
        },
        attrs: {
          placeholder: '请选择任务状态'
        },
        rules: [{ required: true, message: '任务状态不能为空', trigger: 'change' }]
      },
      {
        prop: 'taskDesc',
        label: '描述',
        component: 'el-input',
        attrs: { placeholder: '请选择填写任务描述', type: 'textarea', rows: 4, maxlength: 1000, 'show-word-limit': true },
        show: () => {
          return false
        }
      },
      {
        prop: 'taskPic',
        label: '图片上传',
        component: 'image-upload',
        attrs: { limit: 3 }
      },
      {
        prop: 'taskPic',
        label: '自定义组件',
        component: MemberSelect,
        attrs: { multiple: true, placeholder: '请选择成员' },
        show: () => {
          return memberShow.value
        }
      }
    ]
  }
})

/** 点击修改 */
const handleModify = task => {
  taskInfo.value = task
  modifyVisible.value = true
}
/** 点击添加 */
const handleAdd = () => {
  ElMessage.warning('添加任务')
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  height: calc(100vh - 90px); /* 减去头部和padding高度 */
  .card-header {
    font-size: 16px;
    font-weight: 500;
  }
  .el-card {
    height: 100%;
    :deep(.el-card__body) {
      height: calc(100% - 60px); /* 减去card header高度 */
    }
  }
}
</style>

function dayjs() { throw new Error('Function not implemented.') }
