<template>
  <div v-loading="loading" class="user-container">
    <div class="form-item">
      <div class="form-item-title">头像:</div>
      <div class="form-item-value">
        <image-upload v-model="userInfo.avatar" :limit="1" />
      </div>
    </div>
    <div class="form-item">
      <div class="form-item-title">姓名:</div>
      <div class="form-item-value">{{ userInfo?.realName }}</div>
    </div>
    <div class="form-item">
      <div class="form-item-title">昵称:</div>
      <div class="form-item-value">
        <el-input v-model="userInfo.nickName" :placeholder="$t('请输入用户昵称')" style="width: 500px" />
      </div>
    </div>
    <div class="form-item">
      <div class="form-item-title">手机号码:</div>
      <div class="form-item-value">{{ userInfo.phoneNumber?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</div>
    </div>
    <div class="form-item">
      <div class="form-item-title">邮箱:</div>
      <div class="form-item-value">
        <el-input v-model="userInfo.email" :placeholder="$t('请输入邮箱')" style="width: 500px" />
      </div>
    </div>
    <div class="form-item">
      <div class="form-item-title">认证状态:</div>
      <div class="form-item-value">
        <span v-if="userInfo?.authStatus === '1'" class="color-success">已认证</span>
        <span v-else-if="userInfo?.authStatus === '2'" class="color-warning">认证审核中</span>
        <span v-else class="color-theme cursor-pointer" @click="handleAuth">去认证</span>
      </div>
    </div>
    <div class="form-item">
      <div class="form-item-title">角色:</div>
      <div class="form-item-value">
        <span v-if="role">{{ role }}</span>
        <span v-else class="color-theme cursor-pointer" @click="handleGoPath('/settlement')">{{ $t('去入驻') }}</span>
      </div>
    </div>
    <div class="form-item">
      <div class="form-item-title">密码:</div>
      <div class="form-item-value">
        <span class="color-theme cursor-pointer" @click="handleResetPassword">{{ $t('重置') }}</span>
      </div>
    </div>
    <div class="form-item">
      <div class="form-item-title">注册时间:</div>
      <div class="form-item-value">{{ userInfo?.createTime }}</div>
    </div>
    <div class="form-item">
      <div class="form-item-title">主页个人介绍:</div>
      <div class="form-item-value">
        <el-input
          v-model="userInfo.homepageDesc"
          :placeholder="$t('介绍一下自己，让更多人认识一下您吧~')"
          type="textarea"
          :rows="6"
          style="width: 500px"
        />
      </div>
    </div>

    <div class="footer">
      <el-button class="custom-btn" type="primary" @click="handleSave">{{ $t('保存修改') }}</el-button>
    </div>
  </div>

  <!-- 实名认证弹出框 -->
  <el-dialog title="实名认证" width="960" v-model="showAuth">
    <custom-form
      ref="authFormRef"
      :loading="requestLoading"
      :form="authFormSetting"
      @cancel="handleCloseDialog"
      @submit="_handleAuth"
    />
  </el-dialog>

  <!-- 重置密码弹出框 -->
  <el-dialog title="重置密码" width="500" v-model="showResetPassword">
    <custom-form
      ref="resetFormRef"
      :loading="requestLoading"
      :form="resetFormSetting"
      @cancel="handleCloseResetDialog"
      @submit="_handleReset"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { getUserProfile, updateUserProfile, submitAuth } from '@/api/customer'
import { modifyPwd } from '@/api/login'
import useUserStore from '@/store/modules/user'
import { handleValidateFormIdCard, handleValidatePassword } from '@/utils/formValidate'
import { ElMessageBox } from 'element-plus'
import { t } from 'i18next'
import { computed, getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'

const { proxy }: any = getCurrentInstance()
const { sys_customer_category } = proxy.useDict('sys_customer_category')

let userInfo = ref<{
  avatar?: string
  nickName?: string
  phoneNumber?: string
  role?: string
  createTime?: string
  homepageDesc?: string
  email?: string
  custType?: string
  realName?: string
  authStatus?: string
}>({})
const userStore = useUserStore()
let role = computed(() => {
  return sys_customer_category.value.find(item => item.value === userInfo.value?.custType)?.label
})
let loading = ref<boolean>(false)
const getUserInfo = async () => {
  loading.value = true
  try {
    const { data }: any = await getUserProfile()
    userInfo.value = {
      ...data?.currCustInfo,
      createTime: data?.createTime,
      email: data?.email,
      nickName: data?.nickName,
      realName: data?.realName,
      homepageDesc: data?.homepageDesc,
      avatar: data?.avatar || '',
      authStatus: data?.currCustInfo?.authStatus
    }
  } finally {
    loading.value = false
  }
}
getUserInfo()

/** 跳转 */
const handleGoPath = (path = '') => {
  if (!path) return
  proxy.$router.push(path)
}

/** 保存修改 */
const handleSave = async () => {
  if (loading.value) {
    return
  }
  loading.value = true
  try {
    const isValid = validate()
    if (!isValid) {
      return
    }
    await updateUserProfile({
      nickName: userInfo.value.nickName,
      avatar: userInfo.value.avatar,
      email: userInfo.value.email,
      homepageDesc: userInfo.value.homepageDesc
    })
    proxy.$message.success(t('修改成功'))
    getUserInfo()
    userStore?.getInfo()
  } finally {
    loading.value = false
  }
}

/** 校验保存数据 */
const validate = () => {
  if (!userInfo.value.nickName) {
    proxy.$message.error(t('请输入用户昵称'))
    return false
  }
  if (!userInfo.value.avatar) {
    proxy.$message.error(t('请上传用户头像'))
    return false
  }
  return true
}

/** 点击实名认证 */
let showAuth = ref<boolean>(false)
let authFormRef = ref<any>(null)
let requestLoading = ref<boolean>(false)
let authFormSetting = ref<any>({
  attrs: { labelWidth: '120px' },
  formItems: [
    {
      label: '姓名',
      prop: 'name',
      component: 'el-input',
      attrs: { placeholder: '请输入身份证姓名' },
      rules: [{ required: true, message: '身份证姓名不能为空', trigger: 'blur' }]
    },
    {
      label: '身份证号码',
      prop: 'icNumber',
      component: 'el-input',
      attrs: { placeholder: '请输入您的身份证号码' },
      toolTip:
        '根据《劳动法》《未成年人保护法》等相关法律规定，申请注册Vue3PlusAdmin平台，请选择与你身份证一致的真实年龄并确保你已年满16周岁。',
      rules: [
        {
          validator: handleValidateFormIdCard,
          trigger: 'blur'
        },
        { required: true, message: '身份证号码不能为空', trigger: 'blur' }
      ]
    },
    {
      label: '身份证',
      prop: 'icPersonalSide_icNationalEmblemSide_icHandheld',
      component: 'id-card-upload',
      toolTip: '提供复印件（加盖公章），支持JPG、JPEG、PNG格式，大小不超过3M。',
      rules: [{ required: true, message: '身份证照片不能为空', trigger: 'blur' }]
    }
  ]
})
const handleCloseDialog = () => {
  authFormRef.value?.resetForm()
  showAuth.value = false
}
const router = useRouter()
const handleAuth = async () => {
  if (!role.value) {
    await ElMessageBox.confirm(t('您当前还未入驻角色，是否前往入驻？'), t('系统提示'), {
      confirmButtonText: t('去入驻'),
      cancelButtonText: t('取消'),
      type: 'warning'
    })
    router.push({
      path: '/settlement'
    })
    return
  }

  const newRole = userInfo.value?.custType
  // 如果是创业者或者工程师，实名认证，其他角色跳转入驻修改信息
  if (newRole === 'ENTREPRENEUR' || newRole === 'ENGINEER') {
    showAuth.value = true
    return
  }
  router.push({
    path: '/settlement',
    query: { role: newRole }
  })
}
const _handleAuth = async fromValue => {
  if (requestLoading.value) {
    return
  }
  const value = JSON.parse(JSON.stringify(fromValue))
  if (value.icPersonalSide_icNationalEmblemSide_icHandheld) {
    value['icPersonalSide'] = value['icPersonalSide_icNationalEmblemSide_icHandheld'][0]
    value['icNationalEmblemSide'] = value['icPersonalSide_icNationalEmblemSide_icHandheld'][1]
    value['icHandheld'] = value['icPersonalSide_icNationalEmblemSide_icHandheld'][2]
    delete value['icPersonalSide_icNationalEmblemSide_icHandheld']
  }
  requestLoading.value = true
  try {
    await submitAuth(value)
    handleCloseDialog()
    proxy.$modal.msgSuccess('已申请实名认证，请等待审核结果。')
    setTimeout(() => {
      getUserInfo()
      userStore?.getInfo()
    }, 1000)
  } finally {
    requestLoading.value = false
  }
}

/** 点击重置密码 */
const equalToPassword = (rule, value, callback) => {
  const info = resetFormRef.value?.getFormValue()
  if (info.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

let showResetPassword = ref(false)
let resetFormRef = ref<any>(null)
let resetFormSetting = ref<any>({
  attrs: { labelWidth: '120px' },
  formItems: [
    {
      label: '旧密码',
      prop: 'oldPassword',
      component: 'el-input',
      attrs: { placeholder: '请输入旧密码', type: 'password', showPassword: true },
      rules: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }]
    },
    {
      label: '新密码',
      prop: 'newPassword',
      component: 'el-input',
      attrs: { placeholder: '请输入新密码', type: 'password', showPassword: true },
      rules: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
        { validator: handleValidatePassword, trigger: 'blur' }
      ]
    },
    {
      label: '确认密码',
      prop: 'againPassword',
      component: 'el-input',
      attrs: { placeholder: '请输入相同的密码', type: 'password', showPassword: true },
      rules: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
        { required: true, validator: equalToPassword, trigger: 'blur' }
      ]
    }
  ]
})
const handleResetPassword = () => {
  showResetPassword.value = true
}
const handleCloseResetDialog = () => {
  showResetPassword.value = false
  resetFormRef.value?.resetForm()
}
const _handleReset = async value => {
  // console.log('确认修改密码==>', value)
  await modifyPwd({
    oldPassword: value.oldPassword,
    newPassword: value.newPassword
  })
  proxy.$modal.msgSuccess('修改成功！')
  handleCloseResetDialog()
}
</script>

<style lang="scss" scoped>
.user-container {
  position: relative;
  border-radius: 10px;
  min-height: calc(100vh - 130px);
  background-color: #fff;
  padding: 20px 20px 100px;
  box-sizing: border-box;
}
.form-item {
  display: flex;
  margin-bottom: 20px;
  font-size: 14px;
  .form-item-title {
    width: 120px;
    font-size: 14px;
    color: #333;
  }
  .form-item-value {
    flex: 1;
    display: inline-flex;
    color: #666;
  }
}
.footer {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
.custom-btn {
  display: block;
}
</style>
