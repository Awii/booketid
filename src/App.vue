<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",

  watch: {
    $route() {
      this.$store.commit("resetState");
    }
  }
};
</script>
