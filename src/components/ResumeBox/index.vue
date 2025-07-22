<template>
  <div class="user-container">
    <div v-if="props.canEdit" class="title">我的在线简历</div>
    <div v-if="resume" :class="['resume-container', props.canEdit ? '' : 'mt-1']">
      <div class="resume-user-info">
        <div
          :class="['resume-user-name', editDom === 'baseInfo' && 'active-bg']"
          @mouseenter="handleMouseOver('baseInfo')"
          @mouseleave="handleMouseLeave"
        >
          <template v-if="editDom === 'baseInfo'">
            <custom-form ref="baseInfoRef" :form="baseForm" :loading="loading" @submit="handleUpdate" @cancel="editDom = ''" />
          </template>
          <template v-else>
            <span class="name">{{ resume?.nickName }}</span>
            <div v-if="resume?.educationLevel" class="aic flex mt-10">
              <div class="aic flex">
                <img src="../../assets/images/index/icon-work-exp.png" class="icon-resume" />
                <dict-tag :options="sys_education" :value="resume?.educationLevel + ''" />
              </div>
              <div class="aic flex ml-60">
                <img src="../../assets/images/index/icon-work-exp.png" class="icon-resume" />
                <span v-if="resume?.workYears && resume?.workYears !== '0'">{{ resume?.workYears }}年工作经验</span>
                <span v-else>不满一年工作经验</span>
              </div>
            </div>
          </template>
          <div
            v-if="mouseOverDom === 'baseInfo' && editDom !== 'baseInfo'"
            class="edit-container"
            @click="
              handleEdit('baseInfo', 'baseInfoRef', {
                workStartDate: resume?.workStartDate
              })
            "
          >
            <el-icon class="mr-6"><EditPen /></el-icon>
            {{ $t('编辑') }}
          </div>
        </div>
        <div class="avatar-box">
          <img :src="resume?.avatar" />
        </div>
      </div>

      <!-- 个人优势 -->
      <div class="resume-title" @mouseover="handleMouseOver('addAdvantage')" @mouseleave="handleMouseLeave">
        <div class="aic flex">
          <div class="resume-line" />
          个人优势
        </div>
        <div
          v-if="mouseOverDom === 'addAdvantage' && !resume?.personalAdvantages"
          class="add-container"
          @click="handleEdit('addAdvantage')"
        >
          <el-icon class="mr-6"><CirclePlus /></el-icon>
          添加个人优势
        </div>
      </div>
      <div
        :class="['resume-advantage', (editDom === 'addAdvantage' || editDom === 'editAdvantage') && 'active-bg']"
        @mouseover="handleMouseOver('editAdvantage')"
        @mouseleave="handleMouseLeave"
      >
        <template v-if="editDom === 'addAdvantage' || editDom === 'editAdvantage'">
          <custom-form
            ref="advantageRef"
            :form="advantageForm"
            :loading="loading"
            @submit="handleUpdate"
            @cancel="editDom = ''"
          />
        </template>
        <template v-else>
          {{ resume?.personalAdvantages }}
        </template>
        <div
          v-if="mouseOverDom === 'editAdvantage' && editDom !== 'editAdvantage'"
          class="edit-container"
          @click="
            handleEdit('editAdvantage', 'advantageRef', {
              personalAdvantages: resume?.personalAdvantages
            })
          "
        >
          <el-icon class="mr-6"><EditPen /></el-icon>
          {{ $t('编辑') }}
        </div>
      </div>

      <!-- 工作经历 -->
      <div class="resume-title" @mouseover="handleMouseOver('addWork')" @mouseleave="handleMouseLeave">
        <div class="aic flex">
          <div class="resume-line" />
          工作经历
        </div>
        <div v-if="mouseOverDom === 'addWork'" class="add-container" @click="handleEdit('addWork')">
          <el-icon class="mr-6"><CirclePlus /></el-icon>
          添加工作经历
        </div>
      </div>
      <div v-if="editDom === 'addWork'" class="resume-work-item active-bg">
        <custom-form ref="workRef" :form="workForm" :loading="loading" @submit="handleAddWork" @cancel="editDom = ''" />
      </div>
      <div
        v-for="(item, index) in resume?.resumeWorkList"
        :key="index"
        :class="['resume-work-item', editDom === 'editWork' + index && 'active-bg']"
        @mouseover="handleMouseOver('editWork' + index)"
        @mouseleave="handleMouseLeave"
      >
        <template v-if="editDom === 'editWork' + index">
          <custom-form
            :ref="'workRef' + index"
            :form="workForm"
            :loading="loading"
            @submit="value => handleAddWork(value, 'edit')"
            @cancel="editDom = ''"
          />
        </template>
        <template v-else>
          <div class="resume-work-company">
            <div class="flex-1">
              {{ item?.comp }} <span class="ml-50">{{ item?.pos }}</span>
            </div>
            <div class="ml-20 resume-work-time">
              {{ dayjs(item?.startDate).format('YYYY.MM.DD') }} ~ {{ dayjs(item?.endDate).format('YYYY.MM.DD') }}
            </div>
          </div>
          <div v-if="item.skills" class="aic flex">
            <div v-for="skillItem in item.skills.split(',')" :key="skillItem" class="skill-tag">{{ skillItem }}</div>
          </div>
          <div class="resume-work-content">
            <span class="resume-work-title">内容：</span>
            <div class="flex-1">{{ item.workExp }}</div>
          </div>
        </template>
        <div v-if="mouseOverDom === 'editWork' + index && editDom !== 'editWork' + index" class="edit-container">
          <div
            class="flex aic"
            @click="
              handleEditWork('editWork' + index, 'workRef' + index, {
                ...item,
                pos: parseFloat(item.pos),
                skills: item.skills?.split(',') || [],
                startDate_endDate: [item.startDate, item.endDate]
              })
            "
          >
            <el-icon class="mr-6"><EditPen /></el-icon>
            {{ $t('编辑') }}
          </div>
          <div class="flex aic ml-12" @click="handleDeleteWork(item?.id)">
            <el-icon class="mr-6"><Delete /></el-icon>
            {{ $t('删除') }}
          </div>
        </div>
      </div>

      <!-- 项目经历 -->
      <div class="resume-title" @mouseover="handleMouseOver('addProject')" @mouseleave="handleMouseLeave">
        <div class="aic flex">
          <div class="resume-line" />
          项目经历
        </div>
        <div v-if="mouseOverDom === 'addProject'" class="add-container" @click="handleEdit('addProject')">
          <el-icon class="mr-6"><CirclePlus /></el-icon>
          添加项目经历
        </div>
      </div>
      <div v-if="editDom === 'addProject'" class="resume-work-item active-bg">
        <custom-form ref="projectRef" :form="projectForm" :loading="loading" @submit="handleAddProject" @cancel="editDom = ''" />
      </div>
      <div
        v-for="(item, index) in resume?.resumeProjectList"
        :key="index"
        :class="['resume-work-item', editDom === 'editProject' + index && 'active-bg']"
        @mouseover="handleMouseOver('editProject' + index)"
        @mouseleave="handleMouseLeave"
      >
        <template v-if="editDom === 'editProject' + index">
          <custom-form
            :ref="'projectRef' + index"
            :form="projectForm"
            :loading="loading"
            @submit="value => handleAddProject(value, 'edit')"
            @cancel="editDom = ''"
          />
        </template>
        <template v-else>
          <div class="resume-work-company">
            <div class="flex-1">
              {{ item?.projName }} <span class="ml-50">{{ handleFormatJob(item?.pos) }}</span>
            </div>
            <div class="ml-20 resume-work-time">
              {{ dayjs(item?.startDate).format('YYYY.MM.DD') }} ~ {{ dayjs(item?.endDate).format('YYYY.MM.DD') }}
            </div>
          </div>
          <div v-if="item.skills" class="aic flex">
            <div v-for="skillItem in item.skills.split(',')" :key="skillItem" class="skill-tag">{{ skillItem }}</div>
          </div>
          <div class="resume-work-content">
            <span class="resume-work-title">内容：</span>
            <div class="flex-1">{{ item.descr }}</div>
          </div>
        </template>
        <div v-if="mouseOverDom === 'editProject' + index && editDom !== 'editProject' + index" class="edit-container">
          <div
            class="flex aic"
            @click="
              handleEditWork('editProject' + index, 'projectRef' + index, {
                ...item,
                pos: parseFloat(item.pos),
                startDate_endDate: [item.startDate, item.endDate]
              })
            "
          >
            <el-icon class="mr-6"><EditPen /></el-icon>
            {{ $t('编辑') }}
          </div>
          <div class="flex aic ml-12" @click="handleDeleteProject(item?.id)">
            <el-icon class="mr-6"><Delete /></el-icon>
            {{ $t('删除') }}
          </div>
        </div>
      </div>

      <!-- 教育经历 -->
      <div class="resume-title">
        <div class="aic flex">
          <div class="resume-line" />
          教育经历
        </div>
      </div>
      <div
        :class="['resume-educ', editDom === 'education' && 'active-bg']"
        @mouseenter="handleMouseOver('education')"
        @mouseleave="handleMouseLeave"
      >
        <template v-if="editDom === 'education'">
          <custom-form
            ref="educationRef"
            :form="educationForm"
            :loading="loading"
            @submit="handleUpdateEducation"
            @cancel="editDom = ''"
          />
        </template>
        <template v-else>
          <div class="resume-educ-name">
            <div class="name">{{ resume?.school || '-' }}</div>
            <div v-if="resume?.schoolStartDate" class="time">
              {{ dayjs(resume?.schoolStartDate).format('YYYY') }} - {{ dayjs(resume?.schoolEndDate).format('YYYY') }}
            </div>
          </div>
          <div class="resume-educ-type">
            <div class="mr-40">{{ resume?.major }}</div>
            <dict-tag :options="sys_education" :value="resume?.educationLevel" />
          </div>
          <div class="resume-work-content">
            <span class="resume-work-title">内容：</span>
            <div class="flex-1">{{ resume.schoolExperience }}</div>
          </div>
          <div
            v-if="mouseOverDom === 'education' && editDom !== 'education'"
            class="edit-container"
            @click="
              handleEdit('education', 'educationRef', {
                schoolStartDate_schoolEndDate: [resume?.schoolStartDate, resume?.schoolEndDate],
                school: resume?.school,
                educationLevel: resume?.educationLevel,
                major: resume?.major,
                schoolExperience: resume?.schoolExperience,
                educationType: resume?.educationType
              })
            "
          >
            <el-icon class="mr-6"><EditPen /></el-icon>
            {{ $t('编辑') }}
          </div>
        </template>
      </div>

      <!-- 附件管理 -->
      <template v-if="!isProd">
        <div class="resume-title" @mouseover="handleMouseOver('addFile')" @mouseleave="handleMouseLeave">
          <div class="aic flex">
            <div class="resume-line" />
            附件管理
          </div>
          <div v-if="mouseOverDom === 'addFile'" class="add-container" @click="handleUploadFile()">
            <el-icon class="mr-6"><CirclePlus /></el-icon>
            添加附件
          </div>
        </div>
        <div class="file-box">
          <div
            v-for="(item, index) in resume?.attachment"
            :key="index"
            class="file-item cursor-pointer"
            @click="handlePreviewFile(item)"
          >
            <img src="../../assets/images/pdf.png" class="icon-file" />
            <div class="file-name line-1">{{ handleFormatFileName(item) }}</div>
            <div @click.stop="">
              <el-dropdown trigger="click" size="small">
                <el-icon><MoreFilled /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleDeleteFile(index)">{{ $t('删除') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  addResumeProject,
  addResumeWork,
  deleteResumeProject,
  deleteResumeWork,
  resumeInfo,
  updateResume,
  updateResumeAttachment,
  updateResumeProject,
  updateResumeWork
} from '@/api/resume'
import CustomForm from '@/components/CustomForm/index.vue'
import useUserStore from '@/store/modules/user'
import dayjs from 'dayjs'
import { computed, getCurrentInstance, nextTick, ref } from 'vue'
import { advantageInfoForm, baseInfoForm, projectInfoForm, workInfoForm, educationInfoForm } from './data/resumeForm'
import { t } from 'i18next'
// import { listTreeProjectJobCategory } from '@/api/project/postCategory'
import { handleFormatSelect } from '@/utils/array'
import { watch } from 'vue'
import { onMounted } from 'vue'
import { engineerDetail } from '@/api/engineer'
import { getToken } from '@/utils/auth'

