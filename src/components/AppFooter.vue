<template>
  <v-footer color="secondary" padless absolute app>
    <v-container :style="{ 'max-width': '800px' }">
      <v-row align="center" no-gutters class="pt-2 pb-4">
        <v-col
          class="d-flex justify-start"
          cols="12"
          sm="4"
          offset-sm="2"
          :class="[this.$vuetify.breakpoint.xsOnly ? 'pt-3 pl-8' : '']"
        >
          <div class="d-flex flex-column white--text">
            <h4 class="pb-2">Kontakt oss</h4>

            <div class="d-flex flex-row align-center">
              <v-icon color="white" small>mdi-phone</v-icon>
              <span class="text-body-2 ml-2">{{ contact.number }}</span>
            </div>
            <div class="d-flex flex-row align-center">
              <v-icon color="white" small>mdi-email</v-icon>
              <span class="text-body-2 ml-2">{{ contact.email }}</span>
            </div>
          </div>
        </v-col>

        <v-col
          class="d-flex justify-start"
          cols="12"
          sm="5"
          offset-sm="1"
          :class="[this.$vuetify.breakpoint.xsOnly ? 'pt-6 pl-8' : 'pl-4']"
        >
          <div class="d-flex align-start flex-column white--text">
            <h4 class="pb-2">Besøk oss</h4>

            <div class="d-flex flex-row align-start">
              <v-icon color="white" small>mdi-map-marker</v-icon>
              <div class="text-body-2 ml-2 d-flex flex-column">
                <span v-for="a in location" :key="a">{{ a }}</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-divider dark class="pt-2"></v-divider>
      <v-row class="ma-0">
        <v-col class="d-flex justify-center">
          <div class="d-flex align-start flex-column white--text">
            <div class="d-flex flex-row">
              <v-btn
                v-if="this.social.facebook"
                icon
                class="mx-1"
                :href="this.social.facebook"
                target="_blank"
              >
                <v-icon color="white" large>mdi-facebook</v-icon>
              </v-btn>

              <v-btn
                icon
                class="mx-1"
                v-if="this.social.instagram"
                :href="this.social.instagram"
                target="_blank"
              >
                <v-icon color="white" large>mdi-instagram</v-icon>
              </v-btn>

              <v-btn
                icon
                class="mx-1"
                v-if="this.social.twitter"
                :href="this.social.twitter"
                target="_blank"
              >
                <v-icon color="white" large>mdi-twitter</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter",
  props: { contact: Object, location: Array, social: Object }
};
</script>

<style></style>
