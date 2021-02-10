<template>
  <v-app-bar app absolute color="white">
    <v-container>
      <v-row align="center" justify="start" class="flex-nowrap">
        <v-col>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </v-col>
        <v-col>
          <v-tabs class="d-flex justify-end">
            <v-tab to="/site">
              <v-icon
                class="mdi mdi-pencil-plus-outline pr-2"
                aria-hidden="true"
                dense
              >
              </v-icon>
              Ny booking
            </v-tab>
            <v-tab to="/dashboard/">
              <v-icon
                class="mdi mdi-account-outline pr-2"
                aria-hidden="true"
                dense
              >
              </v-icon>
              Admin
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppHeader",

  props: {
    title: String,
    logo: String,
    maxWidth: String
  }
};
</script>

<style>
.v-tabs-bar__content {
  width: 100%;
}
</style>
