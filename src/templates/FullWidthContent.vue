<template>
    <v-app>
        <main>
            <v-container fluid>
                <router-view name="content"></router-view>
            </v-container>
        </main>
        <v-footer class="indigo">
            <span>&copy; 2017</span>
        </v-footer>
    </v-app>
</template>
<script>
export default {
    name: 'FullWidthContent',
    data() {
        return {}
    },
    mounted() {
        console.log('FullWidthContent Loaded')
    }
}
</script>
<style lang="scss">

</style>