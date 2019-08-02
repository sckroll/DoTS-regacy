import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import restaurantList from './views/restaurant.vue'
import manageRestaurant from './views/manage-restaurant.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/list',
      name: 'restaurantList',
      component: restaurantList
    },
    {
      path: '/manage',
      name: 'manageRestaurant',
      component: manageRestaurant
    }
  ]
})
