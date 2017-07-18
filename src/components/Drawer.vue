<template>
    <section class="tkDrawer" :class="drawerType">
        <!-- Parent content will go in slot -->
        <slot>Loading...</slot>
    </section>
</template>
<script>
    export default {
        name: 'Drawer',
        props: {
            type: {
                type: String,
                default: 'side' // other = 'mega-nav'
            },
            drawerId: {
                type: String,
                default: ''
            },
            toggle: {
                type: Boolean,
                default: false
            },
            zIndex: {
                type: Number,
                default: 80
            },
            enableSelfClose: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                backDrop: null
            }
        },
        mounted() {
            this.backdrop = document.createElement('div')
            this.backdrop.classList.add('drawer-backdrop')
            this.$el.setAttribute('style', `z-index: ${this.zIndex}` )
            this.$el.classList.add('closedDrawer')
            this.backdrop.setAttribute('style', `z-index: ${this.zIndex - 1}` )

            this.$el.parentElement.classList.add('isDrawerParent')
        },
        computed: {
            drawerType() {
                return {
                    'mainDrawer': this.type === 'side',
                    'megaNav': this.type === 'megaNav',
                }
            }
        },
        watch: {
            toggle: function (open) {
                if (open) {
                    this.openDrawer()
                } else {
                    this.closeDrawer()
                }
            }
        },
        methods: {
            openDrawer() {
                this.$el.classList.remove('closedDrawer')
                this.$el.classList.add('openDrawer')
                this.$emit('drawerOpened')
                this.addBackDrop()
            },
            closeDrawer() {
                this.$el.classList.remove('openDrawer')
                this.$el.classList.add('closedDrawer')
                this.removeBackDrop()
                this.$emit('drawerClosed')
            },
            addBackDrop() {
                //this.$el.after(this.backdrop)
                this.$el.parentNode.appendChild(this.backdrop) // BPRO-9972

                this.backdrop.addEventListener('click', this.closeDrawer)

                if (this.enableVuex) {
                    this.backdrop.addEventListener('click', () => this.$vuex.dispatch(this.dispatchClose))
                }
            },
            removeBackDrop() {
                this.backdrop.remove()
                this.backdrop.removeEventListener('click', this.removeBackDrop)
            },
            selfClose() {
                this.$emit('drawerClosed')
            }
        }
    }
</script>
<style lang="scss">


    $grey_background: #fff;
    @keyframes drawer-enter-top {
        from {
            // opacity: 0;
            transform: translate3d(0, -100%, 0);
        }

        to {
            // opacity: 1;
            transform: none;
        }
    }

    @keyframes drawer-exit-top {
        from {
            // opacity: 1;
        }

        to {
            // opacity: 0;
            transform: translate3d(0, -100%, 0);
        }
    }

    
    @keyframes drawer-enter-right {
        from {
            // opacity: 0;
            transform: translate3d(100%, 0, 0);
        }

        to {
            // opacity: 1;
            transform: none;
        }
    }

    @keyframes drawer-exit-right {
        from {
            // opacity: 1;
        }

        to {
            // opacity: 0;
            transform: translate3d(100%, 0, 0);
        }
    }

    .isDrawerParent {
        overflow: hidden !important;
        position: relative;
    }

    .tkDrawer {
        visibility: hidden;
        padding: 2rem;
        height: 100%;
    }

    .tkDrawer.closedDrawer,
    .tkDrawer.openDrawer {
        top: 0;
    }

    .tkDrawer.openDrawer {
        animation-duration: 300ms;
        animation-fill-mode: both;
        transition-duration: 300ms;
        // box-shadow: $whiteframe-shadow-10dp;
        overflow-y: auto;
        visibility: visible;
        
        > * {
            // opacity: 1;
            visibility: visible;
        }
    }

    .tkDrawer.closedDrawer {
        animation-duration: 300ms;
        animation-fill-mode: both;
        transition-duration: 300ms;
        animation-timing-function: cubic-bezier(.36,.01,1,-0.03);
        overflow: hidden;
        // position: absolute;
        position: fixed;
    }

    /* Mega Nav */

    .megaNav {
        background: $grey_background;
        width: 100%;
        height: 100%;
    }

    .megaNav.closedDrawer,
    .megaNav.openDrawer {

    }

    .megaNav.openDrawer {
        animation-name: drawer-enter-top;
        * {
            // opacity: 1;   
            // transition: opacity 300ms;
        }
    }

    .megaNav.closedDrawer {
        animation-name: drawer-exit-top;
        * {
            // opacity: 0;
            // transition: opacity 6s;
        }
    }

    /* Side Drawer */

    .tkDrawer.mainDrawer {
        background: $grey_background;
        min-width: 200px;
        width: 80%;
        height: 100%;
        right: 0;
        top: 0;
        position: fixed;

        .closeIcon {
            // @include tButton(8, '', true);
            width: 44px;
            display: flex;
            align-items: center;
            justify-content: center;

        }


        @media screen and (min-width: 400px) {
            .closeIcon {
                display: none;
            }
        }
        @media screen and (min-width: 1024px) {

            width: 50%;

            .closeIcon {
                display: none;
            }
        }
    }
    
    .tkDrawer.mainDrawer.closedDrawer,
    .tkDrawer.mainDrawer.openDrawer {

    }

    .tkDrawer.mainDrawer.openDrawer {
        animation-name: drawer-enter-right;
        * {
            // opacity: 1;   
            // transition: opacity 300ms;
        }
    }

        /* position: absolute overwrites the position: fixed which causes overflow: hidden to fail on FF. */
    .tkDrawer.mainDrawer.closedDrawer {
        animation-name: drawer-exit-right;
        // position: absolute;
        
        * {
            // opacity: 0;
            // transition: opacity 6s;
        }
    }

    /* Backdrop Styles */
    .drawer-backdrop {
        background: rgba(0,0,0,0.4);
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        /* make sure background extends over ALL content */
        height: 100%; 
    }

    .drawerHeader {
        h2 {
            font-size: 2rem;
            margin-top: 0;
        }
    }

    h3 {
        font-size: 1.5rem;
    }

    /* Vuetify style helpers: */

    .menu__content {
        z-index: 99;
    }

</style>