<!-- 发帖 -->
<template>
    <div class="edit-post">
        <el-form
        class="post-panel"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="60px"
        @submit.prevent
        >
            <!-- 发帖左侧 -->
            <div class="post-editor" :body-style="{padding : '5px'}">
                <el-card>
                    <template #header>
                        <div class="post-editor-title">
                            <span>正文</span>
                            <div class="change-editor-type">
                                <span class="iconfont icon-change" @click="changeEditor">切换为{{editorType == 0 ? "markdown编辑器" : "富文本编辑器"}}</span>
                            </div>
                        </div>
                    </template>
                    <el-form-item  prop="content" label-width="0"> 
                        <EditorHtml :height="htmlEditorHeight" v-if="editorType == 0" v-model="formData.content"></EditorHtml>
                         <EditorMarkDown :height="markdownHeight" v-if="editorType == 1" v-model="formData.markdownContent" @htmlContent="setHtmlContent"></EditorMarkDown>
                    </el-form-item>
                </el-card>
            </div>
            <!-- 发帖右侧 -->
            <div class="post-setting" :body-style="{padding : '5px'}">
                <el-card>
                    <template #header>
                        <span>设置</span>
                    </template>
                    <div class="setting-inner">
                        <!--标题-->
                        <el-form-item label="标题" prop="title" >
                            <el-input clearable placeholder="提示信息" v-model.trim="formData.title" :maxlength="150"></el-input>
                        </el-form-item>
                        <!-- 板块 -->
                        <el-form-item label="板块" prop="boardIds" >
                            <el-cascader clearable placeholder="请选择板块" :options="boardList" :props="boardProps"  v-model="formData.boardIds" :style="{width:'100%'}"></el-cascader>
                        </el-form-item>
                        <!-- 封面 -->
                        <el-form-item label="封面" prop="cover" >
                            <CoverUpload v-model="formData.cover"></CoverUpload>
                        </el-form-item>
                        <!-- 摘要 -->
                        <el-form-item label="摘要" prop="summary" >
                            <el-input clearable placeholder="请选择板块" type="textarea" :rows="5" :maxlength="200" resize="none" v-model="formData.summary" ></el-input>
                        </el-form-item>
                        <!-- 附件 -->
                        <el-form-item label="附件" prop="cover" >
                            <AttachmentSelector v-model="formData.attachment"></AttachmentSelector>
                        </el-form-item>
                        <!--积分-->
                        <el-form-item label="积分" prop="integral" v-if="formData.attachment" >
                            <el-input clearable placeholder="请输入积分" v-model.trim="formData.integral"></el-input>
                            <span class="tips">附件下载需要积分,0表示无需积分</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :style="{width:'100%'}" @click="postHandler">保存</el-button>
                        </el-form-item>
                    </div>
                </el-card>
            </div>
        </el-form>   
    </div>
</template>

