<template>
    <div class="comment-body">
        <div class="comment-title">
            <div class="title">评论<span class="count">{{ commentListInfo.totalCount }}</span></div>
            <div class="tab">
                <span @click="orderChange(0)" :class="['tab-item',orderType == 0 ? 'active' : '']">热榜</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="orderChange(1)" :class="['tab-item',orderType == 1 ? 'active' : '']">最新</span>
            </div>
        </div>
        <!-- 发送评论 -->
        <div class="comment-form-panel">
            <CommentPost 
                :avatarWidth="50" 
                :userId="currentUserInfo.userId" 
                :showInsertImage="currentUserInfo.userId != null"
                :articleId="articleId"
                :pCommentId="0"
                @postCommentFinish="postCommentFinish">
            </CommentPost>
        </div>
        <!-- 评论区 -->
        <div class="comment-list">
            <DataList 
                :dataSource="commentListInfo" 
                :loading="loading"
                @loadData="loadComment"
                noDataMsg="暂无评论，赶紧占沙发吧！">
                <template #mySlot="{data}">
                    <CommentListItem 
                        :commentData="data"
                        :articleId="articleId" 
                        :articleUserId="articleUserId"
                        :currentUserId="currentUserInfo.userId"
                        @hiddenAllReply="hiddenAllReplyhandler"
                        @reloadData="loadComment">
                    </CommentListItem>
                </template>
            </DataList>
        </div>
    </div>
</template>

<script setup>
    import CommentPost from './CommentPost.vue'
    import CommentListItem from './CommentListItem.vue'
    import {ref,reactive, getCurrentInstance,watch} from "vue";
    import { useRoute,useRouter } from "vue-router";
    import { useStore } from "vuex";
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const api = {
        loadComment:"/comment/loadComment",
    }

    const props = defineProps({
        articleId:{
            type:String,
        },
        articleUserId:{
            type:String
        }
    })

    //获取当前用户信息，在评论区那里显示头像
    const currentUserInfo = ref({});
    watch(() =>store.state.loginUserInfo, (newVal, oldVal) => {
        currentUserInfo.value = newVal || {};
    }, { immediate: true, deep: true });

    //评论区
    const orderType = ref(0)//排序

    const orderChange = (type) => { //改变排序（评论、热榜、最新这里的排序）
        orderType.value = type
        loadComment();
    }

    const loading = ref(null)   //显示骨架
    const commentListInfo = ref({})
    const loadComment = async () => {
        let params = {
            pageNo:commentListInfo.value.pageNo,
            articleId:props.articleId,
            orderType:orderType.value,
        }
        loading.value = true;
        let result = await proxy.Request({
            url:api.loadComment,
            showLoading:false,
            params:params
        })
        loading.value = false;
        if(!result){
            return;
        }
        commentListInfo.value = result.data;
    }
    loadComment();

    //隐藏所有回复框
    const hiddenAllReplyhandler = () => {
        commentListInfo.value.list.forEach(element => {
            element.showReply = false;
        });
    }

    const emit = defineEmits(["updateCommentCount"])
    //评论结束之后，父级组件接收到评论数据并加到页面中
    const postCommentFinish = (resultData) => {
        commentListInfo.value.list.unshift(resultData)
        const totalCount = commentListInfo.value.totalCount + 1;
/*         commentListInfo.value.totalCount = totalCount;
        emit("updateCommentCount",totalCount)
        console.log(totalCount) */
        commentListInfo.value.totalCount++;
        emit("updateCommentCount",commentListInfo.value.totalCount)
    }

</script>

<style lang="scss">
    .comment-body {
        .comment-title {
            display: flex;
            align-items: center;
            .title {
                font-size: 20px;
                .count {
                    font-size: 14px;
                    padding: 0px 10px;
                }
            }
            .tab {
                .tab-item {
                    cursor: pointer;
                }
                .active {
                    color:var(--link)
                }
            }
        }
        .comment-form-panel {
           margin-top: 20px;
        }
    }
</style>
