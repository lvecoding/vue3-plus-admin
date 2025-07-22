<template>
  <div class="app-container">
    <el-input
      v-model="keyword"
      :suffix-icon="Search"
      :placeholder="$t('搜索关键词')"
      style="width: 200px"
      clearable
      @keyup.enter="getList"
    />
    <el-button v-hasPermi="permission.add" type="primary" :icon="Plus" class="ml-20" @click="handleEdit()">{{
      $t('新增类目')
    }}</el-button>

    <custom-table
      :columns="columns"
      :table-data="tableData"
      :total="listCount"
      :loading="loading"
      :tableSetting="tableSetting"
      :pagination-setting="{ show: false }"
      class="mt-18"
    />
  </div>

  <!-- 新增 -->
  <el-dialog :title="dialogTitle" width="30%" v-model="addDialogVisible">
    <custom-form ref="addFormRef" :form="addFormSetting" @cancel="handleCloseDialog" @submit="handleAddForm" />
  </el-dialog>

  <!-- 编辑 -->
  <el-dialog :title="$t('编辑类目')" width="30%" v-model="editDialogVisible">
    <custom-form ref="editFormRef" :form="addFormSetting" @cancel="handleCloseEditDialog" @submit="handleUpdateForm" />
  </el-dialog>
</template>

<script setup lang="tsx">
import CustomTable from '@/components/CustomTable/index.vue'
import CustomForm from '@/components/CustomForm/index.vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { addProductType, deleteProductType, listProductType, updateProductType } from '@/api/system/productType'
import { nextTick, ref, computed, getCurrentInstance } from 'vue'
import { t } from 'i18next'
const permission = {
  add: ['system:category:add'],
  edit: ['system:category:edit'],
  delete: ['system:category:delete']
}
const { proxy }: any = getCurrentInstance()
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

let keyword = ref<string>('')
let columns = ref<any[]>([
  {
    label: t('类目名称'),
    prop: 'name',
    align: 'left',
    width: 200
  },
  {
    label: '类目图片',
    formatter: (row: any) => {
      return <image-preview src={row.pic} style={{ width: '50px', height: '50px' }} />
    }
  },
  {
    label: 'ID',
    prop: 'id'
  },
  {
    label: '状态',
    prop: 'status',
    formatter: (row: any) => {
      return <dict-tag options={sys_normal_disable.value} value={row.status} />
    }
  },
  {
    label: '排序',
    prop: 'sort'
  },
  {
    label: t('创建时间'),
    prop: 'createTime'
  },
  {
    label: '创建人',
    prop: 'createBy'
  },
  {
    label: t('操作'),
    formatter: (row: any) => {
      return (
        <>
          <el-button v-hasPermi={permission.edit} link type='warning' onClick={() => handleEdit(row)}>
            {t('编辑')}
          </el-button>
          <el-button v-hasPermi={permission.add} link type='primary' onClick={() => handleAddSubordinate(row)}>
            {t('新增下级')}
          </el-button>
          <el-popconfirm
            v-hasPermi={permission.delete}
            width='200px'
            title={t(`确认删除${row.name}分类吗？`)}
            onConfirm={() => handleDelete(row)}
          >
            {{
              reference: () => (
                <el-button link type='danger'>
                  删除
                </el-button>
              )
            }}
          </el-popconfirm>
        </>
      )
    }
  }
])
let tableData = ref<any[]>([])
let loading = ref<boolean>(false)
let listCount = ref<number>(0)
let tableSetting = ref<any>({
  attrs: { rowKey: 'id' }
})
let allCategoryList = ref<any[]>([]) // 所有的商品类目
const getList = async () => {
  loading.value = true
  try {
    const { data, total }: any = await listProductType({ keyword: keyword.value })
    tableData.value = data
    listCount.value = total

    if (!keyword.value && !allCategoryList.value.length) {
      allCategoryList.value = [{ label: '主类目', value: 0, children: handleFormatSelect(data) }]
      selectOptions.value = JSON.parse(JSON.stringify(allCategoryList.value))
    }
  } finally {
    loading.value = false
  }
}
getList()
/** 格式化商品类目数据，输出形式：{ label： xxx, value: xxx } */
const handleFormatSelect = list => {
  if (!list || !list.length) {
    return []
  }
  const newList = list.map(item => {
    return {
      label: item.name,
      value: item.id,
      children: item.children ? handleFormatSelect(item.children) : []
    }
  })
  return newList
}

