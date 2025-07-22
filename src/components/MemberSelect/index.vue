<template>
  <el-select
    v-model="vModel"
    filterable
    :multiple="multiple"
    :clearable="clearable"
    :placeholder="props.placeholder"
    :collapse-tags="collapseTags"
    @change="handleChange"
  >
    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>

<script setup lang="ts" name="memberSelect">
import { ref, watch } from 'vue'

const props = defineProps({
  vModel: {
    type: String || Number || Array<string | number>,
    default: () => '',
    require: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  collapseTags: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: () => '请选择成员',
    require: true
  },
  clearable: {
    type: Boolean,
    default: true
  },
  searchQuery: {
    type: Object,
    default: () => {}
  }
})
const vModel = ref(props.vModel)
watch(
  () => props.vModel,
  val => {
    vModel.value = val
  },
  { immediate: true, deep: true }
)

// 定义子组件向父组件传值/事件
const emit = defineEmits(['update:vModel', 'select'])

const handleChange = (val: string | number | Array<string | number>) => {
  emit('update:vModel', val)

  const projectInfo = options.value.find(item => item.projectId === val)
  emit('select', projectInfo)
}

let options = ref<any[]>([])

const getData = async () => {
  options.value = [
    {
      id: 1,
      name: '后裔'
    },
    {
      id: 2,
      name: '鲁班'
    },
    {
      id: 3,
      name: '王昭君'
    }
  ]
}
getData()
</script>
<style lang="scss" scoped></style>
