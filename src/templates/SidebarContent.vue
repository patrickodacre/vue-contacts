<template>
    <v-app footer light id="mainWrapper">
        <v-navigation-drawer persistent v-model="drawer" light enable-resize-watcher>
            <v-list dense>
                <div v-for="link in links" @click="goTo(link.route)" :key="link.route">
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                <v-icon>{{link.icon}}</v-icon>
                                <span>{{link.text}}</span>
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </div>
            </v-list>
            <!--<router-view name="sidebar"></router-view>-->
        </v-navigation-drawer>
    
        <v-toolbar dark :class="config.color">
            <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <!--<v-btn icon slot="activator" light>
                    <v-icon>more_vert</v-icon>
                </v-btn>-->
            <v-spacer></v-spacer>
            <v-btn icon class="hidden-md-and-up">
                <v-icon>more_vert</v-icon>
            </v-btn>
            <v-toolbar-items class="hidden-sm-and-down">
                <v-btn flat v-for="link in headerLinks" @click.native="goTo(link.route)" :key="link.route">{{link.text}}</v-btn>
            </v-toolbar-items>
        </v-toolbar>
    
        <main>
    
            <v-container fluid>
                <!--v-router-->
                <router-view name="content"></router-view>
            </v-container>
    
        </main>
        
        <v-footer class="indigo">
            <span>&copy; 2017</span>
        </v-footer>
    </v-app>
</template>
<script>
import config from '../config/config'
export default {
    name: 'SidebarContentWrap',
    data() {
        return {
            dialog: false,
            drawer: true,
            config,
            links: config.sidebarMenu,
            title: config.toolbarTitle,
            headerLinks: config.headerLinks
        }
    },
    mounted() {
        console.log('SidebarContentWrap Loaded')
    },
    methods: {
        goTo(routeName) {
            this.$router.push({ name: routeName })
        },
    }
}
</script>
<style lang="scss">
.list__tile__title {
    display: flex;
    align-items: center;

    .material-icons {
        margin-right: 1rem;
    }
}
</style>

