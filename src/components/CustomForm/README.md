## CustomForm 基于 element-ui 的表单组件二次封装而来(持续完善中)

> 基于配置项实现生成基础的表单页面，支持配置表单项显隐，设置表单值，校验，重置校验，自定义按钮等功能

```js
举个例子
{
  attrs: {
    labelPosition: 'left',
    labelWidth: '100px',
  },
  formItems: [
    {
      prop: 'name',
      label: '姓名',
      component: 'el-input',
      attrs: {
        placeholder: '请输入姓名',
      },
      colAttrs: { span: 12 },
      rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    },
    {
      prop: 'age',
      label: '年龄',
      component: 'el-input',
      attrs: {
        placeholder: '请输入年龄',
      },
      colAttrs: { span: 12 },
      rules: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
    },
    {
      prop: 'hobbies',
      label: '兴趣爱好',
      component: 'el-select',
      defaultValue: '打球',
      attrs: {
        placeholder: '请选择兴趣爱好',
      },
      options: [
          { label: '打球', value: '打球' },
          { label: '打豆豆', value: '打豆豆' },
          { label: '看电影', value: '看电影' },
      ],
      rules: [{ required: true, message: '请选择兴趣爱好', trigger: 'blur' }],
    },
    {
      prop: 'ballType',
      label: '球类',
      component: 'el-select-v2',
      show: (formValue: any = {}) => {
        return ['打球', '看电影']?.includes(formValue['hobbies'])
          ? true
          : false;
      },
      attrs: {
        placeholder: '请选择平时喜欢的球类',
        multiple: true,
      },
      options: [
          { label: '篮球', value: '篮球' },
          { label: '足球', value: '足球' },
          { label: '网球', value: '网球' },
          { label: '排球', value: '排球' },
          { label: '高尔夫', value: '高尔夫' },
          { label: '棒球', value: '棒球' },
          { label: '保龄球', value: '保龄球' },
      ],
      rules: [
        { required: true, message: '请选择平时喜欢的球类', trigger: 'blur' },
      ],
    },
  ],
}
```

### 参数配置说明：

| 基本参数 | 说明                                                                          | 类型    | 可选值 | 默认值 |
| -------- | ----------------------------------------------------------------------------- | ------- | :----: | ------ |
| form     | 表单配置项，详见下面                                                          | Object  |   -    | -      |
| loading  | 按钮loading状态，查询模式下的查询按钮loading或者提交表单模式下提交按钮loading | Boolean |   -    | -      |

### Form 参数说明：

| 基本参数  | 说明                                                                                      | 类型   | 可选值 | 默认值 |
| --------- | ----------------------------------------------------------------------------------------- | ------ | :----: | ------ |
| mode      | 模式分为查询（search）和提交表单（submit），其他值正常展示表单项配置，但不会展示底部按钮  | String |   -    | submit |
| attrs     | [配置项(可见 form 配置参数)](https://element-plus.org/zh-CN/component/form.html#form-api) | Object |   -    | -      |
| formItems | 表单项配置                                                                                | Array  |   -    | -      |
| btns      | 底部按钮配置                                                                              | Array  |   -    | -      |
| rowAttrs  | 表单布局配置（配置[详见](https://element-plus.org/zh-CN/component/layout.html#row-api)）  | Array  |   -    | -      |

### FormItem 参数说明：

| 基本参数       | 说明                                                                                            | 类型             | 可选值 | 默认值 |
| -------------- | ----------------------------------------------------------------------------------------------- | ---------------- | :----: | ------ |
| prop           | 后端字段                                                                                        | String           |   -    | -      |
| label          | 名称                                                                                            | String           |   -    | -      |
| component      | 组件名称，注册全局组件可用                                                                      | String           |   -    | -      |
| options        | 选项，el-select组件的选项组配置                                                                 | String           |   -    | -      |
| show           | 是否展示                                                                                        | Boolean/Function |   -    | -      |
| attrs          | 组件配置参数                                                                                    | Object           |   -    | -      |
| rules          | 校验规则[(详见)](https://element-plus.org/zh-CN/component/form.html#formitemrule)               | Array            |   -    | -      |
| componentSlots | 组件插槽配置，详见每个组件支持的插槽配置                                                        | Array            |   -    | -      |
| formSlots      | 表单项插槽配置，[详见](https://element-plus.org/zh-CN/component/form.html#%E6%8F%92%E6%A7%BD-1) | Array            |   -    | -      |
| events         | 组件回调事件                                                                                    | Array            |   -    | -      |
| colAttrs       | 布局配置（配置[详见](https://element-plus.org/zh-CN/component/layout.html#col-api)）            | Array            |   -    | -      |

### slots 参数说明：

| 基本参数  | 说明       | 类型     | 可选值 | 默认值 |
| --------- | ---------- | -------- | :----: | ------ |
| name      | 插槽名称   | String   |   -    | -      |
| formatter | 渲染的数据 | Function |   -    | -      |
| text      | 文案       | String   |   -    | -      |

### btns 参数说明:

| 基本参数 | 说明         | 类型   | 可选值 | 默认值 |
| -------- | ------------ | ------ | :----: | ------ |
| text     | 按钮名称     | String |   -    | -      |
| attrs    | 按钮配置参数 | Object |   -    | -      |
| events   | 按钮回调事件 | Object |   -    | -      |

### 回调事件说明:

| 回调名称 | 说明           | 类型     | 可选值 | 默认值 |
| -------- | -------------- | -------- | :----: | ------ |
| cancel   | 点击取消按钮   | Function |   -    | -      |
| submit   | 点击提交按钮   | Function |   -    | -      |
| reset    | 重置表单值回调 | Function |   -    | -      |
| change   | 值变化         | Function |   -    | -      |
| search   | 点击查询按钮   | Function |   -    | -      |

### 提供给父组件的方法:

| 方法名称      | 说明       | 类型     | 可选值 | 默认值 |
| ------------- | ---------- | -------- | :----: | ------ |
| setFormValue  | 设置表单值 | Function |   -    | -      |
| resetForm     | 重置表单值 | Function |   -    | -      |
| getFormValue  | 获取表单值 | Function |   -    | -      |
| resetValidate | 清楚校验   | Function |   -    | -      |
