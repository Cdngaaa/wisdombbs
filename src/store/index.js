//状态管理
import { createStore } from "vuex";

export default createStore({    //vuex，组件之间共享数据和函数
    state:{ 
        loginUserInfo:null,
        showLogin:false, //当用于操作需要登录才能使用的功能时，展示登录界面，默认不展示
        //板块信息
        boardList:[],
        //当前一级板块
        activePBoardId:0,
        //当前二级板块
        activeBoardId:0,
        messageCountInfo:{},
        //系统设置
        sysSetting:{},
    },
    getters:{   
        getLoginUserInfo(state){
            return state.loginUserInfo
        },
        getBoardList(state){
            return state.boardList;
        },
        getSubBoardList:(state) => (boardId) => {
            let board = state.boardList.find(item => {
                return item.boardId == boardId;
            })
            return board ? board.children : [];
        },
        getActivePBoardId(state){
            return state.activePBoardId;
        },
        getActiveBoardId(state){
            return state.activeBoardId;
        },
        getMessageCountInfo(state){
            return state.messageCountInfo;
        }
    },
    mutations:{ 
        updateLoginUserInfo(state,value){
            state.loginUserInfo =  value;
        },
        showLogin(state,value){
            state.showLogin = value;
        },
        saveBoardList(state,value){
            state.boardList = value;
        },
        setActivePBoardId(state,value){
            state.activePBoardId = value;
        },
        setActiveBoardId(state,value){
            state.activeBoardId = value;
        },
        updateMessageCountInfo(state,value){
            state.messageCountInfo = value;
        },
        readMessage(state,value){
            state.messageCountInfo.total = state.messageCountInfo.total - state.messageCountInfo[value];
            state.messageCountInfo[value] = 0;
        },
        saveSysSetting(state,value){
            state.sysSetting = value;
        }
    },
    actions:{   

    },
    modules:{   

    }
})

