<!-- 用于分页，将得到的所有数据传进来，拿到分页相关信息，再将每一条数据通过slot传给父组件，父组件再传给其他子组件（ArticleListItem） -->
<template>
    <!-- “空空如也” -->
    <div v-if="!loading && dataSource.list != null && dataSource.list.length==0">
        <NoData :msg="noDataMsg"></NoData>
    </div>
    <div class="skeleton" v-if="loading">
        <el-skeleton :row="2" animated></el-skeleton>
    </div>
    <div v-for="item in dataSource.list"  :key="item" v-else>
        <slot :data="item" name="mySlot"></slot>
    </div>
    <div class="pagination"> 
        <el-pagination 
            v-if="dataSource.pageTotal > 1"
            :page-size="15"
            background
            :total="dataSource.totalCount"
            :current-page="dataSource.pageNo"
            layout="prev,pager,next"
            @current-change="handlePageNoChange"
            style="text-align: right;">
        </el-pagination>
    </div>
</template>

<script setup>
    const props = defineProps({
        dataSource:{
            type:Object
        },
        loading:{
            type:Boolean //判断数据是否正在加载
        },
        noDataMsg:{
            type:String,
            default:"空空如也"
        }
    })

    const emit = defineEmits(["loadData"])
    const handlePageNoChange = (pageNo) => {
        props.dataSource.pageNo = pageNo;
        emit("loadData")
    }
</script>

<style lang="scss">
    .pagination {
        padding: 10px 0px 10px 10px;
    }
    .skeleton {
        padding: 15px;
    }
</style>
