<template>
  <div class="gantt-container">
    <!-- 甘特图主体区域 -->
    <div ref="ganttRef" class="gantt-chart"></div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 文档链接：https://docs.dhtmlx.com/gantt/desktop__howtostart_guides.html
 * 属性配置：https://docs.dhtmlx.com/gantt/api__gantt_drag_progress_config.html
 * 回调事件：https://docs.dhtmlx.com/gantt/api__gantt_ontaskcreated_event.html
 * 示例：https://docs.dhtmlx.com/gantt/samples
 */
import { onMounted, ref, watch } from 'vue'
import gantt from 'dhtmlx-gantt'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

const emit = defineEmits(['modify', 'add'])
const props = defineProps({
  tasks: {
    type: Object,
    required: true
  },
  customConfig: {
    //自定义config配置
    type: Object,
    required: false
  },
  customTemplate: {
    //自定义Template配置
    type: Object,
    required: false
  },
  zoomLevelsConfig: {
    type: Array,
    required: false
  }
})
const ganttRef = ref<HTMLElement | null>(null)
const defaultGantConfig = {
  // scale_unit: 'day',
  // date_scale: '%m/%d', // 时间轴显示为年月日
  drag_progress: true,
  drag_move: true,
  drag_resize: true,
  horizontal_scroll_key: 'altKey',
  open_split_tasks: true, //通过点击 +/- 按钮可以展开/折叠拆分任务
  preserve_scroll: true, //重新绘制甘特图时保留垂直和水平滚动的当前位置
  scroll_on_click: true, //点击任务自动滚动到任务开始时间进度
  autoscroll: true, //将任务或链接拖出当前浏览器屏幕时启用自动滚动
  grid_width: 350,
  row_height: 40,
  bar_height: 24,
  scale_height: 100,
  show_grid: true, //左侧表格显示
  add_task_button: false, // 禁用工具栏的“添加任务”按钮
  dblclick_create: false // 禁用双击添加任务
}
watch(
  () => props.customConfig.columns,
  () => {
    if (props.customConfig.columns) {
      defaultGantConfig.columns = props.customConfig.columns
    }
  },
  { immediate: true }
)
const defalutTemplatesConfig = {
  // task_text: (start, end, task) => {
  //   return task.text
  // },
  // task_class: (start, end, task) => {
  //   return ''
  // },
  // task_progress_class: (start, end, task) => {
  //   return ''
  // },
  // task_cell_class: (start, end, task) => {
  //   return ''
  // },
  // task_cell_label: (start, end, task) => {},
  task_date: date => {
    return gantt.date.date_to_str('%Y-%m-%d')(date) // 任务日期显示为年月日
  },
  tooltip_text: (start, end, task) => {
    //自定义toolTip显示的内容
    return `
    <div >
      <strong>任务名称:</strong> ${task.text}<br>
      <strong >开始时间:</strong> ${gantt.templates.tooltip_date_format(start)}<br>
      <strong>结束时间:</strong> ${gantt.templates.tooltip_date_format(end)}<br>
      <strong>进度:</strong> ${(Number(task.progress) * 100).toFixed(2) || 0}%
    </div>
  `
  }
}
let isInitialized = false
const initGantt = (container: HTMLElement) => {
  // 避免重复初始化配置
  if (!isInitialized) {
    const target = { ...defaultGantConfig, ...props.customConfig }
    for (const key in target) {
      gantt.config[key] = target[key]
    }
    const templateTarget = { ...defalutTemplatesConfig, ...props.customTemplate }
    for (const key in templateTarget) {
      gantt.templates[key] = templateTarget[key]
    }
    gantt.plugins({
      tooltip: true,
      fullscreen: true,
      drag_timeline: true,
      critical_path: true,
      undo: true
    })
    gantt.ext.zoom.init({
      levels: props.zoomLevelsConfig
    })
    gantt.ext.zoom.setLevel('month')
    gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
      console.log(task, id, '点击表格任务>>>>')
      emit('modifyTaskTitle', task)
      return true
    })
    // 监听右侧任务点击
    gantt.attachEvent('onTaskSelected', id => {
      const task = gantt.getTask(id)
      console.log(task, '点击右侧任务')
      emit('modify', task)
      if (task) {
        gantt.scrollTo(task.start_date, id) // 自动滚动到任务位置
      }
      return true
    })
    /** 监听任务点击修改 */
    // gantt.attachEvent('onTaskClick', function (id) {
    //   const task = gantt.getTask(id) // // 获取当前任务对应的数据
    //   emit('modify', task)
    //   if (task) {
    //     gantt.scrollTo(task.start_date, id) // 自动滚动到任务位置
    //   }
    //   return true
    // })
    /** 监听任务添加 */
    gantt.attachEvent('onTaskCreated', function () {
      emit('add')
      return false
    })
    gantt.attachEvent('onAfterTaskDrag', function (id, mode, e) {
      console.log('任务拖动完成:', id, mode, e)
      console.log(gantt, 'ganttgantt')
      const task = gantt.getTask(id)
      console.log(task, '拖动任务最新数据')
      // 保存当前滚动位置
      const state = gantt.getScrollState()
      localStorage.setItem('horizontalScrollPos', state.x)
      emit('taskDragUpdate', task)
      return true
    })
    gantt.i18n.setLocale('cn')
    isInitialized = true
  }

  gantt.init(container)
  gantt.clearAll()
  gantt.parse(props.tasks) // 恢复滚动位置
  gantt.setSkin('material')
  // 保存当前滚动位置
  if (localStorage.getItem('horizontalScrollPos')) {
    gantt.scrollTo(localStorage.getItem('horizontalScrollPos'), null)
  }
}
onMounted(() => {
  if (ganttRef.value) {
    localStorage.setItem('horizontalScrollPos', 0)
    initGantt(ganttRef.value)
  }
})
onBeforeUnmount(() => {
  if (ganttRef.value.gantt.$initialized) {
    ganttRef.value.gantt.destructor()
    isInitialized = false
  }
})
/** 手动更新某项数据 */
const updateTask = (id, value) => {
  if (!id) {
    return
  }
  gantt.updateTask(id, value)
}
/** 手动添加某项数据 */
const addTask = value => {
  gantt.addTask(value)
}
/** 手动删除某一项 */
const deleteTask = id => {
  gantt.deleteTask(id)
}
const initGanttData = () => {
  console.log('初始始化甘特图数据')
  if (ganttRef.value) {
    initGantt(ganttRef.value)
  }
}
const changeTime = val => {
  gantt.ext.zoom.setLevel(val)
}
defineExpose({
  gantt,
  updateTask,
  addTask,
  deleteTask,
  initGanttData,
  changeTime
})
</script>

<style lang="scss" scoped>
@import './dhtmlxgantt.css';
@import './controls_styles.css';
@import './suite.css';
.gantt-container {
  position: relative;
  height: 100%;

  --dhx-gantt-font-family: HarmonyOS;
  --dhx-gantt-base-colors-select: rgb(141 0 255 / 10%);
  --dhx-gantt-base-colors-hover-color: rgb(141 0 255 / 10%);

  // --dhx-gantt-base-colors-icons: var(--text-color-theme);
  // --dhx-gantt-base-colors-select: var(--text-color-pink);
  // :deep(.gantt_grid_head_add) {
  //   --dhx-gantt-base-colors-icons: var(--text-color-theme);
  // }
  // :deep(.gantt_add) {
  //   --dhx-gantt-base-colors-icons: var(--text-color-theme);
  // }
  // --dhx-gantt-base-colors-primary: '#448AFF';
  // --dhx-gantt-task-background: '#448AFF';
  .gantt-chart {
    height: calc(100% - 40px);
    width: 100%;
    :deep(.gantt_task_content) {
      font-size: 12px;
      padding-left: 8px;
    }
  }
  .gantt-toolbar {
    padding: 8px 16px;
    background: #f7f8fa;
    border-top: 1px solid #e5e6eb;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
