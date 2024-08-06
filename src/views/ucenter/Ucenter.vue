<!-- 用户中心 -->
<template>
    <div class="container-body ucenter" :style="{width:proxy.globalInfo.bodyWidth+'px'}">

      <!-- 首页 > 个人中心  -->
      <div class="user-banner">
        <router-link to="/" class="a-link">首页</router-link>
        <span class="iconfont icon-right"></span>
        <span>个人中心</span>
      </div>

      <!-- 分为左边和右边 -->
      <div class="ucenter-panel">
        
        <!-- 左边 -->
        <div class="user-side">
          <!-- 左边的上边 -->
          <div class="avatar-panel">
            <div class="edit-btn a-link" v-if="isCurrentUser" @click="updateUserInfo">
              修改资料
            </div>
            <div class="avatar-inner">
              <Avatar :userId="userInfo.userId" :width="120"></Avatar>
            </div>
            <div class="nick-name">
              <span>{{userInfo.nickName}}</span>
              <span v-if="userInfo.sex == 0" class="iconfont icon-woman"></span>
              <span v-if="userInfo.sex == 1" class="iconfont icon-man"></span>
            </div>
            <div class="desc">{{userInfo.personDescription }}</div>
          </div>

          <!-- 左边的下边 -->
          <div class="udser-exten-panel">
            <div class="info-item">
              <div class="label iconfont icon-integral">积分</div>
              <div class="value a-link" v-if="isCurrentUser" @click="showIntegralRecord">{{userInfo.currentIntegral}}</div>
              <div class="value" v-else>{{userInfo.currentIntegral}}</div>
            </div>
            <div class="info-item">
              <div class="label iconfont icon-like">获赞</div>
              <div class="value">{{userInfo.likeCount}}</div>
            </div>
            <div class="info-item">
              <div class="label iconfont icon-post">发帖</div>
              <div class="value">{{userInfo.postCount}}</div>
            </div>
            <div class="info-item">
              <div class="label iconfont icon-register">加入</div>
              <div class="value">{{userInfo.joinTime}}</div>
            </div>
            <div class="info-item">
              <div class="label iconfont icon-login">最后登录</div>
              <div class="value">{{userInfo.lastLoginTime}}</div>
            </div>
          </div>

        </div>
        <!-- 右边 -->
         <div class="article-panel">
          <el-tabs :model-value="activeTabName" @tab-change="changeTab">
            <el-tab-pane label="发帖" :name="0"></el-tab-pane>
            <el-tab-pane label="评论" :name="1"></el-tab-pane>
            <el-tab-pane label="点赞" :name="2"></el-tab-pane>
          </el-tabs>
          <div class="article-list">
            <DataList :loading="loading" :dataSource="articleListInfo" @loadData="loadArticle">
                <template #mySlot="{data}">
                    <ArticleListItem :data="data" :showEdit="activeTabName == 0 && isCurrentUser" :showComment="showComment"></ArticleListItem>
                </template>
            </DataList>
          </div>
         </div>

      </div>

      <UcenterEditUserInfo ref="ucenterEditUserInfoRef" @resetUserInfo="resetUserInfoHandler"></UcenterEditUserInfo>

      <UserIntegralRecord ref="userIntegralRecordRef" ></UserIntegralRecord>

    </div>
</template>

<script setup>
    import ArticleListItem from "../forum/ArticleListItem.vue"
    import UserIntegralRecord from "./UserIntegralRecord.vue"
    import UcenterEditUserInfo from "./UcenterEditUserInfo.vue"
    import {ref,reactive, getCurrentInstance, onMounted,watch} from "vue";
    import { useRoute,useRouter } from "vue-router";
    import {useStore} from 'vuex'
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const api = {
      getUserInfo:"/ucenter/getUserInfo",
      loadUserArticle:"/ucenter/loadUserArticle"
    }

    //右侧文章
    const activeTabName = ref(0);
    const changeTab = (type) => {
      activeTabName.value = type;
      loadArticle();
    } 

    const loading = ref(false);
    const articleListInfo = ref({});
    const loadArticle = async () => {
        loading.value = true;
        let params = {
            pageNo:articleListInfo.value.pageNo,
            type:activeTabName.value,
            userId:userId.value
        }
        let result = await proxy.Request({
            url:api.loadUserArticle,
            params:params,
            showLoading:false
        })
        loading.value = false;
        if(!result){
            return;
        }
        articleListInfo.value = result.data;    //到data这一层
    }

    const userId = ref(null);
    const userInfo = ref({});
    const loadUserInfo = async () => {
      let result = await proxy.Request({
        url:api.getUserInfo,
        params:{
          userId:userId.value
        },
        errorCallback:()=>{
          setTimeout(()=>{
            router.push("/");    
          },1500)
        }
      })
      if(!result){
        return;
      }
      userInfo.value = result.data;

    }

    const resetCurrentUser = () => {
      const loginUserInfo = store.getters.getLoginUserInfo;
      if(loginUserInfo && loginUserInfo.userId == userId.value){
        isCurrentUser.value = true;
      }else {
        isCurrentUser.value = false;
      }
    }

    const isCurrentUser = ref(false);
    // 监听,当前用户中心与登录的用户是否是同一个人
    watch(() =>store.state.loginUserInfo, (newVal, oldVal) => {
      resetCurrentUser();
    }, { immediate: true, deep: true });

    watch(() => route.params.userId,(newVal, oldVal) => {
      if(newVal){
        userId.value = newVal;
        resetCurrentUser();
        loadUserInfo();
        loadArticle();
      }

    }, { immediate: true, deep: true });
    
    //修改资料
    const ucenterEditUserInfoRef = ref(null);
    const updateUserInfo = () => {  //点击修改资料按钮
      ucenterEditUserInfoRef.value.showEditUserInfoDialog(userInfo.value)
    }
    const resetUserInfoHandler = (data) => {  //确定按钮
      userInfo.value = data;
    }

    //查看积分
    const userIntegralRecordRef = ref(null);
    const showIntegralRecord = () => {  //点击修改资料按钮
      userIntegralRecordRef.value.showRecord()
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
    .ucenter {
      .user-banner {
        line-height: 30px;
        color: #91a7b9;
        .icon-right {
          padding: 0px 5px;
        }
      }
      .ucenter-panel {
        display: flex;
        .user-side{
          width: 300px;
          margin-right: 10px;
          .avatar-panel {
            background: #fff;
            text-align: center;
            padding: 10px;
            .edit-btn {
              text-align: right;
              font-size: 16px;
            }
            .avatar-inner {
              display: flex;
              justify-content: center;
            }
            .nick-name {
              .iconfont {
                margin-left: 5px;
                color: var(--link);
              }
            }
            .desc {
              margin-top: 5px;
              color: #929393;
            }
          }
        }
        .udser-exten-panel {
          margin-top: 10px;
          background: #fff;
          padding: 10px;
          .info-item {
            display: flex;
            justify-content: space-between;
            line-height: 30px;
            .label {
              font-size: 13px;
            }
            .label::before{
              font-size: 22px;
              color: #888;
              padding-right: 5px;
            }
            .value {
              font-size: 14px;
            }
          }
        }


        .article-panel {
          flex: 1;
          background: #fff;
          padding: 0px 10px 10px 10px;
        }


      }
    }
</style>
