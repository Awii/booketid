<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",

  watch: {
    $route: {
      immediate: true,
      handler(to) {
        document.title = to.meta.title || "Booketid";
        this.$store.commit("resetState");
        this.$store.commit("updateDrawer", false);
      }
    }
  }
};
</script>
