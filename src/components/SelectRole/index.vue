<template>
  <!-- 展示选择角色 -->
  <el-dialog
    v-model="show"
    :close-on-click-modal="false"
    :show-close="false"
    :append-to-body="true"
    :close-on-press-escape="false"
    :width="750"
    top="20vh"
    class="custom-role-dialog"
  >
    <div class="role-select-container">
      <div class="bg-1" />
      <div class="bg-2" />
      <div class="bg-3" />
      <div class="role-select-info">
        <div class="dialog-title">{{ $t(!isSubmitIdea ? title : '您可以去提交创意或者入驻平台。') }}</div>
        <div class="role-container">
          <div v-for="item in roleList" :key="item.value" class="avatar-item" @click="handleSelectRole(item.value)">
            <div :class="['avatar-image', selectRole === item.value && 'active-avatar-image']" v-if="item.icon">
              <img :src="getAssetsFile(item.icon)" />
              <div class="settle-status" v-if="showIcon && !hasRoles.includes(item.value.toLocaleUpperCase())">未入驻</div>
              <svg-icon v-if="selectRole === item.value" icon-class="selected" class="icon-select" />
            </div>
            <div :class="['avatar-title', selectRole === item.value && 'active-avatar-title']">{{ $t(item.label) }}</div>
            <div :class="['triangle-up', selectRole !== item.value && 'hidden-triangle']" />
          </div>
        </div>
        <div class="role-introduce-box" v-if="roleList.length > 0">
          <div class="role-introduce-title">角色介绍</div>
          <div v-for="(item, index) in introduceInfo" :key="index" class="role-introduce-content">{{ item }}</div>
        </div>
        <div v-else class="role-introduce-box">
          <div class="role-introduce-title">暂无可选择的角色</div>
        </div>
        <div class="introduce-footer">
          <template v-if="$slots.footer">
            <slot name="footer" />
          </template>
          <template v-else>
            <el-button class="cancel-btn" @click="handleCancel">取消</el-button>
            <el-button class="confirm-btn" @click="handleConfirm">确定</el-button>
          </template>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getAssetsFile } from '@/utils/image'
// import { ElNotification } from 'element-plus'
// import { t } from 'i18next'
import { computed, ref, watch } from 'vue'
import { roleOptions } from './data'
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: {
    type: String,
    default: '注册成功！您可选择符合的角色，并提交入驻材料，享受平台红利。'
  },
  roleLabel: {
    type: String,
    default: '创业者'
  },
  isSubmitIdea: {
    type: Boolean,
    default: false
  },
  rolesData: {
    type: Array,
    default: () => {
      return roleOptions
    }
  },
  hasRoles: {
    type: Array,
    default: () => {
      return []
    }
  },
  showIcon: {
    //未入驻标识
    type: Boolean,
    default: false
  }
})
const roleList = ref(props.rolesData)
watch(
  () => {
    props.rolesData
  },
  () => {
    roleList.value = props.rolesData
  },
  { immediate: true, deep: true }
)

const introduceList = {
  entrepreneur: [
    '1. 支持发起项目、项目管理、进度跟进、项目验收。',
    '2. 项目立项后，支持寻找项目投资人、寻找合适项目的工程师、寻找价格透明的供应链。',
    '3. 项目成功上市后，创业者、工程师可获得产品上市分润。'
  ],
  engineer: [
    '1. 支持上传个人简历、参与创业者发起的项目。',
    '2. 可浏览平台上发布的各类工程项目信息，包括项目简介、技术要求、工期、预算等详细内容。',
    '3. 能够根据自身专业技能和时间安排，精准筛选适合自己的项目。',
    '4. 项目成功上市后，工程师可获得产品上市分润。',
    '5. 在项目结束后，对项目发布方进行评价，包括项目组织管理、沟通协作、薪酬支付及时性等方面。'
  ],
  investor: [
    '1. 支持对众多潜在投资项目进行广泛筛选和付款投资。',
    '2. 支持展示投资成功的项目案例。',
    '3. 支持对资金明细进行跟踪。',
    '4. 投资人有相应的产品上市分润。'
  ],
  supplier: ['1. 支持对项目采购进行透明报价。', '2. 支持展示供应商的量产能力。'],
  agent: ['1. 支持对已完成的项目进行代理。', '2. 对感兴趣的项目投递代理意向。']
}
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'update:selectRole'])

