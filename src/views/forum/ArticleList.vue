<template>
    <!-- 文章内容区主体部分 -->
    <div class="container-body article-list-body" :style="{width:proxy.globalInfo.bodyWidth+'px'}">
        <!-- 二级板块信息 -->
        <div class="sub-board" v-if="pBoardId">
            <span :class="['board-item',boardId == 0 ? 'active' : '']">
                <router-link :to="`/forum/${pBoardId}`">全部</router-link>
            </span>
            <span v-for="item in subBoardList" :key="item.boardId" :class="['board-item' ,item.boardId == boardId ? 'active' : '']">
                <router-link :to="`/forum/${item.pBoardId}/${item.boardId}`">{{item.boardName}}</router-link>
            </span>
        </div>
        <div class="article-panel">
            <!-- 文章区导航条 -->
            <div class="top-tab">
                <div :class="['tab',orderType == 0 ? 'active': '']" @click="changeOrderType(0)">热榜</div>
                <el-divider direction="vertical"></el-divider>
                <div :class="['tab',orderType == 1 ? 'active': '']" @click="changeOrderType(1)">发布时间</div>
                <el-divider direction="vertical"></el-divider>
                <div :class="['tab',orderType == 2 ? 'active': '']" @click="changeOrderType(2)">最新</div>
            </div>
            <!-- 帖子区域 -->
            <div class="article-list">
                <DataList :loading="loading" :dataSource="articleListInfo" @loadData="loadArticle">
                    <template #mySlot="{data}">
                        <ArticleListItem :showComment="showComment" :data="data"></ArticleListItem>
                    </template>
                </DataList>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref,reactive, getCurrentInstance,watch} from "vue";
    import { useRoute,useRouter } from "vue-router";
    import ArticleListItem from "./ArticleListItem.vue";
    import { useStore} from 'vuex'
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
    const router = useRouter();
    const route = useRoute();
    const store = useStore();


    const api = {
        loadArticle:"/forum/loadArticle",
    }

    //一级板块
    const pBoardId = ref(0);
    //二级板块
    const boardId = ref(0);

    //获取文章列表
    const orderType = ref(0);
    const loading = ref(false);
    const articleListInfo = ref({});
    const loadArticle = async () => {
        loading.value = true;
        let params = {
            pageNo:articleListInfo.value.pageNo,
            orderType:orderType.value,
            pBoardId:pBoardId.value,
            boardId:boardId.value,   //当想获取所有的板块信息的时候，boardId就传0
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
        articleListInfo.value = result.data;    //到data这一层
    }

    //热门、发布时间、最新
    const changeOrderType = (type) => {
        orderType.value = type;
        loadArticle();
    }


    //二级板块
    const subBoardList = ref([]);
    const setSubBoard = () => {
        subBoardList.value = store.getters.getSubBoardList(pBoardId.value);
    }

    //当点击路径时，监听路由变化（监听router.push()）,只有通过监听，才能得到route里面的数据
    watch(() => route.params,(newVal, oldVal) => {
        pBoardId.value = newVal.pBoardId;   //一级板块
        boardId.value = newVal.boardId || 0;     //二级板块
        setSubBoard();
        loadArticle();
        store.commit("setActivePBoardId",newVal.pBoardId)
        store.commit("setActiveBoardId",newVal.boardId)
    }, 
    { immediate: true, deep: true });

    watch(() => store.state.boardList, (newVal, oldVal) => {
        setSubBoard();
    }, { immediate: true, deep: true });

    //是否开启评论区
    const showComment = ref(false);
    watch(() =>store.state.sysSetting,(newVal, oldVal) => {
        if(newVal){
            showComment.value = newVal.commentOpen
        }
    }, { immediate: true, deep: true });

</script>

<style lang="scss" scoped>
    .article-list-body {
        .sub-board {
            padding: 10px 0px 12px 0px;
            .board-item {
                background: #fff;
                border-radius: 15px;
                padding: 2px 10px;
                margin-right: 10px;
                color: #909090;
                cursor: pointer;
                font-size: 14px;
                a {
                    text-decoration: none;
                    color: #909090;
                }
            }
            .active {
                background: var(--link) ;
                a {
                    color: #fff;
                }
            }
        }
        .article-panel {
            background:#fff;
            .top-tab {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                font-size: 15px;
                border-bottom: 1px solid #ddd;
                .tab {
                    cursor: pointer;
                }
                .active {
                    color: var(--link);
                }
            }
        }
    }
</style>
