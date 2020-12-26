<template>
  <div class="site">
    <v-toolbar color="primary">
      <v-container fill-height :style="{ 'max-width': maxWidth }">
        <v-row>
          <v-col cols="4">
            <v-img
              src="@/assets/logo.jpg"
              max-height="40"
              max-width="120"
              contain
            />
          </v-col>
          <v-col cols="4" class="d-flex justify-center">
            <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
          </v-col>
          <v-col cols="4"> </v-col>
        </v-row>
      </v-container>
    </v-toolbar>

    <v-main>
      <v-container :style="{ 'max-width': maxWidth }"> </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  name: "Site",

  data() {
    return {
      title: "Site",
      maxWidth: "550px"
    };
  },

  methods: {
    resizeWidth() {
      var width = (window.innerWidth * 3) / 5;
      if (width > 550) {
        this.maxWidth = width + "px";
      }
    }
  },

  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.resizeWidth, { passive: true });
      this.resizeWidth();
    });
  }
};
</script>
