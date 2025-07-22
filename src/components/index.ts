// 分页组件
import Pagination from '@/components/Pagination/index.vue'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar/index.vue'
// 富文本组件
import Editor from '@/components/Editor/index.vue'
// 文件上传组件
import FileUpload from '@/components/FileUpload/index.vue'
// 图片上传组件
import ImageUpload from '@/components/ImageUpload/index.vue'
// 图片预览组件
import ImagePreview from '@/components/ImagePreview/index.vue'
// 字典标签组件
import DictTag from '@/components/DictTag/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import SalarySelect from '@/components/SalarySelect/index.vue'
import VideoPreview from '@/components/VideoPreview/index.vue'
import RobotBall from '@/components/RobotBall/index.vue'
import CustomButton from '@/components/CustomButton/index.vue'
import GanttChart from '@/components/GanttChart/index.vue'
import CustomForm from '@/components/CustomForm/index.vue'
import CustomTable from '@/components/CustomTable/index.vue'
import ChatBox from '@/components/ChatBox/index.vue'
import ParentView from '@/components/ParentView/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import ResumeBox from '@/components/ResumeBox/index.vue'

export default {
  install(app) {
    app.component('DictTag', DictTag)
    app.component('Pagination', Pagination)
    app.component('FileUpload', FileUpload)
    app.component('ImageUpload', ImageUpload)
    app.component('ImagePreview', ImagePreview)
    app.component('RightToolbar', RightToolbar)
    app.component('Editor', Editor)
    app.component('SvgIcon', SvgIcon)
    app.component('SalarySelect', SalarySelect)
    app.component('VideoPreview', VideoPreview)
    app.component('RobotBall', RobotBall)
    app.component('CustomButton', CustomButton)
    app.component('GanttChart', GanttChart)
    app.component('CustomForm', CustomForm)
    app.component('CustomTable', CustomTable)
    app.component('ChatBox', ChatBox)
    app.component('ParentView', ParentView)
    app.component('Hamburger', Hamburger)
    app.component('Breadcrumb', Breadcrumb)
    app.component('ResumeBox', ResumeBox)
  }
}
