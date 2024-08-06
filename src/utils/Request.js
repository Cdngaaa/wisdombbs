//请求服务器的js文件，ajax请求
import axios from "axios";

//请求间隙间的loading效果
import { ElLoading } from "element-plus";

//将自定义的Message导入进来
import Message from '@/utils/Message'
import store from "@/store";

//发送ajax请求的两种形式：form表单和json
const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json"

const instance = axios.create({
    baseURL:"/api",//接口文档不是从/api开始，但是实际请求需要从api开始，所以baseUrl写成/api
    timeout:60*1000,//发送http请求的超时时间
})
//loading的对象，用于使用对象身上的close方法
let loading = null;
//发送ajax请求过滤器，有两个方法
instance.interceptors.request.use(
    (config)=>{ 
        if(config.showLoading){
            loading = ElLoading.service({ //使用ElememntPlus的loading效果，展示加载中
                lock:true,
                text:"加载中......",
                background:"rgba(0,0,0,0.7)",
            })
        }
        return config;
    },(error)=>{
        if(error.config.showLoading && loading){
            loading.close();
        }
        Message.error("请求发送失败")//使用自定义的Message
        return Promise.reject("请求发送失败")
    }
);
//发送ajax响应过滤器
instance.interceptors.response.use(
    (response) => {
        //展示loading；请求失败的回调，是一个函数，可以进行一些操作，例如更新验证码；
        //是否展示错误信息，有时候不需要展示错误信息
        const {showLoading,errorCallback,showError} = response.config;
        if(showLoading && loading){
            loading.close();
        }
        const responseData = response.data;
        if(responseData.code == 200){
            return responseData;
        }else if (responseData.code == 901 ){
            // 当用户没有登录的情况下操作点赞事件，后端会返回901
            // 所以是否登录后端会进行判断，并返回不同的code值
            store.commit("showLogin",true);
            store.commit('updateLoginUserInfo',null);   //如果太久没有操作，后端将session设为失效，并返回901给前端
            return Promise.reject({showError:false,msg:"登录超时"});
        }else{
            if(errorCallback){  //如果传过来errorcallback，就调用errorcallback
                errorCallback(responseData)
            }
            return Promise.reject({showError:showError,msg:responseData.info});
        }
    },(error) => {
        if(error.config.showLoading && loading){
            loading.close();
        }
        return Promise.reject({showError:true,msg:"网络异常"});
    }
);

const request = (config) => {
    const {url,params,dataType,showLoading=true,errorCallback,showError = true} = config //这些配置会在发送请求的时候发送到服务器端

    let contentType = contentTypeForm//默认请求类型是表单类型
    let formData = new FormData();

    for(let key in params){
        formData.append(key,params[key] == undefined ? "" :params[key] )    //也适用于文件上传
    }
    if(dataType != null && dataType=="json"){
        contentType = contentTypeJson;//如果是json，就转为json类型
    }
    let headers = {
        'Content-Type':contentType,
        'X-Requested-With':'XMLHttpRequest',
    }
    return instance.post(url,formData,{ //全部走的是post请求,谁调用了这个函数，就把结果返回到调用这个函数的位置去
        headers:headers,
        showLoading:showLoading,
        errorCallback:errorCallback,
        showError:showError,
    }).catch(error => {
        if(error.showError){
            Message.error(error.msg);
        }
        return null;
    })

}

export default request;