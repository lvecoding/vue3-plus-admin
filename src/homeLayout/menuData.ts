export const menuList = [
  {
    label: '个人中心',
    path: '/customer/user',
    subMenuList: [
      { label: '基本信息', path: '/customer/user' },
      { label: '我的收藏', path: '/customer/user/collect', hidden: import.meta.env.VITE_APP_ENV === 'production' },
      { label: '我的评论', path: '/customer/user/comment', hidden: import.meta.env.VITE_APP_ENV === 'production' },
      { label: '我的关注', path: '/customer/user/follow', hidden: import.meta.env.VITE_APP_ENV === 'production' },
      { label: '我的反馈', path: '/customer/user/feedback' },
      { label: '通知中心', path: '/customer/user/notify' },
      { label: '我的简历', path: '/customer/user/resume', roles: ['ENTREPRENEUR', 'ENGINEER'] },
      { label: '我的项目', path: '/customer/user/project', roles: ['ENTREPRENEUR'] }
    ]
  }
]
