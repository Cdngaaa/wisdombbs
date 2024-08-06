<template>
  <div>
    <!-- 上面导航区 -->
    <div class="header" v-if="showHeader">
        <div class="header-content" :style="{width:proxy.globalInfo.bodyWidth+'px'}">
            <!-- logo，用router-link包裹，可以点击跳转页面 -->
            <router-link class="logo a-link" to="/">
                <span v-for="(item,index) in logoInfo" :style="{color:item.color}" :key="index">{{item.letter}}</span>
            </router-link>

            <!-- 中间menu,展示板块信息-->
            <div class="menu-panel">
                <router-link :class="['menu-item', 'home',activePBoardId == undefined ? 'active' : '']" to="/">首页</router-link>
                <template v-for="board in boardList" :key="board.boardId">
                    <el-popover placement="bottom-start" :width="300" trigger="hover" v-if="board.children.length>0">
                        <template #reference>
                            <span :class="['menu-item',board.boardId == activePBoardId ? 'active' : '']" @click="boardClickHandler(board)">{{board.boardName}}</span>
                        </template>
                        <div class="sub-board-list">
                            <span 
                            :class="['sub-board',subBoard.boardId == activeBoardId ? 'active' : '']" 
                            v-for="subBoard in board.children" 
                            :key="subBoard.boardId" 
                            @click="subBoardClickHandler(subBoard)">
                            {{subBoard.boardName}}
                        </span>
                        </div>
                    </el-popover>
                    <span 
                    :class="['menu-item',board.boardId == activePBoardId ? 'active' : '']" 
                        v-else @click="boardClickHandler(board)">
                        {{board.boardName}}
                    </span>
                </template>
            </div>
            
            
            <!-- 右边登录区 -->
            <div class="user-info-panel">
                <el-button type="primary" class="op-btn" @click="newPost">
                    发帖<span class="iconfont icon-add"></span>
                </el-button>
                <el-button type="primary" class="op-btn" @click="goSearch">
                    搜索<span class="iconfont icon-search"></span>
                </el-button>


                <template v-if="userInfo.userId">
                    <!-- 铃铛下拉框 -->
                    <div class="message-info"> 
                        <el-dropdown>
                            <el-badge :value="messageCountInfo.total" :hidden="messageCountInfo.total == null || messageCountInfo.total == 0" class="item">
                                <div class="iconfont icon-message"></div>
                            </el-badge>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="goToMessage('reply')" class="message-item">
                                        <span class="text">回复我的</span>
                                        <span class="count-tag" v-if="messageCountInfo.reply > 0">{{messageCountInfo.reply > 99 ? "99+" : messageCountInfo.reply}}</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="goToMessage('likePost')" class="message-item">
                                        <span class="text">赞了我的文章</span>
                                        <span class="count-tag" v-if="messageCountInfo.likePost > 0">{{messageCountInfo.likePost > 99 ? "99+" : messageCountInfo.likePost}}</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="goToMessage('downloadAttachment')" class="message-item">
                                        <span class="text">下载了我的附件</span>
                                        <span class="count-tag" v-if="messageCountInfo.downloadAttachment > 0">{{messageCountInfo.downloadAttachment > 99 ? "99+" : messageCountInfo.downloadAttachment}}</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="goToMessage('likeComment')" class="message-item">
                                        <span class="text">赞了我的评论</span>
                                        <span class="count-tag" v-if="messageCountInfo.likeComment > 0">{{messageCountInfo.likeComment > 99 ? "99+" : messageCountInfo.likeComment}}</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="goToMessage('sys')" class="message-item">
                                        <span class="text">系统消息</span>
                                        <span class="count-tag" v-if="messageCountInfo.sys > 0">{{messageCountInfo.sys > 99 ? "99+" : messageCountInfo.sys}}</span>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <!-- 头像下拉框 -->
                    <div class="user-info" :width="50">
                        <el-dropdown>
                            <Avatar :userId="userInfo.userId" :addLink="false"></Avatar>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="goToUcenter(userInfo.userId)">我的主页</el-dropdown-item>
                                    <el-dropdown-item @click="logout">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </template>
                <!-- 没有登录的情况下，显示登录/注册按钮 -->
                <el-button-group :style="{'margin-left':'10px'}" v-else>
                    <el-button type="primary" plain @click="loginAndRegister(1)">登录</el-button>
                    <el-button type="primary" plain @click="loginAndRegister(0)">注册</el-button>
                </el-button-group> 
               

            </div>
        </div>
    </div>

    <!-- 下面展示区 -->
    <div class="body-content">
        <router-view></router-view>
    </div>


    <div class="footer" v-if="showFooter">
        <div class="footer-content" :style="{width:proxy.globalInfo.bodyWidth+'px'}">
            <el-row>
                <el-col :span="6" class="item">
                    <div class="logo">
                        <div class="logo-letter">
                            <span v-for="(item,index) in logoInfo" :style="{color:item.color}" :key="index">{{item.letter}}</span>
                        </div>
                        <div class="info">一个干活满满的编程社区</div>
                    </div>
                </el-col>
                <el-col :span="6" class="item">
                    <div class="title">网站相关
                        <div><a href="#">网站相关</a></div>
                        <div><a href="#">网站相关</a></div>
                        <div><a href="#">网站相关</a></div>
                    </div>
                </el-col>
                <el-col :span="6" class="item">
                    <div class="title">友情链接</div>
                </el-col>
                <el-col :span="6" class="item">
                    <div class="title">关注站长</div>
                </el-col>
            </el-row>
        </div>
    </div>

    <!-- 登录注册 这里定义了子组件的ref属性，就拿到了子组件的实例-->
    <LoginAndRegister ref="loginAndRegisterRef"></LoginAndRegister>

    <!-- 回到顶部 -->
    <el-backtop :right="100" :bottom="100"></el-backtop>

  </div>
