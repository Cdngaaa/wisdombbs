<!-- 头像组件 -->
 <template>
   <!--       :zoom-rate="1.2"  :图片预览 -->
   <div class="avatar"  :style="{width:width + 'px' , height : width + 'px' , 'border-radius' : width/2 + 'px'}">
      <el-image 
      v-if="userId"  
      :style="{width:width + 'px' , height : width + 'px' , 'border-radius' : width/2 + 'px'}" 
      :src="proxy.globalInfo.avatarUrl+userId"
      fit="scale-down" loading="lazy"
      @click="goToUcenter">
      </el-image>
      <div v-else class="no-login">未登录</div>
   </div>
 </template>
 
 <script setup>
   import {getCurrentInstance} from "vue";
   import {useRouter } from "vue-router";
   const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
   const router = useRouter();



   const props = defineProps({   //props属性，由父组件传给子组件
      userId:{
         type:String,
      },
      width:{
         type:Number,
         default:60
      },
      addLink:{   //点击头像是否发生跳转
         type:Boolean,
         default:true
      },
   })

   const goToUcenter = () => {
      if(props.addLink){
         router.push("/user/"+proxy.userId); //跳转到那个用户的身上  用户中心
      }
   }

 </script>
 
 <style lang="scss" scoped>
   .avatar{
      cursor: pointer;
      display: flex;
      background: #f0f0f0;
      align-items: center;
      overflow: hidden;
      .no-login {
         width: 100%;
         text-align: center;
         font-size: 13px;
      }
   }
 </style>
 