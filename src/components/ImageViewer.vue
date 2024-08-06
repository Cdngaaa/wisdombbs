<!-- 图片预览 -->
<template>
  <div class="image-viewer">
    <!-- 初始化时显示第几张图 -->
    <el-image-viewer 
        :initial-index="previewImgIndex" 
        :url-list="imageList"
        hide-on-click-modal 
        @close="closeImgViewer"
        v-if="previewImgIndex != null">
    </el-image-viewer>
  </div>
</template>

<script setup>
    
    import { ref } from 'vue';

    const props = defineProps({
        imageList:{
            type:Array,
        }
    })

    const previewImgIndex = ref(null);
    const show = (index) => {
        stopScroll();
        previewImgIndex.value = index;
    }
    defineExpose({show});


    const closeImgViewer = () => {
        startScroll();
        previewImgIndex.value = null;
    }

    const stopScroll = () => {
        document.body.style.overflow = "hidden";
    }
    const startScroll = () => {
        document.body.style.overflow = "auto";
    }


</script>

<style lang="scss" scoped>
</style>
