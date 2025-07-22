<template>
  <div class="register">
    <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">Vue3PlusAdmin</h3>
      <el-form-item prop="phoneNumber">
        <el-input v-model="registerForm.phoneNumber" type="text" size="large" auto-complete="off" placeholder="手机号">
          <template #prefix><svg-icon icon-class="phone" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleRegister"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="确认密码"
          @keyup.enter="handleRegister"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input
          size="large"
          v-model="registerForm.captcha"
          auto-complete="off"
          placeholder="验证码"
          @keyup.enter="handleRegister"
        >
          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <el-button type="primary" :disabled="isSendCode" size="small" class="captcha-btn" @click="handleSendCode">
          <template v-if="isSendCode">（{{ timer }}s）</template>
          <template v-else>{{ sendAgain ? $t('重新发送') : $t('发送验证码') }}</template>
        </el-button>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right">
          <router-link class="link-type" :to="'/login'">使用已有账户登录</router-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { register } from '@/api/login'
import { useRouter } from 'vue-router'
import { getCurrentInstance, ref } from 'vue'
import { getCode } from '@/api/verification'
import { validPhone } from '@/utils/validate'
import { setToken } from '@/utils/auth'
import { handleValidatePassword } from '@/utils/formValidate'

const router = useRouter()
const { proxy }: any = getCurrentInstance()
const verificationType = '1' // 注册用户类型
const registerForm = ref<{
  phoneNumber: string
  password: string
  confirmPassword: string
  captcha: string
}>({
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  captcha: ''
})

const equalToPassword = (rule, value, callback) => {
  if (registerForm.value.password !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入有效的手机号',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' },
    { validate: handleValidatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ],
  captcha: [{ required: true, trigger: 'change', message: '请输入验证码' }]
}

/** 发送验证码 */
let isSendCode = ref<boolean>(false)
let sendAgain = ref<boolean>(false)
let timer = ref<number>(60) // 60秒
let loopTimer: any = null
const handleSendCode = async () => {
  if (!registerForm.value.phoneNumber) {
    return proxy.$message.error('请输入手机号')
  }
  if (!validPhone(registerForm.value.phoneNumber)) {
    return proxy.$message.error('请输入有效的手机号')
  }
  const { data }: any = await getCode({
    phoneNumber: registerForm.value.phoneNumber,
    verificationType: verificationType
  })
  sendAgain.value = true
  isSendCode.value = true
  // TODO: 上线正式环境需要将此处自动填写逻辑注释掉
  data && (registerForm.value.captcha = data || '')
  proxy.$message.success('发送成功')

  loopTimer = setInterval(() => {
    if (timer.value === 1) {
      timer.value = 60
      isSendCode.value = false
      clearInterval(loopTimer)
    }
    timer.value--
  }, 1 * 1000)
}

/** 注册 */
const loading = ref(false)
function handleRegister() {
  proxy.$refs.registerRef.validate(async valid => {
    if (valid) {
      loading.value = true
      try {
        const { token }: any = await register(registerForm.value)
        setToken(token)
      } finally {
        loading.value = false
      }
      proxy.$message.success('注册成功~')
      router.push('/settlement')
    }
  })
}
</script>

<style lang="scss" scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/images/login-background.jpg');
  background-size: cover;
}
.title {
  margin: 0 auto 30px;
  text-align: center;
  color: #707070;
}
.register-form {
  border-radius: 6px;
  background: #fff;
  width: 400px;
  padding: 25px 25px 5px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0;
  }
}
.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.register-captcha {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-register-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.register-captcha-img {
  height: 40px;
  padding-left: 12px;
}
.captcha-btn {
  position: absolute;
  top: 8px;
  right: 10px;
}
</style>
