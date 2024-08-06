<!-- 评论区上传图片,与ImageViewer组件不同的是，那个组件直接在网页中进行预览，而这个组件需要上传图片后才能预览 -->
<template>
   <el-image 
        :initial-index="0"
        :preview-src-list="imgList ? imgList : [src]"
        :src="src"
        hide-on-click-modal
        class="comment-img"
        :zoom-rate="1.2"
        fit="scale-down" 
        loading="lazy">
    </el-image>
</template>

<script setup>
    const props = defineProps({
        src:{
            type:String
        },
        imgList:{
            type:Array
        }
    })
</script>

<style lang="scss" scoped>
    .comment-img {
        width: 80px;
        height: 80px;
        background: #eee;
    }
</style>