const { proxy }: any = getCurrentInstance()
const { sys_education } = proxy.useDict('sys_education')
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + 'file/upload' // 上传文件服务器地址
const isProd = import.meta.env.VITE_APP_ENV === 'production'
const props = defineProps({
  customerId: {
    type: String,
    default: ''
  },
  canEdit: {
    type: Boolean,
    default: true
  }
})
let resume = ref<any>({})
let allJobList: {
  label: string
  value: string
}[] = []

/** 获取简历信息 */
const userStore: any = useUserStore()
const getResumeInfo = async (id = '') => {
  // 获取用户简历信息
  if (id) {
    const { data }: any = await engineerDetail(id)
    resume.value = {
      ...data?.resume,
      attachment: (data?.resume?.attachment && data?.resume?.attachment?.split(',')) || [],
      nickName: data?.name,
      avatar: data?.avatar
    }
    return
  }

  // 获取我的简历
  const { data }: any = await resumeInfo()
  resume.value = {
    ...data,
    attachment: (data?.attachment && data?.attachment?.split(',')) || [],
    nickName: userStore?.userInfo?.user?.currCustInfo?.name,
    avatar: userStore?.userInfo?.user?.currCustInfo?.avatar
  }
}
watch(
  () => props.customerId,
  val => {
    if (!val) {
      return
    }
    getResumeInfo(val)
  },
  { immediate: true, deep: true }
)
/** 获取所有岗位信息 */
const handleGetJobList = async () => {
  // const { data }: any = await listTreeProjectJobCategory()
  const newList = handleFormatSelect([])
  handleMergeList(newList)
}
/** 合并最后一级岗位数据 */
const handleMergeList = list => {
  list.forEach(item => {
    if (item?.children?.length) {
      handleMergeList(item.children)
    } else {
      allJobList.push(item)
    }
  })
}