const show = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
let selectRole = ref<string>('entrepreneur')
watch(
  () => props.roleLabel,
  val => {
    if (!val) {
      return
    }
    selectRole.value = roleList.value.find(item => item.label === val)?.value || 'entrepreneur'
  },
  { immediate: true, deep: true }
)
const introduceInfo = computed(() => {
  return introduceList[selectRole.value]
})
/** 选择角色 */
const handleSelectRole = (role: string) => {
  selectRole.value = role
  emit('update:selectRole', role)
}
/** 去评估 */
// const handleGoEvaluate = () => {
//   ElNotification({
//     title: t('系统提示'),
//     message: t('功能正在开发中，敬请期待！'),
//     duration: 1.5 * 1000
//   })
// }

/** 点击确定 */
const handleConfirm = () => {
  emit('confirm', selectRole.value)
}
/** 点击取消 */
const handleCancel = () => {
  emit('cancel')
}
defineExpose({
  selectRole
})
</script>

<style lang="scss">
.custom-role-dialog {
  // height: 100%;
  border-radius: 4px;
  font-family: HarmonyOS;
  background: transparent !important;
  box-shadow: none !important;
  .role-select-container {
    position: relative;
    display: inline-block;
    padding: 42px 0 40px;
    width: 100%;
    margin-top: 10vh;
  }
  .bg-1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(0deg, rgb(0 0 0 / 90%), rgb(0 0 0 / 90%));
  }
  .bg-2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background:
      linear-gradient(
        171.06deg,
        rgb(44 31 99 / 0%) 28.28%,
        rgb(50 38 104 / 38.7%) 64.26%,
        #3c3170 86.73%,
        #6c97e7 106.21%
      );
  }
  .bg-3 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(328.43deg, rgb(97 66 120 / 0%) 23.7%, #52306b 83.55%, #a272c6 107.48%);
  }
}
.role-select-info {
  width: 100%;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px;
  .dialog-title {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    background: linear-gradient(52.07deg, #de98ff 2.81%, #fff 63.68%);
    background-clip: text;
    color: transparent;
  }
  .role-container {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
  }
  .avatar-item {
    display: inline-flex;
    flex-direction: column;
    cursor: pointer;
    .avatar-image {
      position: relative;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background-color: #562780;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border: solid 1px rgb(190 110 255 / 100%);
        border-radius: 50%;
      }
      .icon-select {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 20px;
        height: 20px;
        color: #fff;
      }
      .settle-status {
        position: absolute;
        top: 0;
        right: -24px;
        width: 50px;
        height: 20px;
        border-radius: 20px;
        color: var(--text-color-theme);
        background: #fff;
        font-size: 12px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .active-avatar-image {
      background: linear-gradient(31.32deg, #8d00ff 26.4%, #d80080 136.3%);
      box-shadow: 2px 0 12px #b000c3;

      // border-color: #d9d9d9;
    }
    .avatar-title {
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      margin-top: 10px;
      text-align: center;
    }
    .triangle-up {
      width: 0;
      height: 0;
      border-left: 28px solid transparent; /* 左边透明 */
      border-right: 28px solid transparent; /* 右边透明 */
      border-bottom: 28px solid #42003a; /* 下边红色，形成三角形 */
      margin: 10px auto 0;
      opacity: 1;
      transition: all 0.1s;
    }
    .hidden-triangle {
      opacity: 0;
    }
    .active-avatar-title {
      color: #be6eff;
    }
  }
  .role-introduce-box {
    background-color: #42003a;
    padding: 20px;
    color: #fff;
    border-radius: 10px;
    margin-top: -5px;
    min-height: 204px;
    .role-introduce-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    .role-introduce-content {
      font-weight: normal;
      font-size: 14px;
      color: rgb(255 255 255 / 80%);
      margin-top: 4px;
    }
  }
  .role-introduce-desc {
    font-size: 12px;
    color: rgb(255 255 255 / 60%);
    padding-left: 20px;
    margin-top: 10px;
  }
  .text-evaluate {
    color: #be6eff;
    text-decoration: underline;
    cursor: pointer;
  }
  .icon-close {
    position: absolute;
    top: -40px;
    right: -80px;
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
  .introduce-footer {
    display: flex;
    justify-content: space-around;
    margin: 20px auto 0;
    .cancel-btn {
      width: 150px;
      height: 43px;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-color-theme);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 30px;
      margin-right: 30px;
    }
    .confirm-btn {
      width: 150px;
      height: 43px;
      background: linear-gradient(73.76deg, #8d00ff 36.77%, #d80080 127.15%);
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 30px;
    }
  }
}
</style>
