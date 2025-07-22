import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp, isPathMatch } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'
import useAppStore from '@/store/modules/app'
import { t } from 'i18next'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/register', '/', '/index']

const isWhiteList = path => {
  return whiteList.some(pattern => isPathMatch(pattern, path))
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title)
    /* has token*/
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else if (isWhiteList(to.path)) {
      usePermissionStore()
        .generateRoutes()
        .then(accessRoutes => {
          // 根据roles权限生成可访问的路由表
          accessRoutes.forEach(route => {
            if (!isHttp(route.path)) {
              router.addRoute(route) // 动态添加可访问路由表
            }
          })
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        })
      next()
    } else {
      next()
      // if (useUserStore().roles.length === 0) {
      //   isRelogin.show = true
      //   // 判断当前用户是否已拉取完user_info信息
      //   useUserStore()
      //     .getInfo()
      //     .then(() => {
      //       isRelogin.show = false
      //       usePermissionStore()
      //         .generateRoutes()
      //         .then(accessRoutes => {
      //           // 根据roles权限生成可访问的路由表
      //           accessRoutes.forEach(route => {
      //             if (!isHttp(route.path)) {
      //               router.addRoute(route) // 动态添加可访问路由表
      //             }
      //           })
      //           next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
      //         })
      //     })
      //     .catch(async err => {
      //       await useUserStore().logOut()
      //       ElMessage.error(err)
      //       useUserStore().handleLogin()
      //     })
      // } else {
      //   const currRole = useUserStore().userInfo?.user?.currCustInfo?.custType
      //   const routeRoles: any = to.meta.roles || []
      //   if (to.meta.roles) {
      //     if (routeRoles.includes(currRole)) {
      //       next()
      //     } else {
      //       ElMessage.error(t('您没有权限访问此页面'))
      //       next({ path: '/home' })
      //       NProgress.done()
      //     }
      //   } else {
      //     next()
      //   }
      // }
    }
  } else {
    // 没有token
    if (isWhiteList(to.path)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      useUserStore()?.handleLogin(to.fullPath) // 根据不同的用户角色判断跳转
      NProgress.done()
    }
  }
  //只有首页刷新才显示动画
  if (!['/home', '/'].includes(to.path)) {
    console.log(to.path, 'beforeEach>>>>')
    useAppStore().setShowHomeAnimation(false)
  }
})
router.afterEach(() => {
  NProgress.done()
})
