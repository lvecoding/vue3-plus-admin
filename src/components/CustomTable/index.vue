<template>
  <div>
    <el-table v-bind="tableSettingInfo.attrs" :data="columnData" v-on="tableSettingInfo.events" v-loading="tableLoading">
      <template v-for="(column, columnIndex) in columnsList" :key="columnIndex">
        <slot v-if="column?.isCustom" :name="column?.prop"></slot>
        <el-table-column v-else min-width="120px" :align="column.align || 'center'" v-bind="column" :label="$t(column.label)" />
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="paginationData?.show"
      v-bind="paginationData?.attrs"
      v-on="paginationData?.events"
      :total="props.total"
      v-model:page-size="limit"
      v-model:current-page="page"
      class="pagination-footer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface TableType {
  attrs?: any
  events?: Object
  slots?: Object[]
  pagination?: {
    show?: boolean
    total?: number
    attrs?: Object
    events?: Object
  }
}
interface paginationType {
  show?: boolean
  attrs?: Object
  events?: Object
}

// 回调事件
const emit = defineEmits(['currentChange', 'sizeChange', 'change', 'prevClick', 'nextClick', 'select', 'selectAll'])

const props = defineProps({
  // 表头配置
  columns: {
    type: Array,
    default: () => []
  },

  // 表格配置
  tableSetting: {
    type: Object as () => TableType,
    default: () => {
      return {}
    }
  },

  // 分页配置
  paginationSetting: {
    type: Object as () => paginationType,
    default: () => {
      return {}
    }
  },
  // 表格数据
  tableData: {
    type: Array,
    default: () => []
  },
  // 总数
  total: {
    type: Number,
    default: 0
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  }
})
const limit = defineModel('limit', {
  type: Number,
  default: 10
})
const page = defineModel('page', {
  type: Number,
  default: 1
})

// 表格
let tableSettingInfo = ref<TableType>({
  attrs: {},
  events: {
    select: (selection: any[], row: any) => {
      emit('select', selection, row)
    },
    'select-all': (selection: any[]) => {
      emit('selectAll', selection)
    }
  },
  slots: []
})
let paginationData = ref<paginationType>({
  show: true,
  attrs: {
    background: true,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [10, 20, 50, 100, 200]
  },
  events: {
    'current-change': (value: number) => {
      emit('currentChange', { page: value })
    },
    'size-change': (value: number) => {
      emit('sizeChange', { pageSize: value })
    },
    change: (page: number, size: number) => {
      emit('change', { page, size })
    },
    'prev-click': (value: number) => {
      emit('prevClick', { page: value })
    },
    'next-click': (value: number) => {
      emit('nextClick', { page: value })
    }
  }
})
let columnsList = ref<any[]>([]) // 列配置
let columnData = ref<any[]>([])
let tableLoading = ref<boolean>(false) // 表格加载状态

watch(
  () => props.tableSetting,
  val => {
    tableSettingInfo.value = { ...tableSettingInfo.value, ...val }
  },
  { immediate: true, deep: true }
)
watch(
  () => props.paginationSetting,
  val => {
    paginationData.value = {
      ...paginationData.value,
      ...val
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => props.columns,
  val => {
    columnsList.value = val
  },
  { immediate: true, deep: true }
)
watch(
  () => props.tableData,
  val => {
    columnData.value = val
  }
)
watch(
  () => props.loading,
  val => {
    tableLoading.value = val
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.pagination-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
::v-deep .el-table {
  .el-popper {
    max-width: 600px;
  }
}
</style>
