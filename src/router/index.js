import Vue from 'vue';
import Router from 'vue-router';

import index from '@/views/index'  // 可开票订单列表
import createInvoice from '@/views/createInvoice' // 申请发票

Vue.use(Router)
const routes = new Router({
    // mode: 'history',
    base: '/',
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
    routes: [{
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            name: 'index',
            component: index,
        },
        {
            path: '/createInvoice',
            name: 'createInvoice',
            component: createInvoice,
        }
    ]
})

export default routes;