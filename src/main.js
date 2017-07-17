// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Router from 'vue-router'
import routes from './routes'
import Vuex from 'vuex'
import {allMutations} from './vuex/mutations'
import {allActions} from './vuex/actions'
import state from './vuex/state'
import Vuetify from 'vuetify'
import httpService from './async/http'
import moment from 'moment'
import numeral from 'numeral'
import {collections} from './packages/collections'
import Vuelidate from 'vuelidate'
import VeeValidate from 'vee-validate';
// import Sortable from 'vue-sortable'

import Sortable from 'sortablejs'

Vue.directive('sortable', {
  inserted: function (el, binding) {
    new Sortable(el, binding.value || {})
  }
})

Vue.use(Vuex)
Vue.use(Router)
Vue.use(Vuetify)
Vue.use(Vuelidate)
Vue.use(VeeValidate)
// Vue.use(Sortable)

const router = new Router({
  mode: 'history',
  routes
})

Object.defineProperty(Vue.prototype, '$http', { value: httpService() })
Object.defineProperty(Vue.prototype, '$moment', { value: moment })
Object.defineProperty(Vue.prototype, '$collect', { value: collections.collect })
Object.defineProperty(Vue.prototype, '$parseDate', {value: date => moment(date, 'YYYY-MM-DD kk-mm-ss')})
Object.defineProperty(Vue.prototype, '$date', {value: date => moment(date, 'YYYY-MM-DD kk-mm-ss').format('MMM D, YYYY')})
Object.defineProperty(Vue.prototype, '$isNumber', { value: val => {
    if (val === null) {
        return false;
    } else if (val === true) {
        return false;
    } else if (val === '') {
        return false;
    } else if (typeof val === "string") {
        val = val.replace(/[^0-9]/g, '');
    }

    val = parseFloat(val);

    return typeof val === "number" && !isNaN(val);
}})

const store = new Vuex.Store({
  state,
  mutations: allMutations,
  actions: allActions
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
