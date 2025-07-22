## CustomTable 基于 element-ui 的表格组件二次封装而来(持续完善中)

> 支持 element-ui 中 table 组件的大部分功能，将表格和分页组件合并封装在一起，方便操作

```js
// 列配置
const columns = ref([
  {
    prop: 'name',
    label: '姓名',
    width: 100
  },
  {
    prop: 'age',
    label: '年龄',
    width: 100
  },
  {
    prop: 'sex',
    label: '性别',
    width: 100
  },
  {
    prop: 'address',
    label: '地址',
    width: 100
  }
])

// 数据配置
const data = ref([
  {
    name: '张三',
    age: 18,
    sex: '男',
    address: '北京'
  },
  {
    name: '李四',
    age: 19,
    sex: '女',
    address: '上海'
  },
  {
    name: '王五',
    age: 20,
    sex: '男',
    address: '广州'
  }
])

// 表格配置
const tableSetting = {
  attrs: {
    border: true
  }
}
```

### 参数配置说明：

| 基本参数          | 说明                                | 类型    | 可选值 | 默认值 |
| ----------------- | ----------------------------------- | ------- | :----: | ------ |
| columns           | 表头配置                            | Array   |   -    | -      |
| tableSetting      | 表格配置                            | Object  |   -    | -      |
| tableData         | 表格数据                            | Array   |   -    | -      |
| total             | 总数据（分页用到）                  | Number  |   -    | -      |
| paginationSetting | 分页配置                            | Object  |   -    | -      |
| loading           | 加载状态                            | Boolean |   -    | false  |
| limit             | 分页数据量大小，可使用v-model:limit | Number  |   -    | 10     |
| page              | 页码，可使用v-model:page            | Number  |   -    | 1      |

### tableSetting 参数配置说明：

| 基本参数 | 说明                                                                                                                                                                                | 类型   | 可选值 | 默认值 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | :----: | ------ |
| attrs    | 配置参数（支持[表格](https://element-plus.org/zh-CN/component/table.html#table-api)和[虚拟表格](https://element-plus.org/zh-CN/component/table-v2.html#tablev2-api)原有参数配置项） | Object |   -    | -      |
| slot     | 插槽配置                                                                                                                                                                            | Array  |   -    | -      |
| events   | [事件配置](https://element-plus.org/zh-CN/component/table.html#table-%E4%BA%8B%E4%BB%B6)                                                                                            | Object |   -    | -      |

### paginationSetting 参数配置说明：

| 基本参数 | 说明                                                                                    | 类型    | 可选值 | 默认值 |
| -------- | --------------------------------------------------------------------------------------- | ------- | :----: | ------ |
| show     | 是否使用分页                                                                            | Boolean |   -    | true   |
| attrs    | [分页配置](https://element-plus.org/zh-CN/component/pagination.html#api)                | Object  |   -    | -      |
| events   | [事件配置](https://element-plus.org/zh-CN/component/pagination.html#%E4%BA%8B%E4%BB%B6) | Object  |   -    | -      |

### 回调事件说明:

| 回调名称      | 说明                                         | 类型     | 可选值 | 默认值                                          |
| ------------- | -------------------------------------------- | -------- | :----: | ----------------------------------------------- |
| currentChange | 分页 current-page 改变触发                   | Function |   -    | (value: number) => void                         |
| sizeChange    | 分页 page-size 改变时触发                    | Function |   -    | (value: number) => void                         |
| change        | 分页 current-page 或 page-size 更改时触发    | Function |   -    | (currentPage: number, pageSize: number) => void |
| prevClick     | 分页 用户点击上一页按钮改变当前页时触发      | Function |   -    | (value: number) => void                         |
| nextClick     | 分页 用户点击下一页按钮改变当前页时触发      | Function |   -    | (value: number) => void                         |
| select        | 当用户手动勾选数据行的 Checkbox 时触发的事件 | Function |   -    | <T = any>(selection: T[], row: T) => void       |
| selectAll     | 当用户手动勾选全选 Checkbox 时触发的事件     | Function |   -    | (selection: any[]) => void                      |
