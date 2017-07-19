export default {
    apiRoot: 'http://vuebyexample.com',
    useOauth: false,
    sidebarMenu: [
            {
                route: 'dashboard',
                icon: 'dashboard',
                text: 'Dashboard'
            },
            {
                route: 'contacts',
                icon: 'contacts',
                text: 'Contacts'
            }
        ],
    toolbarTitle: 'My App',

    headerLinks: [
        {
            route: 'dashboard',
            text: 'Dashboard'
        },
        {
            route: 'contacts',
            text: 'Contacts'
        }
    ],

    color: 'green'
} 