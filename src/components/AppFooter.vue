<template>
  <v-footer color="secondary" padless absolute app>
    <v-container>
      <v-row align="center" no-gutters>
        <v-col class="d-flex justify-center pa-4">
          <div class="d-flex flex-column white--text">
            <h4 class="pb-2">Kontakt oss</h4>

            <div class="d-flex flex-row align-center">
              <v-icon
                class="mdi mdi-phone"
                color="white"
                aria-hidden="true"
                small
                dense
              ></v-icon>
              <span class="text-body-2 ml-2">{{ contact.number }}</span>
            </div>
            <div class="d-flex flex-row align-center">
              <v-icon
                class="mdi mdi-email"
                color="white"
                aria-hidden="true"
                small
                dense
              ></v-icon>
              <span class="text-body-2 ml-2">{{ contact.email }}</span>
            </div>
          </div>
        </v-col>

        <v-col class="d-flex justify-center pa-4">
          <div class="d-flex align-start flex-column white--text">
            <h4 class="pb-2">Besøk oss</h4>

            <div class="d-flex flex-row align-start">
              <v-icon
                class="mdi mdi-map-marker"
                color="white"
                aria-hidden="true"
                small
                dense
              ></v-icon>
              <div class="text-body-2 ml-2 d-flex flex-column">
                <span v-for="a in address" :key="a">{{ a }}</span>
              </div>
            </div>
          </div>
        </v-col>

        <v-col class="d-flex justify-center pa-4">
          <div class="d-flex align-start flex-column white--text">
            <!--<h4 class="pb-2">Følg oss</h4>-->

            <div class="d-flex flex-row">
              <v-icon
                class="mdi mdi-facebook pr-1"
                color="white"
                aria-hidden="true"
                large
              ></v-icon>
              <v-icon
                class="mdi mdi-instagram pr-1"
                color="white"
                aria-hidden="true"
                large
              ></v-icon>
              <v-icon
                class="mdi mdi-twitter pr-1"
                color="white"
                aria-hidden="true"
                large
              ></v-icon>
              <v-icon
                class="mdi mdi-linkedin pr-1"
                color="white"
                aria-hidden="true"
                large
              ></v-icon>
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
  props: { contact: Object, address: Array }
};
</script>

<style></style>