const handleFormatJob = value => {
  return allJobList.find(item => parseFloat(item.value) === parseFloat(value))?.label || '-'
}
/** 可以编辑的情况下初始化数据 */
onMounted(() => {
  if (props.canEdit) {
    getResumeInfo()
    handleGetJobList()
  }
})

/** 鼠标移入 */
const handleMouseOver = (type: string) => {
  if (!props.canEdit) {
    return
  }
  mouseOverDom.value = type
}

/** 鼠标移出 */
const handleMouseLeave = () => {
  mouseOverDom.value = ''
}

/** 点击编辑  */
let mouseOverDom = ref('')
let editDom = ref('')
let baseForm = ref(baseInfoForm)
let advantageForm = ref(advantageInfoForm)
let workForm = ref(workInfoForm)
let projectForm = ref(projectInfoForm)
let educationForm = computed(() => {
  return educationInfoForm(sys_education)
})
const handleEdit = (type, ref = '', formValue = {}) => {
  editDom.value = type
  if (ref) {
    nextTick(() => {
      proxy.$refs[ref]?.setFormValue(formValue)
    })
  }
}
/** 更新我的简历信息 */
let loading = ref<boolean>(false)
const handleUpdate = async value => {
  if (loading.value) return
  loading.value = true
  try {
    await updateResume({
      ...resume.value,
      ...value,
      attachment: resume.value?.attachment?.join(',')
    })
    proxy.$message.success('更新成功')
    editDom.value = ''
    mouseOverDom.value = ''
    getResumeInfo()
  } finally {
    loading.value = false
  }
}

