<template>
    <div class="app-main">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: "layout",
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
.app-main {
    height: 100%;
    width: 100%;
}
</style>



