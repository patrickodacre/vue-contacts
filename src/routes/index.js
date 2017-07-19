import SidebarContent from '@/templates/SidebarContent.vue'
import FullWidthContent from '@/templates/FullWidthContent.vue'
import Main from '@/templates/Main.vue'
import Home from '@/route-views/Home.vue'
import Contacts from '@/route-views/Contacts.vue'
import Dashboard from '@/route-views/Dashboard.vue'
import App from '../App.vue'

const Foo = { template: `<div>Sidebar</div>`}

const routes = [{
    path: '/',
    component: Main,
    children: [
            // {
            //     path: '/',
            //     component: FullWidthContent,
            //     children: [
            //         {
            //             path: '/',
            //             name: 'home',
            //             components: {
            //                 content: Home
            //             }
            //         }
            //     ]
            // },
            {
                path: '/',
                // name: 'dashboard',
                component: SidebarContent,
                children: [
                    {
                        path: 'dashboard',
                        name: 'dashboard',
                        components: {
                            sidebar: Foo,
                            content: Dashboard
                        }
                    },
                    {
                        path: 'contacts',
                        name: 'contacts',
                        components: {
                            sidebar: Foo,
                            content: Contacts
                        }
                    }
                ]
            },
            
        ]
    },
]

export {routes as default}