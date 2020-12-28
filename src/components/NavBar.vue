<template>
  <v-toolbar color="primary">
    <v-container fill-height :style="{ 'max-width': maxWidth }">
      <v-row>
        <v-col cols="4">
          <v-img :src="logo" max-height="40" max-width="120" contain />
        </v-col>
        <v-col cols="4" class="d-flex justify-center">
          <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        </v-col>
        <v-col cols="4"> </v-col>
      </v-row>
    </v-container>
  </v-toolbar>
</template>

<script>
export default {
  name: "NavBar",
  props: ["title", "logo", "maxWidth"]
};
</script>

<style></style>
