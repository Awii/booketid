<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    right
    width="288"
    color="grey lighten-5"
  >
    <v-list nav dense>
      <v-list-item-group>
        <v-list-item to="/dashboard">
          <v-list-item-icon>
            <v-icon dense>mdi-account-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Admin</v-list-item-title>
        </v-list-item>

        <v-list-item to="/settings" v-if="isAuth">
          <v-list-item-icon>
            <v-icon dense>mdi-cogs</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Innstillinger</v-list-item-title>
        </v-list-item>

        <v-list-item :to="this.sitePath">
          <v-list-item-icon>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Ny booking</v-list-item-title>
        </v-list-item>

        <v-list-item class="mt-6" v-if="isAuth" @click="logout()">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Logge ut</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { auth } from "@/plugins/firebaseInit";
import users from "@/users.js";

export default {
  name: "AppDrawer",

  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("updateDrawer", val);
      }
    },
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
    }
  },

  methods: {
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style></style>
