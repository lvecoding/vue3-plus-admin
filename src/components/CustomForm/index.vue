<template>
  <el-form
    ref="formRef"
    v-bind="formAttrs"
    :inline="formMode === 'search' ? true : false"
    :model="formValue"
    :rules="formRules"
    @submit.prevent
  >
    <!-- 查询展示 -->
    <template v-if="formMode === 'search'">
      <template v-for="(item, index) in formItems" :key="index">
        <FormItem :formItem="item" v-model="formValue[item.prop]" @search="handleSearch" />
      </template>
      <el-form-item v-if="!formBtns.length">
        <el-button :loading="formLoading" type="primary" :icon="Search" @click="handleSearch">{{ $t('搜索') }}</el-button>
        <el-button :loading="formLoading" :icon="Refresh" @click="resetForm">{{ $t('重置') }}</el-button>
      </el-form-item>
    </template>

    <!-- 表单展示 -->
    <el-row v-else :gutter="24" v-bind="rowAttrs">
      <el-col v-for="(item, index) in formItems" :key="index" v-bind="item.colAttrs ?? {}">
        <FormItem :formItem="item" v-model="formValue[item.prop]" @search="handleSearch" />
      </el-col>
    </el-row>

    <!-- 自定义底部按钮 -->
    <div v-if="formBtns.length" class="btn-footer">
      <el-button v-for="(btn, index) in formBtns" :key="index" v-bind="btn.attrs" v-on="btn.events">
        {{ $t(btn.text) }}
      </el-button>
    </div>
    <!-- 提交 && 取消按钮 -->
    <template v-else-if="formMode === 'submit'">
      <div class="btn-footer">
        <el-button :loading="formLoading" @click="handleCancel">{{ $t('取消') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="handleSubmit">{{ $t('提交') }}</el-button>
      </div>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import FormItem from './formItem.vue'
import { type FormInstance, type FormRules } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { throttle } from 'lodash-es'

interface FormBtn {
  text: string
  attrs?: Object
  events?: Object
}

const props = defineProps({
  form: {
    type: Object,
    default: () => ({
      mode: 'submit', // 表单展示形式，分为表单提交类型（submit），筛选查询类型（search）
      attrs: {},
      formItems: [],
      btns: [] // 自定义底部按钮，没配置默认使用系统自带的提交和取消按钮
    })
  },

  // 查询或者提交表单的时候是否展示加载中状态
  loading: {
    type: Boolean,
    default: false
  }
})

let formBtns = ref<FormBtn[]>([])
let formAttrs = ref<Object>({})
let rowAttrs = ref<Object>({})
let formValue = ref<any>({})
let formRules = ref<FormRules>({})
let formItems = ref<Array<any>>([])
const formRef = ref<FormInstance>()
let formMode = ref<String>('submit')
let formLoading = ref<boolean>(false)
const emit = defineEmits(['cancel', 'submit', 'reset', 'change', 'search']) // 回调事件

/** 监听表单值变化 */
watch(
  formValue,
  val => {
    emit('change', val) // 回调：表单值变化
    handleSetFormItems(val) // 5. 格式化表单项
  },
  { deep: true }
)
/** 监听表单配置，设置表单初始值，表单校验规则 */
watch(
  () => props.form,
  val => {
    formMode.value = val?.mode || 'submit' // 表单展示形式，分为表单提交类型（submit），筛选查询类型（search）
    formAttrs.value = val?.attrs || {} // 1. 表单属性
    formBtns.value = val?.btns || {} // 2. 底部按钮配置
    rowAttrs.value = val?.rowAttrs || {} // 3.表单布局配置，默认是gutter为24
    val?.formItems.map((item: { prop: string; rules?: any[]; defaultValue?: any }) => {
      item.rules && (formRules.value[item.prop] = item.rules) // 3. 表单校验规则
      item.hasOwnProperty('defaultValue') && (formValue.value[item.prop] = item.defaultValue) // 4. 表单初始值
      !Object.keys(formValue.value).length && handleSetFormItems({}) // 5. 格式化表单项
    })
    // 清空校验
    setTimeout(() => {
      resetValidate()
    }, 0)
  },
  { deep: true, immediate: true }
)
/** 监听加载 */
watch(
  () => props.loading,
  val => {
    formLoading.value = val || false
  }
)

/** 格式化表单项，设置显隐 */
function handleSetFormItems(value: Object) {
  const items: Object[] = []
  props.form?.formItems?.map((item: { show?: Function | Boolean }) => {
    // 查找存在show字段配置的表单配置项，设置是否可以显示
    // TODO: 优化，支持异步展示
    let show: Boolean | Function = true
    if (item.hasOwnProperty('show')) {
      show = item.show instanceof Function ? item.show(value) : item.show
    }
    show && items.push(item)
  })
  formItems.value = items
}

/** 设置表单初始值 */
function setFormValue(value: any) {
  formValue.value = {
    ...formValue.value,
    ...value
  }
}
/** 获取表单目前值 */
function getFormValue() {
  return formValue.value
}

/** 点击取消按钮 */
function handleCancel() {
  emit('cancel')
}
/** 提交按钮 */

// 修改方法
const handleSubmit = throttle(
  async () => {
    try {
      await validate()
      emit('submit', formValue.value)
    } catch (e) {
      console.error(e)
    }
  },
  1000,
  { leading: true, trailing: false }
) // 1秒内只允许触发一次
/** 查询 */
function handleSearch() {
  emit('search', formValue.value)
}

/** 校验表单是否填写完整 */
function validate() {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((valid: boolean, fields: any) => {
      valid ? resolve(true) : reject(fields)
    })
  })
}
/** 清空表单校验 */
function resetValidate() {
  formRef.value?.clearValidate()
}
/** 清空表单填写项 */
function resetForm() {
  formRef.value?.resetFields()
  emit('reset')
}

defineExpose({
  setFormValue,
  resetForm,
  resetValidate,
  getFormValue,
  validate
})
</script>

<style scoped>
.btn-footer {
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
}
</style>
