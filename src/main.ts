import { createApp } from 'vue'
import Cookies from 'js-cookie'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import locale from 'element-plus/dist/locale/zh-cn.mjs'

import '@/assets/styles/index.scss' // global css
import '@/assets/fonts/font.scss'
import 'animate.css'
import 'amfe-flexible'
import './utils/rem'
import AOS from 'aos'
import 'aos/dist/aos.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* aos动画初始化 */
AOS.init({
  duration: 0.7 * 1000
})
// 注册gsap滚动东海
gsap.registerPlugin(ScrollTrigger)

import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import zh_cn from '@/config/locale/zh/cn'
import en_us from '@/config/locale/en/us'

import App from './App.vue'
import store from './store'
import router from './router'
import directive from './directive' // directive
import component from '@/components/index'

// 注册指令
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

// svg图标
import 'virtual:svg-icons-register'
import elementIcons from '@/components/SvgIcon/svgicon'
import './permission' // permission control
import { useDict } from '@/utils/dict'
import { parseTime, resetForm, addDateRange } from '@/utils/tool'
import { Dialog, Toast } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

// 全局方法挂载
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.gsap = gsap
app.config.globalProperties.ScrollTrigger = ScrollTrigger
app.config.globalProperties.AOS = AOS
app.config.globalProperties.addDateRange = addDateRange

i18next.init({
  fallbackLng: Cookies.get('language'),
  resources: { 'zh-CN': zh_cn, 'en-US': en_us }
})

app.use(component).use(I18NextVue, { i18next }).use(elementIcons).use(plugins).use(store).use(router).use(Dialog).use(Toast)

directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  size: Cookies.get('size') || 'default',
  locale
})
app.mount('#app')
