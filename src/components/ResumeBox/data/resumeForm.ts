export const baseInfoForm = {
  label: '个人信息',
  formItems: [
    {
      label: '工作开始时间',
      prop: 'workStartDate',
      component: 'el-date-picker',
      attrs: { placeholder: '请选择工作开始时间', type: 'date', valueFormat: 'YYYY-MM-DD' },
      rules: [{ required: true, message: '工作开始时间不能为空', trigger: 'blur' }],
      colAttrs: { span: 12 }
    }
  ]
}

export const advantageInfoForm = {
  label: '个人优势',
  formItems: [
    {
      label: '个人优势',
      prop: 'personalAdvantages',
      component: 'el-input',
      attrs: { placeholder: '至少输入5个字~', type: 'textarea', rows: 3 },
      rules: [
        { required: true, message: '个人优势不能为空', trigger: 'blur' },
        { min: 5, message: '个人优势至少输入5个字', trigger: 'blur' }
      ]
    }
  ]
}

export const workInfoForm = {
  label: '工作经历',
  attrs: { labelWidth: '90px' },
  formItems: [
    {
      label: '职位',
      prop: 'posId',
      component: 'post-select',
      attrs: { placeholder: '请选择职位' },
      rules: [{ required: true, message: '职位不能为空', trigger: 'blur' }],
      colAttrs: { span: 12 }
    },
    {
      label: '就职公司',
      prop: 'comp',
      component: 'el-input',
      attrs: { placeholder: '请输入公司名称' },
      rules: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
      colAttrs: { span: 12 }
    },
    {
      label: '在职时间',
      prop: 'startDate_endDate',
      component: 'el-date-picker',
      attrs: {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD'
      },
      rules: [{ required: true, message: '在职时间不能为空', trigger: 'blur' }],
      colAttrs: { span: 12 }
    },
    {
      label: '工作技能',
      prop: 'skills',
      component: 'el-input-tag',
      attrs: { placeholder: '请输入技能', tagType: 'primary' },
      rules: [{ required: true, message: '技能不能为空', trigger: 'blur' }],
      colAttrs: { span: 12 }
    },
    {
      label: '工作内容',
      prop: 'workExp',
      component: 'el-input',
      attrs: { placeholder: '至少输入5个字', type: 'textarea', rows: 3 },
      rules: [
        { required: true, message: '工作内容不能为空', trigger: 'blur' },
        { min: 5, message: '工作内容至少输入5个字', trigger: 'blur' }
      ],
      colAttrs: { span: 12 }
    }
  ]
}

export const projectInfoForm = {
  label: '项目经历',
  attrs: { labelWidth: '90px' },
  formItems: [
    {
      label: '职位',
      prop: 'pos',
      component: 'post-select',
      attrs: { placeholder: '请选择职位' },
      rules: [{ required: true, message: '职位不能为空', trigger: 'blur' }],
      colAttrs: { span: 12 }
    },
    {
      label: '项目名称',
      prop: 'projName',
      component: 'el-input',
      attrs: { placeholder: '请输入项目名称' },
      rules: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
      colAttrs: { span: 12 }
    },
    {
      label: '项目周期',
      prop: 'startDate_endDate',
      component: 'el-date-picker',
      attrs: {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD'
      },
      rules: [{ required: true, message: '项目周期不能为空', trigger: 'blur' }],
      colAttrs: { span: 12 }
    },
    {
      label: '工作内容',
      prop: 'descr',
      component: 'el-input',
      attrs: { placeholder: '至少输入5个字', type: 'textarea', rows: 3 },
      rules: [
        { required: true, message: '工作内容不能为空', trigger: 'blur' },
        { min: 5, message: '工作内容至少输入5个字', trigger: 'blur' }
      ],
      colAttrs: { span: 12 }
    }
  ]
}

export const educationInfoForm = sys_education => {
  return {
    label: '教育经历',
    attrs: { labelWidth: '100px' },
    formItems: [
      {
        label: '您的学历',
        prop: 'educationLevel',
        component: 'el-select',
        options: sys_education,
        attrs: { placeholder: '请选择学历' },
        rules: [{ required: true, message: '学历不能为空', trigger: 'blur' }],
        colAttrs: { span: 12 }
      },
      {
        label: '学历类型',
        prop: 'educationType',
        component: 'el-select',
        options: [
          { label: '全日制', value: 'Full-time' },
          { label: '非全日制', value: 'Part-time' }
        ],
        attrs: { placeholder: '请选择学历' },
        rules: [{ required: true, message: '学历不能为空', trigger: 'blur' }],
        colAttrs: { span: 12 },
        show: value => {
          return value?.educationLevel === '3'
        }
      },
      {
        label: '您的学校',
        prop: 'school',
        component: 'el-input',
        attrs: { placeholder: '请输入您的学校名称' },
        rules: [{ required: true, message: '学校名称不能为空', trigger: 'blur' }],
        colAttrs: { span: 12 }
      },
      {
        label: '您的专业',
        prop: 'major',
        component: 'el-input',
        attrs: { placeholder: '请输入专业名称' },
        rules: [{}, { required: true, message: '专业名称不能为空', trigger: 'blur' }],
        colAttrs: { span: 12 }
      },
      {
        label: '在校时间段',
        prop: 'schoolStartDate_schoolEndDate',
        component: 'el-date-picker',
        attrs: {
          type: 'daterange',
          rangeSeparator: '至',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          valueFormat: 'YYYY-MM-DD'
        },
        rules: [{ required: true, message: '在校时间段不能为空', trigger: 'blur' }],
        colAttrs: { span: 12 }
      },
      {
        label: '在校经历',
        prop: 'schoolExperience',
        component: 'el-input',
        attrs: { placeholder: '请输入在校经历~', type: 'textarea', rows: 3 },
        colAttrs: { span: 12 }
      }
    ]
  }
}