let addFormRef = ref()
let addDialogVisible = ref<boolean>(false)
let dialogTitle = ref<string>(t('新增类目'))
let selectDisabled = ref<boolean>(false)
let selectOptions = ref<any[]>([])
const addFormSetting: any = computed(() => {
  return {
    attrs: { labelWidth: 100 },
    formItems: [
      {
        label: t('类目名称'),
        prop: 'name',
        component: 'el-input',
        attrs: { placeholder: t('请输入类目名称') },
        rules: [{ required: true, message: t('请输入类目名称'), trigger: 'blur' }]
      },
      {
        label: '类目图片',
        prop: 'pic',
        component: 'image-upload',
        attrs: { placeholder: t('请上传类目图片'), limit: 1 }
      },
      {
        label: t('排序'),
        prop: 'sort',
        component: 'el-input',
        attrs: { placeholder: t('请输入排序序号'), type: 'number' },
        colAttrs: { span: 12 }
      },
      {
        label: t('状态'),
        prop: 'status',
        defaultValue: '0',
        component: 'el-radio',
        attrs: { placeholder: t('请选择状态') },
        options: sys_normal_disable.value,
        colAttrs: { span: 12 }
      },
      {
        label: t('上级类目'),
        prop: 'parentId',
        component: 'el-cascader',
        attrs: {
          placeholder: t('请选择上级类目'),
          clearable: true,
          disabled: selectDisabled.value,
          props: { checkStrictly: true },
          options: selectOptions.value
        },
        rules: [{ required: true, message: t('请选择上级类目'), trigger: 'blur' }],
        colAttrs: { span: 12 }
      }
    ]
  }
})
const handleAddForm = async value => {
  value = {
    ...value,
    parentId: Array.isArray(value.parentId) ? value.parentId[value.parentId.length - 1] : value.parentId
  }
  await addProductType(value)
  handleCloseDialog()
  getList() // 刷新数据
  proxy.$message.success(t('新增成功'))
}
/** 关闭弹框 */
const handleCloseDialog = () => {
  addFormRef.value.resetForm()
  nextTick(() => {
    addDialogVisible.value = false
  })
}
/** 删除某一项 */
const handleDelete = async row => {
  await deleteProductType(row.id)
  getList() // 刷新数据
  proxy.$message.success(t('删除成功'))
}

/** 新增下级 */
const handleAddSubordinate = row => {
  selectDisabled.value = true
  selectOptions.value = [{ label: row.name, value: row.id }]
  dialogTitle.value = t('新增下级')
  addDialogVisible.value = true
  nextTick(() => {
    addFormRef.value.setFormValue({
      name: '',
      parentId: row.id,
      status: '0'
    })
  })
}
/** 编辑 */
let editDialogVisible = ref<boolean>(false)
let editFormRef = ref()
const handleEdit = (
  row: { name?: string; id?: number; parentId?: number; status?: string; sort?: number; pic?: string } = {}
) => {
  selectDisabled.value = false
  selectOptions.value = JSON.parse(JSON.stringify(allCategoryList.value))
  if (!row?.name) {
    dialogTitle.value = t('新增类目')
    addDialogVisible.value = true
    return
  }
  editDialogVisible.value = true
  nextTick(() => {
    editFormRef.value.setFormValue({
      id: row.id,
      name: row.name,
      parentId: row.parentId,
      sort: row.sort,
      status: row.status,
      pic: row.pic
    })
  })
}
const handleUpdateForm = async value => {
  value = {
    ...value,
    parentId: Array.isArray(value.parentId) ? value.parentId[value.parentId.length - 1] : value.parentId
  }
  // 修改操作
  await updateProductType(value)
  handleCloseEditDialog()
  getList() // 刷新数据
  proxy.$message.success(t('修改成功'))
}
const handleCloseEditDialog = () => {
  editFormRef.value.resetForm()
  editDialogVisible.value = false
}
</script>
