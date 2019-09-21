import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('userToken')
  },
  getters: {},
  mutations: {
    getToken (state) {
      state.token = localStorage.getItem('userToken')
    },
    deleteToken (state) {
      localStorage.removeItem('userToken')
      state.token = null

      localStorage.removeItem('prevURL')
      localStorage.removeItem('currURL')
      
      const extensionId = 'jpiagnpijljkijffgaidojpebhmijljc'
      chrome.runtime.sendMessage(extensionId, { userToken: '' }, response => {
        console.log(response.result)
      })
    }
  },
  actions: {}
})
