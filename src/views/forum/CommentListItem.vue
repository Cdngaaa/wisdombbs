<template>
  <div class="comment-item">
    <Avatar :userId="commentData.userId" :width="50"></Avatar>
    <div class="comment-info">
        <div class="nick-name">
            <span class="name" @click="goToUcenter(commentData.userId)">{{commentData.nickName}}</span>
            <span v-if="commentData.userId == articleUserId" class="tag-author">作者</span>
        </div>
        <div class="comment-content">
            <div>
                <span class="tag tag-topping" v-if="commentData.topType == 1">置顶</span>
                <span class="tag no-audit" v-if="commentData.status == 0">待审核</span>
                <span v-html="commentData.content"></span>
            </div>
            <CommentImage 
                v-if="commentData.imgPath" 
                :src="proxy.globalInfo.imageUrl + commentData.imgPath.replace('.','_.')"
                :imgList="[proxy.globalInfo.imageUrl + commentData.imgPath]">
            </CommentImage>
        </div>
        <div class="op-panel">
            <div class="time">
                <span>{{commentData.postTime}}</span>
                <span class="address">&nbsp;·&nbsp;{{commentData.userIpAddress}}</span>
            </div>
            <div :class="['iconfont icon-good',commentData.likeType == 1 ? 'active' : '']" @click="doLike(commentData)">{{commentData.goodCount > 0 ? commentData.goodCount : '点赞'}}</div>
            <div class="iconfont icon-comment" @click="showReplyPanel(commentData,0)">回复</div>
            <el-dropdown v-if="articleUserId == currentUserId">
                <div class="iconfont icon-more"></div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="opTop(commentData)">
                            {{commentData.topType == 0 ? '设为置顶' : '取消置顶'}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="comment-sub-list" v-if="commentData.children">
            <div class="comment-sub-item" v-for="sub in commentData.children" :key="sub">
                <Avatar :userId="sub.userId" :width="30"></Avatar>
                <div class="comment-sub-info">
                    <div class="nick-name">
                        <span class="name" @click="goToUcenter(sub.userId)">{{sub.nickName}}</span>
                        <span v-if="sub.userId == articleUserId" class="tag-author">作者</span>
                        <span class="reply-name">回复</span>
                        <span @click="goToUcenter(sub.replyUserId)" class="a-link">@{{sub.replyNickName}}</span>
                        <span>：</span>
                        <span class="sub-content" v-html="sub.content"></span>
                    </div>
                    <div class="op-panel">
                        <div class="time">
                            <span>{{sub.postTime}}</span>
                            <span class="address">&nbsp;·&nbsp;{{sub.userIpAddress}}</span>
                        </div>
                        <div :class="['iconfont icon-good',sub.likeType == 1 ? 'active' : '']" @click="doLike(sub)">{{sub.goodCount > 0 ? sub.goodCount : '点赞'}}</div>
                        <div class="iconfont icon-comment" @click="showReplyPanel(sub,1)">回复</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="reply-info" v-if="commentData.showReply">
            <CommentPost
                :placeholderInfo="placeholderInfo" 
                :avatarWidth="30" 
                :userId="currentUserId" 
                :showInsertImage="false"
                :pCommentId="pCommmentId"
                :replyUserId="replyUserId"
                :articleId="articleId"
                @postCommentFinish="postCommentFinish">
            </CommentPost>
        </div>
    </div>
  </div>
</template>

<script setup>
    import CommentPost from './CommentPost.vue';
    import CommentImage from './CommentImage.vue';
    import {ref,reactive, getCurrentInstance} from "vue";
    import { useRoute,useRouter } from "vue-router";
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
    const router = useRouter();
    const route = useRoute();

    const api = {
        doLike:"/comment/doLike",
        changeTopType:"/comment/changeTopType",
    }

    const props = defineProps({
        articleId:{
            type:String,
        },  
        commentData:{
            type:Object,
        },
        articleUserId:{ //文章作者id  还有一个也是文章作者id，保存在commentData里
            type:String,
        },
        currentUserId:{ //当前用户id
            type:String
        }
    })

    const placeholderInfo = ref(null);
    //父级评论id
    const pCommmentId = ref(0);
    //被回复的那个人的userId
    const replyUserId = ref(null);
    const emit = defineEmits(["hiddenAllReply","reloadData"])//自定义事件
    //显示回复框
    const showReplyPanel = (curData,type) => {    //这个参数是commentData，评论数据
        const show = props.commentData.showReply == undefined ? false : props.commentData.showReply
        emit("hiddenAllReply");
        if(type == 0){
            props.commentData.showReply = !show
        }else {
            props.commentData.showReply = true
        }
        pCommmentId.value = props.commentData.commentId
        replyUserId.value = curData.userId;
        placeholderInfo.value = "回复 @" + curData.nickName;
    }

    //评论结束之后，父级组件接收到评论数据并加到页面中
    const postCommentFinish = (resultData) => {
        props.commentData.children = resultData;
        placeholderInfo.value = undefined
    }
    
    //评论中，去用户中心
    const goToUcenter = (userId) => {
        router.push(`/user/${userId}`)
    }

    //评论中，点赞
    const doLike = async (data) => {
        let result = await proxy.Request({
            url:api.doLike,
            showLoading:false,
            params:{
                commentId:data.commentId
            }
        })
        if(!result){
            return;
        }
        data.goodCount = result.data.goodCount;
        data.likeType = result.data.likeType;
    }

    //置顶
    const opTop = async (data) => {
        let result = await proxy.Request({
            url:api.changeTopType,
            params:{
                commentId:data.commentId,
                topType:data.topType == 1 ? 0 : 1,
            }
        })
        if(!result){
            return;
        }
        emit("reloadData");
    }

</script>

<style lang="scss">
    .comment-item {
        display: flex;
        padding-top: 15px;
        .comment-info {
            flex: 1;
            margin-left: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
            .nick-name{
                .name{
                    font-size: 14px;
                    color: var(--text2);
                    margin-right: 10px;
                    cursor: pointer;
                }
                .tag-author {
                    background: var(--pink);
                    color: #fff;
                    font-size: 12px;
                    border-radius: 2px;
                    padding: 0px 3px;
                }
            }
            .comment-content {
                margin-top: 5px;
                font-size: 15px;
                line-height: 22px;
                .tag {
                    margin-right: 5px;
                    font-size: 13px;
                    border-radius: 3px;
                    padding: 0px 5px;
                }
                .tag-topping {
                    color: var(--pink);
                    border: 1px solid var(--pink);
                }
                .no-audit{
                    color: var(--text2);
                    border: 1px solid var(--text2);
                }
            }
            .op-panel {
                display: flex;
                align-items: center;
                margin-top: 5px;
                font-size: 13px;
                color: var(--text2);
                .time {
                    margin-right: 20px;
                }
                .iconfont{
                    margin-right: 15px;
                    font-size: 14px;
                    color: var(--icon);
                    cursor: pointer;
                }
                .iconfont::before{
                    margin-right: 3px;
                }
                .active {
                    color: var(--link);
                }
            }
            .comment-sub-list {
                margin-top: 10px;
                .comment-sub-item {
                    display: flex;
                    margin: 8px 0px;
                    font-size: 14px;
                    .comment-sub-info{
                        margin-left: 5px;
                        .nick-name {
                            .reply-name {
                                margin: 0px 5px;
                            }
                            .sub-content {
                                font-size: 15px;
                            }
                        }
                    }
                }
            }
            .reply-info {
                margin-top: 15px;
            }
        }
    }
</style>
