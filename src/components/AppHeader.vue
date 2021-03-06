<template>
  <v-app-bar
    v-if="sitePath"
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
            {{ siteTitle }}
          </v-toolbar-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col sm="auto" class="d-flex flex-row">
          <v-tabs class="d-flex justify-end">
            <v-tab to="/settings" v-if="isAuth">
              <v-icon class="mdi mdi-cogs pr-2" aria-hidden="true" dense>
              </v-icon>
              Innstillinger
            </v-tab>
            <v-tab :to="this.sitePath">
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
          <div style="width: 48px; min-width: 48px; max-width: 48px">
            <v-btn icon @click="logout()" v-if="isAuth">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { auth } from "@/plugins/firebaseInit";
import users from "@/users.js";
export default {
  name: "AdminHeader",

  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  },

  computed: {
    sitePath() {
      if (auth.currentUser) {
        return "/" + users[auth.currentUser.uid].fbPrefix;
      } else if (this.$store.state.details) {
        return this.$store.state.details.path;
      } else {
        return false;
      }
    },
    isAuth() {
      return !!auth.currentUser;
    },
    siteTitle() {
      if (auth.currentUser) {
        return users[auth.currentUser.uid].title;
      } else if (this.$store.state.details) {
        return this.$store.state.details.title;
      } else {
        return "";
      }
    },
    fbPrefix() {
      return users[auth.currentUser.uid].fbPrefix;
    }
  },

  mounted() {
    if (this.isAuth) {
      if (!this.$store.state.details.path) {
        this.$store.commit("updateSiteDetails", {
          ...this.$store.state.details,
          path: "/" + this.fbPrefix
        });
      }
    }
  }
};
</script>

<style>
.v-tabs-bar__content {
  width: 100%;
}
</style>
