<template>
  <!-- el-select组件 -->
  <template v-if="item.component === 'el-select'">
    <el-select
      v-model="value"
      clearable
      v-bind="item.attrs"
      :placeholder="$t(item?.attrs?.placeholder || '')"
      v-on="item?.events || {}"
    >
      <el-option v-for="(option, index) in item.options" :key="index" :label="option.label" :value="option.value"> </el-option>
      <template v-for="(slot, slotIndex) in item?.componentSlots || []" :key="slotIndex" #[slot.name]>
        <slot-item :info="slot" />
      </template>
    </el-select>
  </template>

  <!-- 按钮选择器 -->
  <template v-else-if="item.component === 'button-select'">
    <button-select v-model="value" v-bind="item.attrs" :options="item.options" v-on="item?.events || {}" />
  </template>

  <!-- 营业执照，身份证 -->
  <template v-else-if="item.component === 'id-card-upload'">
    <id-card-upload v-model="value" v-bind="item.attrs" :options="item.options" v-on="item?.events || {}" />
  </template>

  <!-- text组件 -->
  <template v-else-if="item.component === 'el-text'">
    <el-text v-bind="item.attrs" v-on="item?.events || {}">
      {{ value }}
    </el-text>
  </template>

  <!-- input组件 -->
  <template v-else-if="item.component === 'el-input'">
    <el-input
      v-model="value"
      clearable
      v-bind="item.attrs"
      :placeholder="$t(item?.attrs?.placeholder || '')"
      @keyup.enter="handleSearch"
      v-on="item?.events || {}"
    >
      <template v-for="(slot, slotIndex) in item?.componentSlots || []" :key="slotIndex" #[slot.name]>
        <slot-item :info="slot" />
      </template>
    </el-input>
  </template>

  <!-- 单选按钮 -->
  <template v-else-if="item.component === 'el-radio'">
    <el-radio-group v-model="value" v-bind="item.attrs" v-on="item?.events || {}">
      <template v-if="item.attrs?.type === 'button'">
        <el-radio-button v-for="(option, index) in item.options" :key="index" :value="option.value">
          {{ option.label }}
        </el-radio-button>
      </template>
      <template v-else>
        <el-radio v-for="(option, index) in item.options" :key="index" :value="option.value"> {{ option.label }} </el-radio>
      </template>
    </el-radio-group>
  </template>

  <!-- 级联选择器 -->
  <template v-else-if="item.component === 'el-cascader'">
    <el-cascader
      v-model="value"
      v-bind="item.attrs"
      :placeholder="$t(item?.attrs?.placeholder || '')"
      v-on="item?.events || {}"
    />
  </template>

  <!-- dict-tag组件 -->
  <template v-else-if="item.component === 'dict-tag'">
    <dict-tag v-bind="item.attrs" :value="value" v-on="item?.events || {}" />
  </template>

  <!-- el-switch组件 -->
  <template v-else-if="item.component === 'el-switch'">
    <el-switch v-bind="item.attrs" v-on="item?.events || {}" v-model="value" />
  </template>

  <!-- 使用对应的组件 -->
  <component
    v-else
    :is="item.component"
    v-bind="item.attrs"
    :placeholder="$t(item?.attrs?.placeholder || '')"
    v-model="value"
    v-on="item?.events || {}"
  >
    <!-- 设置组件插槽部分 -->
    <template v-for="(slot, slotIndex) in item?.componentSlots || []" :key="slotIndex" #[slot.name]>
      <slot-item :info="slot" />
    </template>
  </component>
</template>

<script lang="ts" setup>
import SlotItem from './slotItem.vue'
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
    item.value = val
  },
  { deep: true, immediate: true }
)

const emit = defineEmits(['search', 'update:modelValue'])
const handleSearch = () => {
  emit('search')
}
</script>
