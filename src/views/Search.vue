<!-- 搜索 -->
<template>
    <div class="container-body search-body" :style="{width:proxy.globalInfo.bodyWidth+'px'}">
        <div class="search-panel" :style="{'padding-top':startSearch ? '0px' : searchPanelHeight + 'px'}">
            <el-form
                :model="formData"
                :rules="rules"
                ref="formDataRef"
                @submit.prevent
                >
                <!--input输入-->
                <el-form-item  >
                    <el-input 
                        size="large" 
                        clearable placeholder="请输入关键词" 
                        v-model="formData.keyWord" 
                        @keyup.enter="search"
                        @focus="startSearchHandler"
                        @change="changeInput">
                        <template #suffix>
                            <span class="iconfont icon-search" @click="search" @blur="formData.keyWord=$event.target.value.trim()"></span>
                        </template> 
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="article-list">
            <DataList :loading="loading" :dataSource="articleListInfo" @loadData="search">
                <template #mySlot="{data}">
                    <ArticleListItem :showComment="showComment" :data="data" :htmlTitle="true"></ArticleListItem>
                </template>
            </DataList>
        </div>
    </div>
</template>

<script setup>
    import ArticleListItem from "../views/forum/ArticleListItem.vue";
    import {ref,reactive, getCurrentInstance,watch} from "vue";
    import { useRoute,useRouter } from "vue-router";
    import {useStore} from 'vuex'
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const api = {
        loadArticle:"/forum/search",
    }

    const formData = ref({});
    const formDataRef = ref();
    const rules = {
        keyWord: [
            { required: true, message: "请输入关键字" },
            { min:3 , message: "关键字至少三个" }
        ],
    };

    const searchPanelHeight = (window.innerHeight - 60 - 240) / 2

    //获取焦点（focus），开始搜索，输入框变到上面去
    const startSearch = ref(false);
    const startSearchHandler = () => {
        startSearch.value = true;
    }


    //input框改变
    const changeInput = () => {
        if(formData.value.keyWord == ""){
            articleListInfo.value = {}; //搜索的内容置空
        }
    }

    //搜索
    const loading = ref(false);
    const articleListInfo = ref({});
    const search = async () => {
        loading.value = true;
        let params = {
            pageNo:articleListInfo.value.pageNo,
            keyword:formData.value.keyWord
        }

        let result = await proxy.Request({
            url:api.loadArticle,
            params:params,  
            showLoading:false
        })
        loading.value = false;
        if(!result){
            return;
        }

        let list = result.data.list;
        list.forEach(element => {
            element.title = element.title.replace(params.keyword,"<span style='color:red'>"+params.keyword+"</span>")
        });

        articleListInfo.value = result.data;
    }

    //是否开启评论区
    const showComment = ref(false);
    watch(() =>store.state.sysSetting,(newVal, oldVal) => {
        if(newVal){
            showComment.value = newVal.commentOpen
        }
    }, { immediate: true, deep: true });

</script>

<style lang="scss" scoped>
    .search-body {
        background: #fff;
        padding: 10px;
        min-height: calc(100vh - 210px);
        .search-panel {
            display: flex;
            justify-content: center;
            .el-input {
                width: 700px;
            }
        }
    }
</style>
