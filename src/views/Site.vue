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
<<<<<<< HEAD
                :key="index"
=======
                :key="step"
>>>>>>> 2d5645ba8baa36c1c904ae0ecc75744cb3101b5d
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
