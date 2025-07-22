<template>
  <ECharts :option="option" />
</template>

<script setup lang="ts" name="lineChart">
import { ECOption } from './config'
import ECharts from './index.vue'
import { ref, watch } from 'vue'
import { objectMerge } from '@/utils'
const prop = defineProps({
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  xAxisData: {
    type: Array,
    default: () => {
      return []
    }
  },
  yAxisData: {
    type: Array,
    default: () => {
      return []
    }
  },
  legendData: {
    type: Array,
    default: () => {
      return []
    }
  },
  customConfig: {
    type: Object,
    default: () => ({})
  }
})

const option = ref<ECOption>({
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: []
  },
  grid: {
    top: '46px',
    left: '0%',
    right: '4%',
    bottom: 10,
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      axisPointer: {
        lineStyle: {
          color: '#283158'
        }
      },
      axisLine: {
        show: false // 不显示轴线
      },
      axisTick: {
        show: false // 不显示刻度线
      },
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisPointer: {
        lineStyle: {
          color: '#283158'
        }
      },
      axisLine: {
        show: true, // 不显示轴线
        lineStyle: {
          color: '#E0E6F1'
        }
      },
      axisLabel: {
        color: '#84868D'
      },
      axisTick: {
        show: false // 不显示刻度线
      },
      splitLine: {
        show: true // 不显示 x 轴分割线
      }
    }
  ],
  series: [],
  ...prop.customConfig
})
watch(
  () => prop.data,
  e => {
    if (e) {
      option.value.series = prop.data.data
      option.value.xAxis[0].data = prop.xAxisData
      objectMerge(prop.customConfig, option.value)
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.tooltip-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 4px;
  background: #283158;
}
.tooltip-tag {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: #2c6cff;
}
</style>
