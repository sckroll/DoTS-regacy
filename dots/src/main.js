import Vue from 'vue'
// import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api'
// const BASE_URL = '/api'    // 실제 서비스 사용 시

Vue.config.productionTip = false
Vue.prototype.$http = axios.create({
  baseURL: BASE_URL
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
