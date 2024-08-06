<!-- 修改资料 -->
<template>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="450px"
        :showCancel="false"
        @close="dialogConfig.show = false">
        <el-form
            :model="formData"
            ref="formDataRef"
            label-width="40px"
            @submit.prevent
            >
            <el-form-item label="昵称" prop="nickName" >
                {{formData.nickName}}
            </el-form-item>
            <el-form-item label="头像" prop="avatar" >
                <CoverUpload :imageUrlPrefix="proxy.globalInfo.avatarUrl" v-model="formData.avatar"></CoverUpload>
            </el-form-item>
            <!-- 单选 -->
            <el-form-item label="性别" prop="sex" >
                <el-radio-group v-model="formData.sex">
                <el-radio :value="0">女</el-radio>
                <el-radio :value="1">男</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--textarea输入-->
            <el-form-item label="简介" prop="description">
                <el-input
                    clearable
                    placeholder="请输入简介"
                    type="textarea"
                    :rows="5"
                    :maxlength="100"
                    resize="none"
                    show-word-limit
                    v-model="formData.personDescription"
                    >
                </el-input>
            </el-form-item>
        </el-form>
    </Dialog>
</template>

<script setup>

    import {ref,reactive, getCurrentInstance,watch, nextTick} from "vue";
    import { useRoute,useRouter } from "vue-router";
    import {useStore} from 'vuex'
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const api = {
        updateUserInfo:"/ucenter/updateUserInfo"
    }

    const dialogConfig = reactive({
      show: false,
      title: "编辑个人信息",
      buttons: [
       {
        type: "primary",
        text: "确定",
        click: (e) => {
          updateUserInfoHandler();
        },
      },
     ],
    });
    const formData = ref({});
    const formDataRef = ref();

    //确定按钮(提交信息)
    const emit = defineEmits(["resetUserInfo"])
    const updateUserInfoHandler = () => {
        formDataRef.value.validate(async (valid) => {
            if(!valid){
                return;
            }
            let params = {};
            Object.assign(params,formData.value);//只深复制第一层
            let result = await proxy.Request({
                url:api.updateUserInfo,
                params:params,
            })
            if(!result){
                return;
            }
            dialogConfig.show = false;
            if(params.avatar instanceof File){
                router.go(0);//刷新
            }else{
                emit("resetUserInfo",params);
            }
        })
    }

    const showEditUserInfoDialog = (userInfo) => {
        dialogConfig.show = true;
        nextTick(() => {
            formDataRef.value.resetFields();
            const dataInfo = JSON.parse(JSON.stringify(userInfo));
            dataInfo.avatar = {
                imageUrl:dataInfo.userId,
            }
            formData.value = dataInfo;
        })
    }
    defineExpose({ showEditUserInfoDialog })



</script>

<style lang="scss">

</style>