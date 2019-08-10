import Vue from 'vue';
import Router from 'vue-router';
// import restaurantList from './views/restaurant.vue'
// import manageRestaurant from './views/manage-restaurant.vue'
import Index from './IndexPage.vue';
import ShowPage from './ShowPage.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/list',
    //   name: 'restaurantList',
    //   component: restaurantList
    // },
    // {
    //   path: '/manage',
    //   name: 'manageRestaurant',
    //   component: manageRestaurant
    // }
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/result',
      name: 'show',
      component: ShowPage
    }
  ]
})