</template>

<script setup>
    import LoginAndRegister from "./LoginAndRegister.vue";
    import {ref,reactive, getCurrentInstance, onMounted,watch} from "vue";
    import { useRoute,useRouter } from "vue-router";    //vue3中使用router也需要引入
    import { useStore} from 'vuex'
    /* 
        getCurrentInstance取到vm的this，
        类似于...  从getCurrentInstance中取出proxy对象
        
        也就是 app.config.globalProperties = Vue.prototype（所有组件都能使用） =  getCurrentInstance()
       
        总结：要取到app.config.globalProperties中的东西，需要getCurrentInstance（）
    */
    //1、全局变量
    const {proxy} = getCurrentInstance();   //取到vm的this，也就是proxy = this
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    
    const api = {
        getUserInfo:"/getUserInfo",
        loadBoard:"/board/loadBoard",
        getMessageCount:"/ucenter/getMessageCount",
        logout:"/logout",
        getSysSetting:"/getSysSetting"
    }

    //2、logo颜色
    const logoInfo = ref([
        {
            letter:"W",
            color:"#3285ff"
        },
        {
            letter:"i",
            color:"#fb3264"
        },
        {
            letter:"s",
            color:"#ffba02"
        },
        {
            letter:"d",
            color:"#3285ff"
        },
        {
            letter:"o",
            color:"#fb3264"
        },
        {
            letter:"m",
            color:"#ffba02"
        },
        {
            letter:"b",
            color:"#3285ff"
        },
        {
            letter:"b",
            color:"#fb3264"
        },
        {
            letter:"s",
            color:"#ffba02"
        },
    ])
    
    //4.1、是否展示头部导航区
    const showHeader = ref(true);

    //4.2、获取滚动条的高度
    const getScrollTop = ()=> {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;//解决浏览器兼容性
        return scrollTop
    }

    //4.3、判断头部导航区是否到达临界条件
    const initScroll = ()=> {
        let initScrollTop = getScrollTop();//最开始的滚动条位置
        let scrollType = 0;//用于判断滚动条动迁是往下滚动还是往上滚动
        window.addEventListener('scroll',()=> {
            let currentScrollTop = getScrollTop()//获取当前滚动条的高度
            if(currentScrollTop > initScrollTop){
                scrollType = 1;//往下滚动
            }else {
                scrollType = 0;//往上滚动
            }
            initScrollTop = currentScrollTop;
            if(scrollType == 1 &&  currentScrollTop > 100){
                showHeader.value = false;
            }else {
                showHeader.value = true;
            }
        })
    }


    //登录注册
    const loginAndRegisterRef = ref();  //拿到子组件对象
    const loginAndRegister = (type) => {    //这里是登录/注册点击事件传过来的type
        loginAndRegisterRef.value.showPanel(type); //子组件LoginAndRegister有showPanel这个函数
    }

    //监听 登录用户信息（状态管理）
    const userInfo = ref({})
    watch(() => store.state.loginUserInfo , (newVal, oldVal) => {
        if(newVal != undefined && newVal != null){
            userInfo.value = newVal
        }else {
            userInfo.value = {} //假如太久没有操作，再次操作需要登录的功能的时候，就会先收到901，刷新页面变为需要登录的状态(也就是登录/注册按钮，头像消失)
        }
    }, 
    { immediate: true, deep: true });

    //监听是否展示登录框
    watch(() => store.state.showLogin, (newVal, oldVal) => {
        if(newVal){ //目前只是监听，但是还没有需要用到这个监听的地方
            loginAndRegister(1);
        }
    }, 
    { immediate: true, deep: true });

    //用于获取用户信息,
    const getUserInfo = async () => {
        let result = await proxy.Request({
            //不用传递参数的原因：在login的时候，把对应的email、password等信息传给了后端，后端使用session保存起来了
            //那么当登录完毕的瞬间，就需要调用getUserInfo这个函数，后端在session中把对应的信息传过来，
            url:api.getUserInfo,                        
        })
        if(!result){
            return;
        }
        store.commit('updateLoginUserInfo',result.data);
    }

    //获取板块信息
    const boardList = ref([]);
    const loadBoard = async () => {
        let result = await proxy.Request({
            url:api.loadBoard,
        })
        if(!result){
            return;
        }
        boardList.value = result.data;
        store.commit("saveBoardList",result.data);//保存板块信息    状态管理
    }
    loadBoard();

    //4.4 挂载
    onMounted(()=> {
        initScroll();
        getUserInfo();//用于获取用户信息，挂载完毕之后，就执行这个函数，也就是每一次刷新，都重新获取一遍
        loadSysSetting();//获取系统设置
        /* setInterval(()=>{
            console.log(activePBoardId.value)       //点击了别的地方之后，就不是undefined了
        },500) */
    })

    //板块点击,一级板块
    const boardClickHandler = (board) => {
        router.push(`/forum/${board.boardId}`)  //相当于<router-link :to="'/forum/${board.boardId}'">
    }

    //板块点击，二级板块
    const subBoardClickHandler = (subBoard) => {
        router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`)
    }

    //当前选中的板块
    const activePBoardId = ref(0);
    watch(() => store.state.activePBoardId, (newVal, oldVal) => {
        if(newVal != undefined) {
            activePBoardId.value = newVal ;
        }else{
            activePBoardId.value = undefined
        }
    }, { immediate: true, deep: true });
    const activeBoardId = ref(0);
    watch(() => store.state.activeBoardId, (newVal, oldVal) => {
            activeBoardId.value = newVal;
    }, { immediate: true, deep: true });


    //发帖
    const newPost = () => {
        if(!store.getters.getLoginUserInfo){
            loginAndRegister(1);
        }else {
            router.push("/newPost")
        }
    }

    //是否展示低部
    const showFooter = ref(true);
    watch(() =>route.path, (newVal, oldVal) => {
        if(newVal.indexOf("newPost") != -1 || newVal.indexOf("editPost") != -1){
            showFooter.value = false;
        }else {
            showFooter.value = true;
        }
    }, { immediate: true, deep: true });

    //消息中心
    const goToMessage = (type) => {
        router.push(`/user/message/${type}`)
    }

    const messageCountInfo = ref({});
    const loadMessageCount = async () => {
        let result = await proxy.Request({
            url:api.getMessageCount,
        })
        if(!result){
            return;
        }
        messageCountInfo.value = result.data;
        store.commit("updateMessageCountInfo",result.data);
    }

    watch(() =>store.state.messageCountInfo,(newVal, oldVal) => {
        messageCountInfo.value = newVal || {};
    }, { immediate: true, deep: true });


    watch(() =>store.state.loginUserInfo, (newVal, oldVal) => {
        if(newVal){
            loadMessageCount();
        }
    }, { immediate: true, deep: true });

    //去我的主页
    const goToUcenter = (userId) => {
        router.push(`/user/${userId}`)
    }

    //退出
    const logout = () => {
        proxy.Confirm("确定要退出吗？",async () => {
            let result = await proxy.Request({
                url:api.logout
            })
            if(!result){
                return;
            }
            store.commit("updateLoginUserInfo",null);
        })
    }


    //获取系统配置
    const loadSysSetting = async () => {
        let result = await proxy.Request({
            url:api.getSysSetting,
        })
        if(!result){
            return;
        }
        store.commit("saveSysSetting",result.data);
    }

    //去搜索
    const goSearch = () => {
        router.push("/search")
    }

    

</script>

<style lang="scss" >
    .header{
        position: fixed;    //固定定位，脱离文档流，默认宽高由内容撑开，因此需要width：100%
        top:0px;
        width: 100%;    //配合固定定位，
        //height: 60px;   //父元素不给高度，由于使用固定定位脱离文档流，所以他的高度由子元素撑开
        box-shadow: 0 2px 6px 0 #ddd;  //x轴偏移量，y轴偏移量，阴影向外扩散，且变淡，阴影不扩散区域，颜色
        z-index: 1000;
        background:#fff;
        .header-content{
            margin:0 auto;  //让子元素左右居中
            align-items: center;    //让直接子元素上下居中
            height: 60px;
            display: flex;  //flex布局
            align-items: center;
            .logo{
                display: block;
                margin-right: 5px;//暂时不清楚为什么要设置成block
                text-decoration: none;
                span{
                    font-size: 35px;
                }
            }
            .menu-panel{
                flex: 1;    //将父容器剩下的宽度全部占掉
                .menu-item {
                    margin-left: 20px;
                    cursor: pointer;

                }
                .home {
                    text-decoration: none;
                    color: #000;
                }
                .active {
                    color: var(--link);
                }
            }
            .user-info-panel{
                width: 310px;
                display: flex;
                align-items: center;
                .op-btn{
                    .iconfont{
                        margin-left: 5px;
                    }
                    .el-button +.el-button {
                    margin-left: 5px;
                    }
                }
                .message-info {
                    margin-left: 5px;
                    margin-right: 25px;
                    .icon-message{
                        font-size: 25px;
                        color: rgb(147,147,147);  
                        cursor: pointer; 
                    }
                    .message-item {
                        display: flex;
                        justify-content: space-around;
                        .text{
                            flex: 1%;
                        }
                        .count-tag {
                            width: 20px;
                            height: 20px;
                            display: block;
                            color: #f56c6c;
                            border-radius: 50%;
                            font-size: 13px;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
    .sub-board-list{    //el-popover里面的子元素，在页面渲染之后不跟popo在一起，在他外面
        display: flex;
        flex-wrap: wrap;
        .sub-board {
            padding: 0px 10px;
            border-radius: 20px;
            margin-right: 10px;
            background: rgb(239, 239, 239);
            border: 1px solid #ddd;
            color: rgb(119, 118, 118);
            margin-top: 10px;
            cursor: pointer;
        }
        .sub-board:hover{
            color:var(--link)
        }
        .active {
            background: var(--link);
            color: #fff;
        }
        .active:hover {
            color:#fff
        }
    }
    .body-content {
        margin-top: 60px;
        position: relative;
        min-height: calc(100vh - 210px);       
    }

    // 铃铛下拉框样式
    .message-item {
        display: flex;
        justify-content: space-around;
        .text{
            flex: 1%;
        }
        .count-tag {
            height: 15px;
            line-height: 15px;
            min-width: 20px;
            display: inline-block;
            background-color: #f56c6c;
            border-radius: 10px;
            font-size: 13px;
            text-align: center;
            color: #fff;
            margin-left: 10px;
        }
    }
    .footer {
        background: #e9e9e9;
        height: 140px;
        margin-top: 10px;
        .footer-content {
            margin: 0 auto;
            padding-top: 10px;
            .item {
                text-align: left;
                .title {
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                a{
                    font-size: 14px;
                    text-decoration: none;
                    color: var(--text2);
                    line-height: 25px;
                }
            }
            .logo{
                .logo-letter{
                    font-size: 30px;
                }
                .info {
                    margin-top: 10px;
                    color: rgb(93, 91, 91);
                }
            }
        }
    }
</style>
