<template>
  <div>
        <Dialog
            :show="dialogConfig.show"
            :title="dialogConfig.title"
            :buttons="dialogConfig.buttons"
            width="400px"
            :showCancel="false"
            @close="closeDialog">

            <el-form class="login-register" :model="formData" :rules="rules" ref="formDataRef">
                
                <!--input输入-->
                <el-form-item  prop="email" > 
                    <el-input maxlength="150" clearable placeholder="请输入邮箱" v-model.trim="formData.email" size="large">
                        <!-- template配合插槽使用 -->
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 登录时的密码（密文传输）0注册，1登录，2找回密码 -->
                <el-form-item  prop="password" v-if="opType == 1"> 
                    <el-input :type="passwordEyeType.passwordEyeOpen ? 'text' : 'password'"  placeholder="请输入密码" v-model.trim="formData.password" size="large">
                        <!-- template配合插槽使用 -->
                        <template #prefix>
                            <!-- 这个span没有内容，就是显示input框前面的图标而已 -->
                            <span class="iconfont icon-password"></span>
                        </template>
                        <template #suffix>
                            <span @click="eyeChange('passwordEyeOpen')" :class="['iconfont', passwordEyeType.passwordEyeOpen ? 'icon-eye' : 'icon-close-eye']"></span>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 注册 0注册，1登录，2找回密码 -->
                <div v-if="opType == 0 || opType == 2">
                    <el-form-item  prop="emailCode" > 
                        <div class="send-email-panel">
                            <el-input clearable placeholder="请输入邮箱验证码" v-model.trim="formData.emailCode" size="large">
                                <!-- template配合插槽使用 -->
                                <template #prefix>
                                    <!-- 这个span没有内容，就是显示input框前面的图标而已 -->
                                    <span class="iconfont icon-checkcode"></span>
                                </template>
                            </el-input>
                            <el-button @click="showSendEmailDialog" class="send-email-btn" type="primary" size="large">获取验证码</el-button>
                        </div>
                        <el-popover placement="left" :width="450" trigger="click">
                            <div>
                                <p>1、在垃圾箱中查找邮箱验证码</p>
                                <p>2、在邮箱中头像->设置->反垃圾->白名单->设置邮件地址白名单</p>
                                <p>3、将邮箱【995252141@qq.com】添加到白名单</p>
                            </div>
                            <!-- 点击未收到邮箱验证码，弹出div中的内容 -->
                            <template #reference> <span class="a-link" :style="{'font-size' : '14px'}">未收到邮箱验证码？</span> </template>
                        </el-popover>
                    </el-form-item>


                    <el-form-item  prop="nickName" v-if="opType == 0" > 
                        <el-input maxlength="20" clearable placeholder="请输入昵称" v-model.trim="formData.nickName" size="large">
                            <!-- template配合插槽使用 -->
                            <template #prefix>
                                <span class="iconfont icon-account"></span>
                            </template>
                        </el-input>
                    </el-form-item>


                    <!-- 注册时的密码（明文传输） -->
                    <el-form-item  prop="registerPassword" > 
                        <el-input :type="passwordEyeType.registerPasswordEyeOpen ? 'text' : 'password'" placeholder="请输入密码" v-model.trim="formData.registerPassword" size="large">
                            <!-- template配合插槽使用 -->
                            <template #prefix>
                                <!-- 这个span没有内容，就是显示input框前面的图标而已 -->
                                <span class="iconfont icon-password"></span>
                            </template>
                            <template #suffix>
                            <span @click="eyeChange('registerPasswordEyeOpen')" :class="['iconfont', passwordEyeType.registerPasswordEyeOpen ? 'icon-eye' : 'icon-close-eye']"></span>
                        </template>
                        </el-input>
                    </el-form-item>


                    <el-form-item  prop="reRegisterPassword" > 
                        <el-input :type="passwordEyeType.reRegisterPasswordEyeOpen ? 'text' : 'password'"  placeholder="请再次输入密码" v-model.trim="formData.reRegisterPassword" size="large">
                            <!-- template配合插槽使用 -->
                            <template #prefix>
                                <!-- 这个span没有内容，就是显示input框前面的图标而已 -->
                                <span class="iconfont icon-password"></span>
                            </template>
                            <template #suffix>
                            <span @click="eyeChange('reRegisterPasswordEyeOpen')" :class="['iconfont', passwordEyeType.reRegisterPasswordEyeOpen ? 'icon-eye' : 'icon-close-eye']"></span>
                        </template>
                        </el-input>
                    </el-form-item>
                </div>
                

                <el-form-item  prop="checkCode" > 
                    <div class="check-code-panel">
                        <el-input clearable placeholder="请输入验证码" v-model.trim="formData.checkCode" size="large" @keyup.enter="doSubmit">
                            <!-- template配合插槽使用 -->
                            <template #prefix>
                                <!-- 这个span没有内容，就是显示input框前面的图标而已 -->
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                        <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode(0)">
                    </div>
                </el-form-item>

                <!-- 登录：opType = 1，显示忘记密码、没有账号 -->
                <el-form-item v-if="opType == 1">
                    <div class="rememberme-panel">
                        <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
                    </div>
                    <div class="no-account">
                        <a href="javascript:void(0)" class="a-link" @click="showPanel(2)">忘记密码？</a>
                        <a href="javascript:void(0)" class="a-link" @click="showPanel(0)">没有账号？</a>
                    </div>
                </el-form-item>

                <!-- 注册：opType = 0，显示已有账号 -->
                <el-form-item v-if="opType == 0">
                    <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">已有账号？</a>
                </el-form-item>

                <el-form-item v-if="opType == 2">
                    <a href="javascript:void(0)" class="a-link" @click="showPanel(1)">去登录？</a>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" class="op-btn" @click="doSubmit">
                        <span v-if="opType==0">注册</span>
                        <span v-if="opType==1">登录</span>
                        <span v-if="opType==2">重置密码</span>
                    </el-button>
                </el-form-item>
                
            </el-form>
            
        </Dialog>

        <!-- 发送邮箱验证码弹窗 -->
        <Dialog
            :show="dialogConfig4SendMailCode.show"
            :title="dialogConfig4SendMailCode.title"
            :buttons="dialogConfig4SendMailCode.buttons"
            width="500px"
            :showCancel="false"
            @close="dialogConfig4SendMailCode.show = false">
            <el-form :model="formData4SendMailCode" :rules="rules" ref="formData4SendMailCodeRef">
                <el-form-item label="邮箱">
                    {{formData.email}}
                </el-form-item>
                <el-form-item label="验证码"  prop="checkCode" > 
                    <div class="check-code-panel">
                        <el-input  placeholder="请输入验证码" v-model.trim="formData4SendMailCode.checkCode" size="large">
                            <!-- template配合插槽使用 -->
                            <template #prefix>
                                <!-- 这个span没有内容，就是显示input框前面的图标而已 -->
                                <span class="iconfont icon-checkcode"></span>
                            </template>
                        </el-input>
                        <img :src="checkCodeUrl4SendMailCode" class="check-code" @click="changeCheckCode(1)">
                    </div>
                </el-form-item>
            </el-form>
        </Dialog>

  </div>
