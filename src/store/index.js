import Vue from 'vue'
import Vuex from 'vuex'
import Pusher from "pusher-js";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pusher: {},
    username: window.localStorage.getItem('username')
  },
  mutations: {
    SET_USERNAME: (state, value) => {
      state.username = value;
      window.localStorage.setItem('username', value);
    },
    SET_PUSHER: (state) => {
      if (state.username) {
        state.pusher = new Pusher(process.env.VUE_APP_PUSHER_API_KEY, {
          cluster: process.env.VUE_APP_PUSHER_CLUSTER,
          encrypted: true,
          authEndpoint: process.env.VUE_APP_PUSHER_AUTH_ENDPOINT,
          auth: {
            params: {
              username: state.username
            }
          }
        });
      }
    }
  },
  getters: {
    username: state => {
      return state.username;
    },
    pusher: state => {
      return state.pusher;
    },
  },
  actions: {
    setUsername({commit}, value) {
      commit('SET_USERNAME', value);
    },
    setPusher({commit}) {
      commit('SET_PUSHER');
    }
  }
})