/** 更新教育经历 */
const handleUpdateEducation = async value => {
  if (loading.value) return
  loading.value = true
  try {
    const formValue = {
      ...value,
      schoolStartDate: dayjs(value.schoolStartDate_schoolEndDate[0] || '').format('YYYY-MM-DD'),
      schoolEndDate: dayjs(value.schoolStartDate_schoolEndDate[1] || '').format('YYYY-MM-DD')
    }
    delete formValue.schoolStartDate_schoolEndDate
    await updateResume(formValue)
    proxy.$message.success('更新成功')
    editDom.value = ''
    mouseOverDom.value = ''
    getResumeInfo()
  } finally {
    loading.value = false
  }
}
const handleEditWork = (type, ref = '', formValue = {}) => {
  editDom.value = type
  if (ref) {
    nextTick(() => {
      proxy.$refs[ref]?.[0]?.setFormValue(formValue)
    })
  }
}
const handleAddWork = async (value, type = 'add') => {
  if (loading.value) return
  loading.value = true
  let query = {
    ...value,
    posId: value.posId[value.posId.length - 1]?.value,
    pos: value.posId[value.posId.length - 1]?.label,
    skills: value.skills?.join(','),
    startDate: dayjs(value.startDate_endDate[0] || '').format('YYYY-MM-DD'),
    endDate: dayjs(value.startDate_endDate[1] || '').format('YYYY-MM-DD')
  }
  delete query.startDate_endDate
  try {
    if (type === 'add') {
      await addResumeWork(query)
      proxy.$message.success('添加成功')
    } else if (type === 'edit') {
      await updateResumeWork(query)
      proxy.$message.success('更新成功')
    }
    editDom.value = ''
    mouseOverDom.value = ''
    getResumeInfo()
  } finally {
    loading.value = false
  }
}
/** 删除工作经历 */
const handleDeleteWork = async (id: string) => {
  await proxy.$modal.confirm(t('确定删除该项工作经历吗?'))
  await deleteResumeWork(id)
  proxy.$message.success('删除成功')
  editDom.value = ''
  mouseOverDom.value = ''
  getResumeInfo()
}

