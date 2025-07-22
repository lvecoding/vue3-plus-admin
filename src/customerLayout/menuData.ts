import { getAssetsFile } from '@/utils/image'

export const menuList = [
  { label: '工作台', path: '/customer/workbench' },
  {
    label: '项目协作',
    path: '/customer/project'
  },
  // 项目详情
  {
    label: '首页',
    path: '/customer/project',
    subMenuList: [
      { label: '概览', path: '/customer/project/overview', icon: getAssetsFile('icon/icon-trend.svg') },
      { label: '需求', path: '/customer/project/reqBoard', icon: getAssetsFile('icon/icon-demand.svg') },
      { label: '任务', path: '/customer/project/taskBoard', icon: getAssetsFile('icon/icon-task.svg') },
      { label: '缺陷', path: '/customer/project/bugBoard', icon: getAssetsFile('icon/icon-bug.svg') },
      { label: '迭代', path: '/customer/project/iterationBoard', icon: getAssetsFile('icon/icon-iterate.svg') },
      { label: '里程碑', path: '/customer/project/milestone', icon: getAssetsFile('icon/icon-milestone.svg') },
      { label: '风险', path: '/customer/project/riskBoard', icon: getAssetsFile('icon/icon-risk.svg') }
    ]
  },
  {
    label: '工程师管理',
    path: '/customer/engineer/search',
    subMenuList: [
      { label: '搜索工程师', path: '/customer/engineer/search', icon: getAssetsFile('icon/icon-search.png') },
      { label: '我的工程师', path: '/customer/engineer/mine', icon: getAssetsFile('icon/icon-engineer.svg') },
      { label: '工程师沟通', path: '/customer/engineer/communicate', icon: getAssetsFile('icon/icon-communicate.svg') },
      { label: '职位管理', path: '/customer/engineer/add', icon: getAssetsFile('icon/icon-post.svg') }
    ]
  },
  // {
  //   label: '投资人管理',
  //   id: 'investorManagement',
  //   roles: ['ENTREPRENEUR'],
  //   subMenuList: [
  //     { label: '搜索投资人', path: '/customer/investor/search' },
  //     { label: '我的投资人', path: '/customer/investor/mine' },
  //     { label: '沟通', path: '' }
  //   ]
  // },
  {
    label: '供应商管理',
    path: '/customer/supplier/search'
    // subMenuList: [
    //   { label: '搜索供应商', path: '/customer/supplier/search' }
    //   // { label: '我的供应商', path: '/customer/supplier/mine' },
    //   // { label: '供应商沟通', path: '/customer/supplier/communication' },
    //   // { label: '我的询价', path: '/customer/supplier/inquiry' }
    // ]
  },
  {
    label: '合同管理',
    path: '/customer/contract'
  },
  {
    label: '结算管理',
    path: '/customer/settlementManagement/capitalDetail',
    subMenuList: [
      { label: '资金明细', path: '/customer/settlementManagement/capitalDetail' },
      { label: '提现记录', path: '/customer/settlementManagement/withdrawal' },
      { label: '采购管理', path: '/customer/settlementManagement/procurement', roles: ['ENTREPRENEUR', 'INVESTOR'] }
    ]
  },
  {
    label: '知识库管理',
    path: '/customer/knowledge/overview',
    subMenuList: [
      { label: '最近', path: '/customer/knowledge/overview' },
      { label: '我的收藏', path: '/customer/knowledge/favorite' },
      { label: '我的共享', path: '/customer/knowledge/share' },
      { label: '知识库', path: '/customer/knowledge/list' },
      { label: '知识库详情', path: '/customer/knowledge/detail', hidden: true }
    ]
  }
]
