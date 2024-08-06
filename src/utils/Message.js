//请求错误信息的封装，（提示信息）,并在main.js(全局中引入)
import { ElMessage } from "element-plus";

const showMessage = (msg,callback,type) => {
    ElMessage({
        type:type,
        message:msg,
        duration:2000,//消息提示时间
        onClose:()=>{
            if(callback){
                callback();
            }
        }
    })
}

const message = {
    error:(msg,callback) => {
        showMessage(msg,callback,"error")
    },
    success:(msg,callback) => {
        showMessage(msg,callback,"success")
    },
    warning:(msg,callback) => {
        showMessage(msg,callback,"warning")
    },
}

export default message;