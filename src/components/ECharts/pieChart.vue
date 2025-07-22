<template>
  <ECharts :option="option" />
</template>

<script setup lang="ts" name="pieChart">
import { ECOption } from './config'
import ECharts from './index.vue'
import { ref, watch } from 'vue'
import { objectMerge } from '@/utils'
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
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
    position: 'right'
  },
  legend: {
    show: true,
    icon: 'rect',
    left: '200',
    top: '10',
    itemWidth: 16,
    itemHeight: 10,
    itemGap: 20,
    textStyle: {
      fontSize: 12
    }
  },
  series: [
    {
      type: 'pie',
      radius: ['64%', '80%'],
      left: '0',
      top: '60',
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: '',
        rich: {
          title: {
            color: '#8598AD',
            align: 'center'
          },
          value: {
            color: '#C6CBDC',
            lineHeight: 22,
            align: 'center'
          }
        }
      },
      data: []
    }
  ]
})
watch(
  () => props.data,
  e => {
    if (e) {
      option.value.series[0].label.formatter = ['{title|总数}', `{value|${props.data.count}}`].join('\n')
      option.value.series[0].data = props.data.data
      objectMerge(option.value, props.customConfig)
      objectMerge(option.value.series[0], props.seriesConfig)
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped lang="scss"></style>