<script setup>
    import {ref,reactive, getCurrentInstance,watch, nextTick} from "vue";
    import { useRoute,useRouter } from "vue-router";
    import { ElMessageBox } from "element-plus";
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
    const router = useRouter();
    const route = useRoute();

    const api = {
        loadBoard:"/forum/loadBoard4Post",     //发布帖子时获取板块信息
        postArticle:"/forum/postArticle",
        articleDetail4Update:"/forum/articleDetail4Update",
        updateArticle:"/forum/updateArticle"
    }

    const articleId = ref(null);
    const getArticleDetail = () => {
        nextTick(async () => {
            formDataRef.value.resetFields();
            if(articleId.value){    //修改,已发布的帖子的内容会保存到服务器
                let result = await proxy.Request({
                    url:api.articleDetail4Update,   //调用这个接口,将以前保存的内容重新发到前端来
                    params:{
                        articleId:articleId.value,
                    },
                    showError:false,
                    errorCallback:(response)=>{
                        ElMessageBox.alert(response.info,"错误",{
                            "show-close":false,
                            callback:(action) => {
                                router.go(-1);  //帖子可能超过限制数,回到上一个路由
                            }
                        })
                    }
                })
                if(!result){
                    return;
                }
                //得到了上一次保存的内容;
                let articleInfo = result.data.forumArticle; 
                //设置编辑器
                editorType.value = articleInfo.editorType;
                //设置板块信息
                articleInfo.boardIds = [];
                articleInfo.boardIds.push(articleInfo.pBoardId);//将父级boardId放入数组中,
                if(articleInfo.boardId != null && articleInfo.boardId != 0){
                    articleInfo.boardIds.push(articleInfo.boardId)  //检查是否有二级boardId,如果有,就push
                }
                //设置封面信息
                if(articleInfo.cover){
                    articleInfo.cover = {imageUrl:articleInfo.cover}
                }
                //设置附件
                if(result.data.attachment){
                    articleInfo.attachment = {
                        name:result.data.attachment.fileName,
                    },
                    articleInfo.integral = result.data.attachment.integral;  
                }
                formData.value = articleInfo;
            }else{  //新建
                formData.value = {};
                editorType.value = proxy.VueCookies.get("editorType") || 0;
            }
        })
    }

    watch(() =>route, (newVal, oldVal) => {
        if(newVal.path.indexOf("/editPost") != -1 || newVal.path.indexOf("/newPost") != -1){
            articleId.value = newVal.params.articleId;
            getArticleDetail();
        }
    }, { immediate: true, deep: true });

    //设置markdown编辑器的富文本信息
    const setHtmlContent = (htmlContent) => {
        formData.value.content = htmlContent;

    } 

    const formData = ref({});
    const formDataRef = ref();
    const rules = {
      title: [{ required: true, message: "请输入标题" }],
      boardIds:[{ required: true, message: "请选择板块" }],
      content:[{ required: true, message: "请输入正文" }],
      integral:[{ required: true, message: "请输入下载所需积分" },{validator:proxy.Verify.number,message:"请输入数字"}],

    };

    //编辑器的高
    const markdownHeight = window.innerHeight - 60 - 110;
    const htmlEditorHeight = window.innerHeight - 210;

    //可选择的板块
    const boardProps = {
        multiple:false,
        checkStrictly:true,
        value:"boardId",
        label:"boardName"
    }
    const boardList = ref([]);
    const loadBoardList = async() => {
        let result = await proxy.Request({
            url:api.loadBoard,
        })
        if(!result){
            return;
        }
        boardList.value = result.data;
    }
    loadBoardList();

    //编辑器类型 0:富文本,1:markdown
    const editorType = ref(null);

    //切换编辑器类型
    const changeEditor = () => {
        proxy.Confirm("切换编辑器会清空正在编辑的内容,确定要切换吗?",() => {
            editorType.value = editorType.value == 0 ? 1 : 0;
            formData.value.content = "";
            formData.value.markdownContent = "";
            proxy.VueCookies.set("editorType",editorType.value,-1);
        })
    }

    //提交信息
    const postHandler = () => {
        formDataRef.value.validate(async (valid) => {
            if(!valid){
                return;
            }
            let params = {};
            Object.assign(params,formData.value);
            //设置板块
            if(params.boardIds.length == 1){
                params.pBoardId = params.boardIds[0];
            }else if(params.boardIds.length == 2){
                params.pBoardId = params.boardIds[0];
                params.boardId = params.boardIds[1];
            }
            delete params.boardIds;
            //设置编辑器类型
            params.editorType = editorType.value;
            //获取内容
            const contentText = params.content.replace(/<(?!img).*?>/g,"");
            if(contentText == ""){
                proxy.Message.warning("正文不能为空")
                return;
            }
            if(params.attachment != null){
                params.attachmentType == 1;
            }else{
                params.attachmentType == 0;
            }
            //封面
            if(!(params.cover instanceof File)){
                delete params.cover 
                //在修改的时候,如果封面/附件不变,不会被传到后端去,只有当新建/修改时改变了封面/附件,才会将封面/附件以文件的形式传到后端
            }
            //附件不是文件类型,值设置为空
            if(!(params.attachment instanceof File)){
                delete params.attachment
            }

            let result = await proxy.Request({
                url:params.articleId?api.updateArticle:api.postArticle,
                params:params,
            })
            if(!result){
                return;
            }
            proxy.Message.success("保存成功");
            router.push(`/post/${result.data}`);
        })
    }

</script>

<style lang="scss">
    .edit-post {
        .post-panel{
            display: flex;
            .el-card__header {
                padding: 10px;
            }
            .post-editor {
                flex: 1;
                .post-editor-title {
                    display: flex;
                    justify-content: space-between;
                    .change-editor-type {
                        .iconfont{
                            cursor: pointer;
                            color: var(--link);
                            font-size: 15px;
                        }
                    }
                }
            }
            .post-setting {
                width: 450px;
                margin-left: 10px;
                .setting-inner {
                    max-height: calc(100vh - 100px);
                    overflow: auto;
                    .el-form-item {
                        align-items:flex-start;
                    }
                }
                .tips {
                    color: #797979;
                    font-size: 13px;
                }
            }
        }
    }
</style>
