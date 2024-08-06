//定义正则表达式匹配规则并在main.js（全局）中引入
const regs = {
    email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    number:/^([0]|[1-9][0-9]*)$/,
    password:/^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,18}$/,
}
const verify = (rule,value,reg,callback) => {   //rule是一个对象，使用rule.message得到输入的message
    if(value){
        if(reg.test(value)){    //如果满足，则callback（）
            callback()
        }else{
            callback(new Error(rule.message))
        }
    }else {
        callback()
    }
}

export default {
    email:(rule,value,callback) => {
        return verify(rule,value,regs.email,callback)
    },
    number:(rule,value,callback) => {
        return verify(rule,value,regs.number,callback)
    },
    password:(rule,value,callback) => {
        return verify(rule,value,regs.password,callback)
    },
}