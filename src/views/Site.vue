<template>
  <div class="site">
    <NavBar :title="title" :logo="logo" :maxWidth="maxWidth" />

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
    <Footer :kontakt="kontakt" :adresse="adresse" />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
export default {
  name: "Site",
  components: {
    NavBar,
    Footer
  },

  data() {
    return {
      // navbar props
      title: "Site",
      logo: require("@/assets/logo.jpg"),

      // footer props
      kontakt: { nr: "+47 900 45 100", epost: "placeholder@email.com" },
      adresse: ["Stenersgata 1 E", "0050 Oslo"],

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
