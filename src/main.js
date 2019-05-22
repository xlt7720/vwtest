import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './assets/less/reset.less'
import './assets/less/base.less'
import './assets/less/index.less'

import api from './api'
Vue.prototype.$api = api

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')