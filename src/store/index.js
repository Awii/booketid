import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    step: 1,
    checked: null,
    bookingTime: null,
    servicesDuration: null,
    success: null
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
    }
  },
  actions: {},
  modules: {}
});
