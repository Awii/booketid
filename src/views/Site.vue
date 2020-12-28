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
      <v-container :style="{ 'max-width': maxWidth }" class="mt-4">
        <v-stepper v-model="stepper" alt-labels>
          <v-stepper-header>
            <template v-for="(step, index) in steps">
              <v-stepper-step
                :key="index"
                :complete="stepper > index + 1"
                :step="index + 1"
              >
                {{ step }}
              </v-stepper-step>
              <v-divider
                :key="step"
                v-if="index !== steps.length - 1"
              ></v-divider>
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <template v-for="(step, index) in steps">
              <v-stepper-content :key="index" :step="index + 1">
                <v-card
                  class="mb-12"
                  color="grey lighten-1"
                  height="200px"
                ></v-card>
                <v-btn
                  color="primary"
                  @click="
                    index == steps.length - 1
                      ? (stepper = index - 2)
                      : (stepper = index + 2)
                  "
                >
                  Continue
                </v-btn>
              </v-stepper-content>
            </template>
          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-main>

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
                <div class="text-body-2 ml-2">+47 900 45 100</div>
              </div>
              <div class="d-flex flex-row align-center">
                <v-icon
                  class="mdi mdi-email"
                  color="white"
                  aria-hidden="true"
                  small
                  dense
                ></v-icon>
                <div class="text-body-2 ml-2">placeholder@email.com</div>
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
                  <div>Stenersgata 1 E</div>
                  <div>0050 Oslo</div>
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
  </div>
</template>

<script>
export default {
  name: "Site",

  data() {
    return {
      title: "Site",
      maxWidth: "550px",
      stepper: 1,
      steps: ["Tjeneste", "Tidspunkt", "Personalia", "Bekreftelse"]
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
