# GanttChart 组件使用指南

## 功能特性

- 支持任务拖拽调整时间
- 支持进度条拖拽调整
- 支持任务依赖关系连线
- 支持关键路径高亮显示
- 支持缩放查看不同时间粒度

## 基本用法

```vue
<template>
  <gantt-chart :tasks="tasksData" />
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    const tasksData = reactive({
      data: [
        {
          id: 1,
          text: '任务名称',
          start_date: '2025-01-01',
          duration: 5,
          progress: 0.5,
          parent: 0
        }
      ],
      links: [{ id: 1, source: 1, target: 2, type: '1' }]
    })

    return { tasksData }
  }
}
</script>
```

## API

### Props

| 参数  | 说明                      | 类型   | 默认值 |
| ----- | ------------------------- | ------ | ------ |
| tasks | 任务数据，包含data和links | Object | 必填   |

### 任务数据结构

```ts
interface Task {
  id: number | string
  text: string
  start_date: string // YYYY-MM-DD
  duration: number // 天数
  progress: number // 0-1
  parent?: number | string
  $critical?: boolean // 是否关键路径
}

interface Link {
  id: number | string
  source: number | string
  target: number | string
  type: '0' | '1' // 0-完成到开始,1-开始到开始
}
```

## 示例

访问 `/demo/gantt` 查看完整示例
