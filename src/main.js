//引入cookies
import VueCookies from 'vue-cookies'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/base.scss'
//图标 图标在附件中
import '@/assets/icon/iconfont.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//引入vuex进行状态管理
import store from './store'


//1.1、引入Dialog组件
import Dialog from "@/components/Dialog.vue"
import Avatar from "@/components/Avatar.vue"
import Cover from "@/components/Cover.vue"
import DataList from "@/components/DataList.vue"
import NoData from "@/components/NoData.vue"
import ImageViewer from "@/components/ImageViewer.vue"
import EditorHtml from "@/components/EditorHtml.vue"
import EditorMarkDown from "@/components/EditorMarkDown.vue"
import CoverUpload from "@/components/CoverUpload.vue"
import AttachmentSelector from "@/components/AttachmentSelector.vue"


const app = createApp(App)
//引入全局方法
import Verify from './utils/Verify'
import Message from './utils/Message'
import Request from './utils/Request'
import Utils from './utils/Utils'
import Confirm from './utils/Confirm'



app.use(router)
app.use(store)
app.use(ElementPlus);
//定义全局VueCookies
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.globalInfo = {  //定义全局变量，以后想要定义全局变量，都得定义在globalProperties之后，然后用{proxy}=this，取到
    bodyWidth:1300,
    avatarUrl:"/api/file/getAvatar/",
    imageUrl:"/api/file/getImage/"
}
//引入全局方法，校验
app.config.globalProperties.Verify = Verify
//引入全局方法，消息提示
app.config.globalProperties.Message = Message
//引入全局方法，用于发送ajax请求
app.config.globalProperties.Request = Request
//引入全局方法，用于数据转换
app.config.globalProperties.Utils = Utils
//引入全局方法，展示消息弹出框
app.config.globalProperties.Confirm = Confirm

//1.2、将Dialog定义为全局组件
app.component('Dialog',Dialog)  //名称，组件
app.component('Avatar',Avatar)  //名称，组件
app.component('Cover',Cover)  //名称，组件
app.component('DataList',DataList)  //名称，组件
app.component('NoData',NoData)  //名称，组件
app.component('ImageViewer',ImageViewer)  //名称，组件
app.component('EditorHtml',EditorHtml)  //名称，组件
app.component('EditorMarkDown',EditorMarkDown)  //名称，组件
app.component('CoverUpload',CoverUpload)  //名称，组件
app.component('AttachmentSelector',AttachmentSelector)  //名称，组件


app.mount('#app')
