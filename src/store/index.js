import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: null,
    sessionToken: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setSessionToken(state, token) {
      state.sessionToken = token;
    }
  },
  actions: {
    async fetchUser({ commit }) {
      try {
        const response = await axios.get('http://localhost:5000/api/users/user', {
          withCredentials: true // Ensure credentials are sent
        });
        if (response.data.user) {
          commit('setUser', response.data.user);
          commit('setSessionToken', response.data.token); // Ensure token is set
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('sessionToken', response.data.token);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
  },
  getters: {
    user: state => state.user,
    sessionToken: state => state.sessionToken
  }
});
