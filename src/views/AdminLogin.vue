<template>
  <v-container fluid fill-height>
    <AppHeader />
    <AppDrawer />
    <v-row class="justify-center align-center mx-0">
      <v-col cols="12" style="max-width: 600px">
        <v-card class="elevation-8">
          <v-toolbar dark color="primary darken-1">
            <v-toolbar-title>Administrasjonspanel</v-toolbar-title>
          </v-toolbar>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
            <v-container>
              <v-text-field
                v-model="email"
                prepend-icon="mdi-account-outline"
                autocomplete="email"
                :rules="[
                  v => !!v || 'E-post er påkrevd',
                  v => /.+@.+\..+/.test(v) || 'E-post må være gyldig'
                ]"
                label="E-post"
                required
                validate-on-blur
              >
              </v-text-field>
              <v-text-field
                v-model="password"
                prepend-icon="mdi-lock-outline"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[
                  value => !!value || 'Passord er påkrevd',
                  v => v.length >= 8 || 'Minst 8 tegn'
                ]"
                :type="showPassword ? 'text' : 'password'"
                label="Passord"
                hint="Minst 8 tegn"
                counter
                @click:append="showPassword = !showPassword"
                validate-on-blur
              ></v-text-field>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn type="submit" color="primary darken-1" @click="login()">
                Logg inn</v-btn
              >
              <v-snackbar v-model="snackbar" rounded="lg">
                Feil e-post eller passord.
              </v-snackbar>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import AppDrawer from "@/components/AppDrawer";

export default {
  name: "AdminLogin",

  components: {
    AppHeader,
    AppDrawer
  },

  data() {
    return {
      valid: true,
      email: "",
      password: "",
      showPassword: false
    };
  },

  methods: {
    login() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      });
    }
  },

  computed: {
    snackbar: {
      get() {
        return this.$store.state.snackbar;
      },
      set(value) {
        this.$store.commit("updateSnackbar", value);
      }
    }
  }
};
</script>

<style></style>
