<template>
    <v-md-editor 
        :model-value="modelValue"
        :height="height + 'px'"
        :disabled-menus="[]"
        :include-level="[1,2,3,4,5,6]"
        @upload-image="uploadImageHandler"
        @change="change">

    </v-md-editor>
</template>

<script setup>
    
    import  VMdEditor  from '@kangc/v-md-editor';
    import '@kangc/v-md-editor/lib/style/base-editor.css';
    import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
    import '@kangc/v-md-editor/lib/theme/style/github.css'

    import hljs from 'highlight.js'
    import "highlight.js/styles/atom-one-light.css"

    import {getCurrentInstance} from "vue";
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 

    VMdEditor.use(githubTheme,{
        Hljs:hljs
    })

    const props = defineProps({
        modelValue:{
            type:String,
            default:""
        },
        height:{
            type:Number,
            default:500,
        }
    })

    //触发事件，让父容器收到内容
    const emit = defineEmits();
    const change = (markdownContent,htmlContent) => {
        emit("update:modelValue",markdownContent);  //"update:modelValue"  这个整体我估计算是一个函数
        emit("htmlContent",htmlContent)     //"htmlContent"  这个是一个函数
    }

    //上传图片的函数
    const uploadImageHandler = async (event,insertImage,files) => {
        let result = await proxy.Request({
            url:"/file/uploadImage",
            params:{
                file:files[0],
            }
        })
        debugger;
        if(!result){
            return;
        }

        const url = proxy.globalInfo.imageUrl + result.data.fileName;
        insertImage({
            url:url,
            desc:"图片"
        })
    }

</script>

<style lang="scss" scoped>
</style>
