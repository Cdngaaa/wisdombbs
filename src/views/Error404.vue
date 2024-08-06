<template>
    <div class="error">
        <div class="info">404</div>
        <router-link to="/" class="a-link">返回首页</router-link>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    .error {
        padding-top: 200px;
        text-align: center;
        .info {
            font-size: 100px;
            color: rgb(26, 149, 231);
        }
    }
</style>
