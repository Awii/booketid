import Vue from "vue";
import Vuex from "vuex";
import * as fb from "@/plugins/firebaseInit";
import router from "@/router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    step: 1,
    checked: [],
    details: {
      maxWidth: "700px"
    },
    services: null,
    bookingTime: null,
    servicesDuration: null,
    success: null,
    snackbar: false,
    drawer: false
  },
  mutations: {
    updateSiteDetails(state, payload) {
      state.details = payload;
    },
    updateStep(state, payload) {
      state.step = payload;
    },
    updateServices(state, payload) {
      state.services = payload;
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
    updateSnackbar(state, payload) {
      state.snackbar = payload;
    },
    resetState(state) {
      state.step = 1;
      state.checked = [];
    },
    updateDrawer(state, payload) {
      state.drawer = payload;
    }
  },
  actions: {
    async login({ commit }, form) {
      fb.auth
        .signInWithEmailAndPassword(form.email, form.password)
        .then(() => {
          router.push("/dashboard");
        })
        .catch(() => {
          commit("updateSnackbar", true);
        });
    },

    async logout() {
      fb.auth.signOut().then(() => {
        router.push("/dashboard/login");
      });
    }
  },
  modules: {}
});