const handleAddProject = async (value, type = 'add') => {
  if (loading.value) return
  loading.value = true
  let query = {
    ...value,
    pos: value.pos[value.pos.length - 1]?.value,
    startDate: dayjs(value.startDate_endDate[0] || '').format('YYYY-MM-DD'),
    endDate: dayjs(value.startDate_endDate[1] || '').format('YYYY-MM-DD')
  }
  delete query.startDate_endDate
  try {
    if (type === 'add') {
      await addResumeProject(query)
      proxy.$message.success('添加成功')
    } else if (type === 'edit') {
      await updateResumeProject(query)
      proxy.$message.success('更新成功')
    }
    editDom.value = ''
    mouseOverDom.value = ''
    getResumeInfo()
  } finally {
    loading.value = false
  }
}
/** 删除项目经历 */
const handleDeleteProject = async (id: string) => {
  await proxy.$modal.confirm(t('确定删除该项项目经历吗?'))
  await deleteResumeProject(id)
  proxy.$message.success('删除成功')
  editDom.value = ''
  mouseOverDom.value = ''
  getResumeInfo()
}

/** 点击上传附件 */
const handleUploadFile = () => {
  let filetype = '.pdf' //限制文件的上传类型,需要什么就添加什么的后缀
  let inputElem: any = document.createElement('input') as HTMLElement //创建文件选择
  inputElem.setAttribute('type', 'file')
  inputElem.setAttribute('accept', filetype)
  inputElem.click()
  inputElem.onchange = () => {
    let file = inputElem.files[0] //获取文件信息
    // 校检文件大小
    if (file.size / 1024 / 1024 > 20) {
      return proxy.$modal.msgError('文件大小不能超过20MB')
    }
    const formData = new FormData()
    formData.append('file', file)
    fetch(uploadFileUrl, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: getToken() // 如果需要认证
      }
    })
      .then(response => response.json())
      .then(async data => {
        if (data.code === 200) {
          resume.value.attachment.push(data?.data?.fileUrl || '')
          // 设置简历附件信息
          const attachment = resume.value.attachment?.join(',')
          await updateResumeAttachment({
            attachment
          })
          proxy.$modal.msgSuccess('上传成功')
          getResumeInfo() // 刷新个人简历
        } else {
          proxy.$modal.msgError(`${data.msg}`)
        }
      })
      .catch(error => {
        console.log('报错==>', error)
        proxy.$modal.msgError(`${error?.message || '上传失败'}`)
      })
  }
}

