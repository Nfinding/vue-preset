import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  <%_ if (!InputOptions.historyRouter) { _%>
    mode: 'hash',
  <%_ } else { _%>
    mode: 'history',
  <%_ } _%>
  scrollBehavior: () => ({ y: 0 }),
  routes:[
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ]
})

export default router
