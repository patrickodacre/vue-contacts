<template>
    <div id="mainWrapper">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'MainWrap',
    data() {
        return {
            dialog: false,
            drawer: true
        }
    },
    mounted() {
        console.log('Main Wrap Loaded')
    },
}
</script>
<style lang="scss">

</style>

