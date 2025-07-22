<template>
  <div class="aic flex" style="width: 100%">
    <div class="flex aic flex-1">
      <el-select v-model="min" class="mr-10 flex-1" style="min-width: 200px">
        <el-option
          v-for="item in priceList"
          :key="item.value"
          :disabled="max ? parseFloat(item.value) > parseFloat(max) : false"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      -
      <el-select v-model="max" class="ml-10 flex-1" style="min-width: 200px">
        <el-option
          v-for="item in priceList"
          :key="item.value"
          :disabled="min ? parseFloat(item.value) < parseFloat(min) : false"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>

    <!-- 选择类型 -->
    <el-radio-group v-if="showSelectType" v-model="selectType" class="ml-20">
      <el-radio-button v-for="(item, index) in sys_salary_type" :key="index" :label="item.label" :value="item.value" />
    </el-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, nextTick, ref, watch } from 'vue'
const { proxy }: any = getCurrentInstance()
const { sys_salary_type } = proxy.useDict('sys_salary_type')

const emit = defineEmits(['update:modelValue'])
let selectType = ref<string>('monthly')
let min = ref<any>('')
let max = ref<any>('')
let canWatchSelectType = true
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => {}
  },
  showSelectType: {
    type: Boolean,
    default: true
  }
})
watch(
  () => props.modelValue,
  (val: any) => {
    if (!val || !val.priceRange) {
      return
    }
    canWatchSelectType = false // 设置初始化的薪资类型，禁止监听薪资类型切换
    selectType.value = val?.expectedSalaryUnit || 'monthly'
    const priceRange = val?.priceRange || []
    min.value = priceRange[0] || ''
    max.value = priceRange[1] || ''
    nextTick(() => {
      canWatchSelectType = true // 初始化完成，允许监听薪资类型切换
    })
  }
)
watch(
  () => min.value,
  val => {
    emit('update:modelValue', {
      priceRange: [val, max.value],
      expectedSalaryUnit: selectType.value
    })
  },
  { deep: true, immediate: true }
)
watch(
  () => max.value,
  val => {
    emit('update:modelValue', {
      priceRange: [min.value, val],
      expectedSalaryUnit: selectType.value
    })
  },
  { deep: true, immediate: true }
)
watch(
  () => selectType.value,
  val => {
    if (!canWatchSelectType) {
      return
    }
    // 重置数据
    min.value = ''
    max.value = ''
    emit('update:modelValue', {
      priceRange: [min.value, max.value],
      expectedSalaryUnit: val
    })
  },
  { deep: true, immediate: true }
)

let monthList: any[] = []
let dayList: any[] = []
let hourList: any[] = []
let priceList = computed(() => {
  switch (selectType.value) {
    case 'monthly':
      return monthList
    case 'daily':
      return dayList
    case 'hourly':
      return hourList
    default:
      return []
  }
})

const initData = () => {
  for (let i = 0; i < 90; i++) {
    monthList.push({
      label: `${i}${(i && 'k') || ''}`,
      value: i * 1000 + ''
    })
  }

  for (let i = 0; i < 90; i++) {
    hourList.push({
      label: `${i * 10}${(i && '元') || ''}`,
      value: i * 10 + ''
    })
  }

  for (let i = 0; i < 90; i++) {
    dayList.push({
      label: `${i * 100}${(i && '元') || ''}`,
      value: i * 100 + ''
    })
  }
}
initData()
</script>