</template>

<script setup>
    import md5 from "js-md5";
    import {ref,reactive, getCurrentInstance,nextTick} from "vue";
    import { useRoute,useRouter } from "vue-router";
    import { useStore} from 'vuex'
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
    
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const api = {
        checkCode:"/api/checkCode",
        sendMailCode:"/sendEmailCode",
        register:"/register",
        login:"/login",
        resetPwd:"/resetPwd",
    }

    //0注册，1登录，2找回密码
    const opType = ref();   //定义opType这个变量
    const showPanel = (type) => {   //接收到外部传进来的type  子组件LoginAndRegister有showPanel这个函数
        opType.value = type//由外部传进来
        resetForm();
    };
    defineExpose({showPanel});  //暴露组件，应该可以用于各种组件之间的通信


    //邮箱验证码弹窗
    const dialogConfig4SendMailCode = reactive({
      show: false,
      title: "发送邮箱验证码",
      buttons:[
        {
            type:"primary",
            text:"发送邮箱验证码",
            click:()=> {
                sendEmailCode();
            }
        }
    ]
    });
    const formData4SendMailCode = ref({});
    const formData4SendMailCodeRef = ref();
    //展示获取邮箱验证码弹窗的控制事件
    const showSendEmailDialog = () => {
        formDataRef.value.validateField("email",(valid)=>{   //这是element-ui的相关内容
            //拿到formDataRef这个ref属性所对应的el-form组件，拿到里面的item项（email），进行相应的判断
            if(!valid){ //对rule中对应的规则校验email项的规则， 如果不通过，则return
                return;
            }
            dialogConfig4SendMailCode.show = true;
            nextTick(()=> {
                changeCheckCode(1);
                formData4SendMailCodeRef.value.resetFields();//重置表单
                formData4SendMailCode.value = { //formData4SendMailCode这个对象里面只有email这一个
                    email:formData.value.email
                }
            })
        })
    }

    //发送邮箱验证码到对应的邮箱
    const sendEmailCode = () => {
        formData4SendMailCodeRef.value.validate(async (valid) => {    //校验form表单中的所有项
            if(!valid){
                return
            }
            const params= Object.assign({},formData4SendMailCode.value)
            //params的type用于区分当前是找回密码还是注册（0：注册，1：找回密码）
            //因为注册要匹配当前邮箱是否注册，而找回密码要判断当前邮箱是否存在
            //所以需要params进行区分
            params.type  = opType.value == 0 ? 0 : 1;//如果是注册，则params的type也为0，否则为1，找回密码
            let result = await proxy.Request({
                url:api.sendMailCode,
                params:params,
                errorCallback:() => {
                    changeCheckCode(1);
                }
            });
            if(!result){
                return;
            }
            proxy.Message.success("验证码发送成功，请登录邮箱查看")
            dialogConfig4SendMailCode.show = false
        })
    }


    //再次输入密码规则
    const checkRePassword = (rule,value,callback) => {
        if(value !==formData.value.registerPassword){
            callback(new Error(rule.message))
        }else {
            callback();
        }
    }

    //登录注册弹窗
    const dialogConfig = reactive({
      show: false,
      title: "标题",
    });
    //登录注册form表单，校验匹配规则
    const formData = ref({});
    const formDataRef = ref();
    const rules = { //与el-form-item 的 prop中的属性相配合
      email: [
        {required: true, message: "请输入邮箱"},
        {validator:proxy.Verify.email,message:"请输入正确的邮箱"},
    ],
      password:[{required: true, message: "请输入密码"}],
      emailCode:[{required: true, message: "请输入邮箱验证码"}],
      nickName:[{required: true, message: "请输入昵称"}],
      registerPassword:[
        {required: true, message: "请输入密码"},
        {validator:proxy.Verify.password,message:"密码只能是数字、字母、特殊字符 8 -18位"},
    ],
        reRegisterPassword:[
        {required: true, message: "请再次输入密码"},
        {validator:checkRePassword,message:"两次输入的密码不一致"},
    ],
        checkCode:[{required: true, message: "请输入图片验证码"}],
    };

    //登录、注册、重置密码、提交表单
    const doSubmit = () => { 
        //elementui的form表单函数，校验所有参数,需要请求后端接口,根据rules中的规则进行校验，valid是校验结果
        formDataRef.value.validate(async (valid)=>{    
            if(!valid){
                return;
            }
            let params = {};
            Object.assign(params,formData.value);   //对象的复制，302+303这两行
            
            //注册
            if(opType.value == 0 || opType.value == 2 ){
                params.password = params.registerPassword;//接口文档需要传入的是password，不是自定义的
                delete params.reRegisterPassword;
                delete params.registerPassword;
            }
            //登录，无论是否将账号密码保存到cookie中，都会向服务器请求一次登录
            if(opType.value == 1 ){
                //如果是登录状态，需要获取以下cookies中的数据
                let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
                let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password;
                if(params.password !== cookiePassword){ //如果有记住我且用户没有自己输入，那就是可以直接登录
                    params.password = md5(params.password); //对用户输入的password进行MD5加密
                }
            }

            let url = null;
            if(opType.value == 0){
                url = api.register;
            }else if(opType.value == 1 ){
                url = api.login
            }else if(opType.value == 2){
                url = api.resetPwd
            }
            let result = await proxy.Request({
                url:url,
                params:params,
                errorCallback:() => {
                    changeCheckCode(0);
                }
            })
            if(!result){ 
                return;
            }
            //注册返回
            if(opType.value == 0){
                proxy.Message.success("注册成功，请登录");
                showPanel(1);//切换到登录界面

            }else if(opType.value == 1){  //登录返回
                if(params.rememberMe){//如果用户选择了“记住我”选项，需要使用cookies保存登录信息
                    const loginInfo = {
                        email:params.email,
                        password:params.password,   //这里的密码已经是md5了
                        rememberMe:params.rememberMe
                    }
                    proxy.VueCookies.set("loginInfo",loginInfo,"7d")//把loginInfo这个对象存到对应的cookies中去,存七天
                }else{
                    proxy.VueCookies.remove("loginInfo");
                }
                dialogConfig.show = false;//登录成功之后，将登录界面隐藏掉
                proxy.Message.success("登录成功");
                store.commit('updateLoginUserInfo',result.data);    //登录成功之后，把用户信息存到了vuex中
            }else if(opType.value == 2){ //重置密码
                proxy.Message.success("重置密码成功，请登录");
                showPanel(1);//切换到登录界面
            }

        })
    }

    //重置表单
    const resetForm = () => {
        dialogConfig.show = true;   //dialogConfig无论是登录、注册、重置密码，都需要dialogConfig.show = true，才能显示对应的对话框
        if(opType.value == 0 ){
            dialogConfig.title = "注册";
        }else if(opType.value == 1){
            dialogConfig.title = "登录";
        }else if (opType.value == 2){
            dialogConfig.title = "重置密码";
        }
        nextTick(()=>{  //表单元素展示到页面之后，执行nextTick函数里面的内容    也就是表单渲染（弹框）完成之后，执行nextTick里面的内容
            changeCheckCode(0)  //重置验证码
            formDataRef.value.resetFields();    //重置表单，将上一次输入的数据刷新掉 
            formData.value = {};
            //重置表单时，需要判断当前是否是登录状态，如果是，需要从cookie中取出数据写到登录页面中
            if(opType.value == 1){
                const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
                if(cookieLoginInfo){
                    formData.value = cookieLoginInfo //如果cookie中有值，才进行赋值，否则无需进行赋值
                }
            }
        })
    }

    /* 图片验证码 */
    //1、图片验证码地址（接口）
    const checkCodeUrl = ref(api.checkCode);
    const checkCodeUrl4SendMailCode = ref(api.checkCode);
    //2、点击切换图片验证码
    const changeCheckCode = (type) => {
        if(type == 0){
            checkCodeUrl.value = api.checkCode + "?type=" + type + "&time=" + new Date().getTime()
        }else {
            checkCodeUrl4SendMailCode.value = api.checkCode + "?type=" + type + "&time=" + new Date().getTime()
        }

    }


    //密码显示隐藏操作(眼睛)
    const passwordEyeType = reactive({
        passwordEyeOpen:false,
        registerPasswordEyeOpen:false,
        reRegisterPasswordEyeOpen:false
    })

    const eyeChange = (type) => {
        passwordEyeType[type] = !passwordEyeType[type]
    }

    const closeDialog = () => {
        dialogConfig.show = false;
        store.commit("showLogin",false)
    }

</script>

<style lang="scss">
    .login-register{
        .send-email-panel{
            display: flex;
            width: 100%;
            justify-content: space-between;
            .send-email-btn {
                margin-left: 5px;
            }
        }

        // el-from-tiem本身自带display：flex布局
        .rememberme-panel {
            width: 100%;
        }
        .no-account{
            width: 100%;
            display:flex;
            justify-content: space-between;
        }
        .op-btn {
            width: 100%;
        }
    }
    .check-code-panel{
        display:flex;
        .check-code {
            // 为什么这里不用主轴对齐方式让他们之间有间隔
            //因为主轴已经被占满了
            margin-left: 5px;
            cursor: pointer;
        }
     }   
</style>

