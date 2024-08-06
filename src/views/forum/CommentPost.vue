<template>
    <div class="post-comment-panel">
        <Avatar :width="avatarWidth" :userId="userId"></Avatar>
        <div class="comment-form">
            <el-form :model="formData" :rules="rules" ref="formDataRef" >
                <el-form-item prop="content" >
                    <el-input 
                        :placeholder="placeholderInfo" 
                        type="textarea" 
                        :maxlength="800" 
                        resize="none"
                        show-word-limit
                        v-model="formData.content"
                        >
                    </el-input>
                    <div class="insert-img" v-if="showInsertImage">
                        <div class="pre-img" v-if="commentImg">
                            <CommentImage :src="commentImg"></CommentImage>
                            <span class="iconfont icon-remove" @click="removeCommentImg"></span>
                        </div>
                        <el-upload v-else
                            name="file" 
                            :show-file-list="false"
                            accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
                            :multiple="false"
                            :http-request="selectImg">
                            <span class="iconfont icon-image"></span>
                        </el-upload>
                        </div>
                </el-form-item>
            </el-form>
        </div>
        <div class="send-btn" @click="postCommentDo">发表</div>
    </div>
</template>

<script setup>
    import CommentImage from './CommentImage.vue'
    import {ref,reactive, getCurrentInstance} from "vue";
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
   
    const api = {
        postComment:"/comment/postComment"
    }

    const props = defineProps({
        articleId:{
            type:String
        },
        pCommentId:{
            type:Number
        },
        replyUserId:{
            type:String
        },
        avatarWidth:{
            type:Number
        },
        userId:{
            type:String
        },
        showInsertImage:{
            type:Boolean
        },
        placeholderInfo:{
            type:String,
            default:"请文明发言，做一个棒棒的程序猿"
        }
    })

    //图片+评论校验规则
    const checkPostComment = (rule,value,callback) => {
        if(value == null && formData.value.image == null){
            callback(new Error(rule.message))
        }else {
            callback();
        }
    }
    
    //form信息
    const formData = ref({});
    const formDataRef = ref();
    const rules = {
        content: [
            { required: true, message: "请输入评论内容",validator: checkPostComment},
            { min: 5, message: "评论至少五个字！"},
        ],
    };

    const emit = defineEmits(["postCommentFinish"])
    //发布评论,发布一级评论与发布二级评论（回复别人）是同一个接口
    const postCommentDo = () => {
        formDataRef.value.validate(async (valid) => {//校验form表单中的所有项
            if(!valid){
                return
            }
            let params = Object.assign({},formData.value);
            params.articleId = props.articleId
            params.pCommentId = props.pCommentId;
            params.replyUserId = props.replyUserId;

            let result = await proxy.Request({
                url:api.postComment,
                params
            })
            if(!result){
                return;
            }
            proxy.Message.success("评论发表成功")
            formDataRef.value.resetFields();
            removeCommentImg();//图片上传完成后，将上传图片处的图片清除掉
            emit("postCommentFinish",result.data)
        })
    }

   //选择上传图片
    const commentImg = ref(null);
    const selectImg = (file) => {
        file = file.file //形参file里面有一个属性file
        let img = new FileReader();
        img.readAsDataURL(file);
        img.onload = ({target}) => {
        let imgData = target.result;
        commentImg.value = imgData; //上传图片的位置，显示的是图片的base64，不用从网络上请求,显示的时本地上传的图片
        formData.value.image = file; //点击上传图片按钮（postCommentDo）时，将图片传到后端并保存，评论区的图片路径从后端传过来
        }
    }

    const removeCommentImg = () => {
        commentImg.value = null
        formData.value.image = null 
    }

</script>

<style lang="scss">
    .post-comment-panel{
            display: flex;
            align-items: top;
            .comment-form {
                flex: 1;
                margin: 0px 10px;
                .el-textarea__inner {
                    height: 60px;
                }
                .insert-img {
                    line-height: normal;
                    .iconfont {
                        margin-top: 3px;
                        font-size: 20px;
                    }
                    .pre-img {
                        margin-top: 10px;
                        position: relative;
                        .iconfont{
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            color: rgb(121, 121, 121);
                            cursor: pointer;
                        }
                    }
                }
            }
            .send-btn {
                cursor: pointer;
                width: 60px;
                height: 60px;
                background: var(--link);
                color: #fff;
                text-align: center;
                line-height: 60px;
                border-radius: 5px;
            }
    }
</style>
