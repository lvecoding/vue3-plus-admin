import { login, logout, getInfo, smsLogin, customerLogin } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from '@/utils/validate'
import defAva from '@/assets/images/profile.jpg'
import { defineStore } from 'pinia'
import { ElMessageBox } from 'element-plus'
import { t } from 'i18next'
import useAppStore from '@/store/modules/app'

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    roles: <string[]>[],
    permissions: [],
    userInfo: null
  }),
  actions: {
    // 登录
    login(userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        setToken('e84a68e2599b4bccb32af28ca7b727ed')
        this.token = 'e84a68e2599b4bccb32af28ca7b727ed'
        resolve(true)
        // login(username, password, code, uuid)
        //   .then(res => {
        //     setToken(res.token)
        //     this.token = res.token
        //     resolve(true)
        //   })
        //   .catch(error => {
        //     reject(error)
        //   })
      })
    },
    /** 客户账号密码登录 */
    customerLoginByPassword(loginInfo) {
      loginInfo.username = loginInfo.username.trim()
      return new Promise((resolve, reject) => {
        customerLogin(loginInfo)
          .then(res => {
            setToken(res.token)
            this.token = res.token
            resolve(true)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /** 手机短信登录 */
    loginByMobile(loginInfo) {
      return new Promise((resolve, reject) => {
        smsLogin(loginInfo)
          .then(res => {
            setToken(res.token)
            this.token = res.token
            resolve(true)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            const user = res.user
            let avatar = user.avatar || ''
            if (!isHttp(avatar)) {
              avatar = isEmpty(avatar) ? defAva : import.meta.env.VITE_APP_BASE_API + avatar
            }
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.id = user.userId
            this.name = user.userName
            this.avatar = avatar
            this.userInfo = res
            localStorage.setItem('userInfo', JSON.stringify(res?.user))
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = ''
            this.userInfo = null
            this.roles = []
            this.permissions = []
            removeToken()
            resolve(true)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 退出登录
    async handleLogout() {
      await ElMessageBox.confirm(t('确定退出登录吗？'), t('系统提示'), {
        confirmButtonText: t('确定'),
        cancelButtonText: t('取消'),
        type: 'warning'
      })

      await this.logOut()
      // window.location.reload()
      let path = '/customer/login'
      location.href = path
    },
    // 重新登录系统
    handleLogin(redirectPath = '/home') {
      let userInfo = localStorage.getItem('userInfo')
      userInfo = userInfo && JSON.parse(userInfo)
      let path = '/customer/login'
      path = path + '?redirect=' + redirectPath
      if (!userInfo?.currCustInfo && userInfo) {
        //admin后台管理登录
        path = '/login'
      }
      localStorage.removeItem('userInfo') // 每次重新登陆清空缓存的用户数据
      location.href = path
    },
    // 返回首页
    handleHome() {
      let userInfo = localStorage.getItem('userInfo')
      userInfo = userInfo && JSON.parse(userInfo)
      let path = '/home'
      if (!userInfo?.currCustInfo && userInfo) {
        path = '/login'
      }
      localStorage.removeItem('userInfo') // 每次重新登陆清空缓存的用户数据
      location.href = path
      useAppStore().setShowHomeAnimation(false)
    }
  }
})

export default useUserStore
