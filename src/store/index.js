import Vue from "vue";
import Vuex from "vuex";
import * as fb from "@/plugins/firebaseInit";
import router from "@/router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    step: 1,
    checked: null,
    bookingTime: null,
    servicesDuration: null,
    success: null,

    user: {},

    snackbar: false
  },
  mutations: {
    updateStep(state, payload) {
      state.step = payload;
    },
    updateChecked(state, payload) {
      state.checked = payload;
    },
    updateBookingTime(state, payload) {
      state.bookingTime = payload;
    },
    updateServicesDuration(state, payload) {
      state.servicesDuration = payload;
    },
    updateSuccess(state, payload) {
      state.success = payload;
    },
    updateUser(state, payload) {
      state.user = payload;
    },
    updateSnackbar(state, payload) {
      state.snackbar = payload;
    }
  },
  actions: {
    async login({ commit }, form) {
      fb.auth
        .signInWithEmailAndPassword(form.email, form.password)
        .then(user => {
          commit("updateUser", user);
          router.push("/dashboard");
        })
        .catch(() => {
          commit("updateSnackbar", true);
        });
    },

    async logout({ commit }) {
      fb.auth.signOut().then(() => {
        commit("updateUser", null);
        router.push("/dashboard/login");
      });
    }
  },
  modules: {}
});
