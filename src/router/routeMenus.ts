export const menuData = [
  {
    name: 'System',
    path: '/system',
    hidden: false,
    redirect: 'noRedirect',
    component: 'Layout',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'system',
      noCache: false,
      link: null
    },
    children: [
      {
        name: 'User',
        path: 'user',
        hidden: false,
        component: 'system/user/index',
        meta: {
          title: '用户管理',
          icon: 'user',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Role',
        path: 'role',
        hidden: false,
        component: 'system/role/index',
        meta: {
          title: '角色管理',
          icon: 'peoples',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Menu',
        path: 'menu',
        hidden: false,
        component: 'system/menu/index',
        meta: {
          title: '菜单管理',
          icon: 'tree-table',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Dept',
        path: 'dept',
        hidden: false,
        component: 'system/dept/index',
        meta: {
          title: '部门管理',
          icon: 'tree',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Sysempost',
        path: 'post',
        hidden: false,
        component: 'system/post/index',
        meta: {
          title: '岗位管理',
          icon: 'post',
          noCache: false,
          link: null
        }
      }
    ]
  },
  {
    name: 'FormComp',
    path: '/form',
    hidden: false,
    redirect: 'noRedirect',
    component: 'Layout',
    alwaysShow: true,
    meta: {
      title: '表单组件',
      icon: 'system',
      noCache: false,
      link: null
    },
    children: [
      {
        name: 'From',
        path: 'form',
        hidden: false,
        component: 'components/form/index',
        meta: {
          title: '表单组件',
          icon: 'user',
          noCache: false,
          link: null
        }
      }
    ]
  }
]
