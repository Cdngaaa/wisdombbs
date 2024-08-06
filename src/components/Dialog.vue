<!-- 对话框组件，其他组件都很大概率用到这个组件 -->
<template>
  <div>
    <!-- 
       model-value:是否展示对话框  展示关闭按钮、可拖拽、点击空白处关闭    class：自定义类名
       @close是el-dialog本身的自定义事件，触发我们自己定义的click“close”事件              :before-close="handleClose"
    -->
        <el-dialog
            :model-value="show"
            :show-close="showClose"
            :draggable="true"
            :close-on-click-modal="false"
            :title="title"
            class="cust-dialog"
            :width="width"
            :top="top"
            @close="close"
            >
            <!-- 这里是登录注册主体部分 -->
            <div class="dialog-body">
                <!-- slot：让父组件可以传东西进来 -->
                <slot></slot>
            </div>
            <!-- 这个template不是插槽，这是想里面的东西整体出现或消失 -->
            <template v-if="buttons&&buttons.length>0 || showCancel">
                <div class="dialog-footer">
                    <el-button link @click="close" v-if="showCancel">取消</el-button>
                    <!-- buttons由外部传进来，可能会传进来多个btn，类型type、事件click、内容text 都由外部传进来   -->
                    <el-button v-for="(btn,index) in buttons" :type="btn.type" :key="index" @click="btn.click">
                        {{btn.text}}
                    </el-button>
                </div>
            </template>
        
        </el-dialog>
  </div>
</template>

<script setup>
    const props = defineProps({ //vue3中定义props配置项
        show:{      //model-view 可以用于props传进来的数据
            type:Boolean, //show是从父组件传过来的
            default:true
        },
        title:{
            type:String,
            default:"标题"
        },
        showClose:{ //是否显示关闭按钮
            type:Boolean,
            default:true
        },
        width:{
            type:String,
            default:"30%"
        },
        top:{   //距离顶部的距离
            type:String,
            default:"50px"
        },
        buttons:{
            type:Array
        },
        showCancel:{    //展示取消按钮，有些对话框不需要展示这个取消按钮
            type:Boolean,
            default:true
        }
    })
    /* 
        总流程：子组件点击click（“close”）事件，触发父组件的自定义close事件，父组件回调响应
    */
    const emit = defineEmits(["close"]);//定义emit，用于触发自定义事件
    const close = () => {   //这是一个点击事件，点击"取消"按钮，这个才是子组件本身的click事件
        emit("close");  //这里是绑定触发父组件传过来的自定义事件"close"，而不是本身的click事件
    }
</script>

<style lang="scss" >
    .cust-dialog {
        margin-bottom: 10px;
        .el-dialog__body{
            padding: 0px;
        }
        .dialog-body{
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 15px;
            min-height: 100px;
            max-height: calc(100vh - 220px);    
            overflow: auto;
        }
        .dialog-footer{
            text-align: right;
            padding: 10px 20px;
        }

    }
</style>
