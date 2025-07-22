import request from '@/utils/request'

// 我的简历
export const resumeInfo = () => {
  return request({
    url: '/resume/get',
    method: 'get'
  })
}

// 更新我的简历
export const updateResume = data => {
  return request({
    url: '/resume/update',
    method: 'post',
    data
  })
}

// 新增工作经历
export const addResumeWork = data => {
  return request({
    url: '/resume_work/save',
    method: 'post',
    data
  })
}
// 删除工作经历
export const deleteResumeWork = id => {
  return request({
    url: `/resume_work/remove/${id}`,
    method: 'delete'
  })
}

// 修改工作经历
export const updateResumeWork = data => {
  return request({
    url: '/resume_work/update',
    method: 'post',
    data
  })
}

// 新增工作经历
export const addResumeProject = data => {
  return request({
    url: '/resume_project/save',
    method: 'post',
    data
  })
}
// 删除工作经历
export const deleteResumeProject = id => {
  return request({
    url: `/resume_project/remove/${id}`,
    method: 'delete'
  })
}

// 修改工作经历
export const updateResumeProject = data => {
  return request({
    url: '/resume_project/update',
    method: 'post',
    data
  })
}

// 修改简历附件
export const updateResumeAttachment = data => {
  return request({
    url: '/resume/update_attachment',
    method: 'post',
    data
  })
}
