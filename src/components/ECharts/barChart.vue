<template>
  <!-- <div style="width: 100%; height: 100%"> -->
  <ECharts :option="option" />
  <!-- </div> -->
</template>

<script setup lang="ts" name="lineChart">
import { ECOption } from './config'
import ECharts from './index.vue'
import { ref, watch } from 'vue'
import { objectMerge } from '@/utils'
const props = defineProps({
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
  customConfig: {
    type: Object,
    default: () => ({})
  },
  seriesConfig: {
    type: Object,
    default: () => ({})
  }
})

const option = ref<ECOption>({
  tooltip: {
    trigger: 'axis',
    formatter: (items: any[]) => {
      return items
        .map(item => {
          return `${item.marker} ${item.name}<br/>${item.value || 0}`
        })
        .join('<br>')
    }
  },
  grid: {
    left: '0%',
    right: '10%',
    bottom: '5%',
    top: '10%',
    containLabel: true
  },
  xAxis: [
    {
      show: true,
      type: 'value',
      offset: 10,
      axisLabel: {
        show: true,
        color: '#a1a1a1'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(32, 37, 63, 0.2)',
          type: 'dashed'
        }
      }
    }
  ],
  yAxis: [
    {
      show: true,
      type: 'category',
      boundaryGap: false,
      nameTextStyle: {
        color: '#1D4A77'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      data: [],
      axisLabel: {
        color: '#000',
        overflow: 'truncate',
        width: 80,
        rich: {
          text: {
            fontSize: 12
          }
        },
        formatter: (value: string) => {
          return `{text|${value}}`
        }
      }
    }
  ],
  series: [
    {
      name: '',
      type: 'bar',
      barWidth: 16,
      label: {
        show: true, // 显示数字
        position: 'inside' // 在顶部显示
      },
      data: []
    }
  ],
  ...props.customConfig
})
watch(
  () => props.data,
  e => {
    if (e) {
      option.value.series[0].data = props.data.data
      option.value.yAxis[0].data = props.yAxisData
      objectMerge(props.customConfig, option.value)
      objectMerge(props.seriesConfig, option.value.series[0])
    }
  },
  { deep: true, immediate: true }
)
</script>

<style scoped lang="scss"></style>