/** 格式化文件名称 */
const handleFormatFileName = fileUrl => {
  const fileName = fileUrl.split('/').pop()
  return fileName.split('.')[0]
}
/** 预览文件 */
const handlePreviewFile = url => {
  window.open(url, '_blank')
}
/** 删除文件 */
const handleDeleteFile = async index => {
  await proxy.$modal.confirm(t('确定删除该项附件吗?'))
  resume.value.attachment.splice(index, 1)
  await updateResumeAttachment({
    attachment: resume.value.attachment?.join(',')
  })
  proxy.$message.success('删除成功')
  getResumeInfo() // 设置简历附件信息
}
</script>

<style lang="scss" scoped>
.user-container {
  position: relative;
  border-radius: 10px;
  min-height: calc(100vh - 130px);
  background-color: #fff;
  padding: 30px 40px 30px 30px;
  overflow: hidden;
  font-size: 14px;
  .title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    padding: 0 40px;
    font-size: 14px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f3e5ff;
  }
}
.resume-container {
  margin-top: 40px;
  color: #333;
  .resume-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    padding-left: 10px;
    margin-top: 20px;
    .resume-line {
      width: 4px;
      height: 17px;
      background-color: var(--text-color-theme);
      border-radius: 10px;
      margin-right: 10px;
    }
  }
  .resume-user-info {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .add-container {
    color: var(--text-color-theme);
    cursor: pointer;
    height: 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .edit-container {
    position: absolute;
    top: 10px;
    right: 10px;
    color: var(--text-color-theme);
    cursor: pointer;
    height: 20px;
    display: flex;
    align-items: center;
    background-color: #f8f8f8;
    padding: 0 20px;
  }
  .resume-user-name {
    position: relative;
    flex: 1;
    color: #666;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
      background-color: #f8f8f8;
    }
    .name {
      font-size: 24px;
      font-weight: 700;
      color: #333;
    }
    .icon-resume {
      width: 20px;
      margin-right: 6px;
    }
  }
  .avatar-box {
    width: 80px;
    height: 80px;
    border-radius: 40px;
    cursor: pointer;
    margin-left: 100px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .resume-advantage {
    position: relative;
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
      background-color: #f8f8f8;
    }
  }
  .resume-work-item {
    position: relative;
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
      background-color: #f8f8f8;
    }
    .resume-work-company {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
    }
    .resume-work-time {
      font-size: 12px;
      color: #666;
    }
    .skill-tag {
      display: inline-block;
      padding: 2px 8px;
      margin-right: 8px;
      margin-bottom: 8px;
      margin-top: 18px;
      font-size: 14px;
      color: #444;
      line-height: 20px;
      background: rgb(0 0 0 / 4%);
      border-radius: 4px;
    }
  }
  .resume-educ {
    position: relative;
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
      background-color: #f8f8f8;
    }
  }
  .resume-educ-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    .time {
      font-size: 12px;
      color: #666;
    }
  }
  .resume-educ-type {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
    margin-top: 10px;
  }
}
.resume-work-content {
  display: flex;
  margin-top: 10px;
  .resume-work-title {
    font-weight: 600;
    color: #222;
    width: 50px;
  }
}
.active-bg {
  background-color: #f8f8f8;
}
.file-box {
  padding: 0 10px;
}
.file-item {
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
  margin-top: 16px;
  padding: 16px 10px;
  .icon-file {
    width: 40px;
    height: 40px;
  }
  .file-name {
    max-width: 200px;
    margin-left: 4px;
    margin-right: 16px;
  }
}
</style>
