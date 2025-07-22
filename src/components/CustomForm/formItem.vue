<template>
  <el-form-item :label="$t(item.label)" :prop="item.prop" v-bind="item.attrs">
    <component-item :form-item="item" v-model="value" @search="handleSearch" />
    <!-- 如果存在toolTip字段配置，设置 -->
    <template v-if="item.toolTip" #label>
      <span class="cursor-pointer">
        <el-tooltip :content="item.toolTip" placement="top">
          <el-icon><question-filled /></el-icon>
        </el-tooltip>
        {{ $t(item.label) }}
      </span>
    </template>

    <!-- 设置表单插槽部分 -->
    <template v-for="(slot, slotIndex) in item?.formSlots || []" :key="slotIndex" #[slot.name]>
      <slot-item :info="slot" />
    </template>
  </el-form-item>
</template>

<script lang="ts" setup>
import SlotItem from './slotItem.vue'
import ComponentItem from './componentItem.vue'
import { computed, ref, watch } from 'vue'
let item = ref<any>({})
const props = defineProps({
  formItem: {
    type: Object,
    default() {
      return {}
    }
  },
  modelValue: {
    type: String,
    default: ''
  }
})
const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
watch(
  () => props.formItem,
  val => {
    console.log('val', val)
    item.value = val
  },
  { deep: true, immediate: true }
)

const emit = defineEmits(['search', 'update:modelValue'])
const handleSearch = () => {
  emit('search')
}
</script>
