<template>
  <!-- elementui的全局配置 -->
  <el-config-provider :locale="locale" :message="config">
    <!-- 所以其实这里的router-view就是为了告诉路由器，一上来的内容就放在这个位置呈现，至于路径的话，谁是“/”，就显示谁 -->
      <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
    import { reactive } from 'vue';
    import zhCn from 'element-plus/es/locale/lang/zh-cn'
    const locale = zhCn;
    const config = reactive({
      max:1,
    })
</script>

<style scoped>

</style>
