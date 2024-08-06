<template>
    <div class="cover-upload">
        <el-upload
            name="file" 
            :show-file-list="false"
            accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
            :multiple="false"
            :http-request="uploadImg">
            <div class="cover-upload-btn">
                <template v-if="localFile">
                    <img :src="localFile">
                </template>
                <template v-else>
                    <img :src="(imageUrlPrefix ? imageUrlPrefix : proxy.globalInfo.imageUrl) + modelValue.imageUrl" v-if="modelValue &&  modelValue.imageUrl">
                    <span class="iconfont icon-add" v-else></span>
                </template>
            </div>
        </el-upload>
    </div>
</template>

<script setup>

    import {ref,reactive, getCurrentInstance} from "vue";
    import { useRoute,useRouter } from "vue-router";
    const {proxy} = getCurrentInstance(); //取到vm的this，也就是proxy = this,详见Layout.vue 
    const router = useRouter();
    const route = useRoute();

    const props = defineProps({
        imageUrlPrefix:{    //获取的图片，前缀不一样，用于获取头像/封面
            type:String
        },
        modelValue:{
            type:Object,
            default:null
        }
    })

    const emit = defineEmits();
    const localFile = ref(null);
    const uploadImg = async(file) => {
        file = file.file //形参file里面有一个属性file
        let img = new FileReader();
        img.readAsDataURL(file);
        img.onload = ({target}) => {
        localFile.value = target.result;    //预览图片（本地预览，base64）
        }
        emit("update:modelValue",file);
    }


</script>

<style lang="scss" scoped>
    .cover-upload {
        .cover-upload-btn {
            background: rgb(245, 245, 245);
             width: 150px;
             height: 150px;
             display: flex;
             align-items: center;
             justify-content: center;
             .iconfont {
                font-size: 50px;
                color: #ddd;
             }
             img {
                width: 100%;
             }
        }
    }
</style>