<template>
  <v-app-bar
    app
    absolute
    color="white"
    elevation="0"
    style="border-bottom: 1px solid rgba(0,0,0,0.12) !important"
  >
    <v-container class="px-0 px-sm-3">
      <v-row align="center" class="flex-nowrap" no-gutters>
        <v-col v-if="$vuetify.breakpoint.smAndUp" class="mr-2">
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col sm="auto" class="d-flex flex-row">
          <v-tabs class="d-flex justify-end">
            <v-tab to="/settings">
              <v-icon class="mdi mdi-cogs pr-2" aria-hidden="true" dense>
              </v-icon>
              Innstillinger
            </v-tab>
            <v-tab to="/site">
              <v-icon
                class="mdi mdi-pencil-plus-outline pr-2"
                aria-hidden="true"
                dense
              >
              </v-icon>
              Ny booking
            </v-tab>
            <v-tab to="/dashboard">
              <v-icon
                class="mdi mdi-account-outline pr-2"
                aria-hidden="true"
                dense
              >
              </v-icon>
              Admin
            </v-tab>
          </v-tabs>
          <div style="width: 48px !important; max-width: 48px !important">
            <v-btn icon @click="logout()">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: "AdminHeader",

  props: {
    title: String,
    logo: String,
    maxWidth: String
  },

  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style>
.v-tabs-bar__content {
  width: 100%;
}
</style>
