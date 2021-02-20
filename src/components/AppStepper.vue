<template>
  <v-container :style="{ 'max-width': maxWidth }" class="mt-4">
    <v-stepper
      v-model="stepper"
      :alt-labels="$vuetify.breakpoint.smAndUp"
      class="elevation-4 rounded-lg"
      :vertical="$vuetify.breakpoint.xsOnly"
    >
      <v-stepper-header v-if="$vuetify.breakpoint.smAndUp">
        <template v-for="(step, index) in steps">
          <v-stepper-step
            :key="index"
            :complete="stepper > index + 1"
            :step="index + 1"
            >{{ step }}
          </v-stepper-step>
          <v-divider :key="step" v-if="index !== steps.length - 1"></v-divider>
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-step
          v-if="$vuetify.breakpoint.xsOnly"
          :step="1"
          :complete="stepper > 1"
        >
          {{ steps[0] }}
        </v-stepper-step>
        <StepOne :step="1" :services="services" />

        <v-stepper-step
          v-if="$vuetify.breakpoint.xsOnly"
          :step="2"
          :complete="stepper > 2"
        >
          {{ steps[1] }}
        </v-stepper-step>
        <StepTwo :step="2" :hourlyIncrement="hourlyIncrement" />

        <v-stepper-step
          v-if="$vuetify.breakpoint.xsOnly"
          :step="3"
          :complete="stepper > 3"
        >
          {{ steps[2] }}
        </v-stepper-step>
        <StepThree
          :step="3"
          :location="location"
          :hourlyIncrement="hourlyIncrement"
        />

        <v-stepper-step
          v-if="$vuetify.breakpoint.xsOnly"
          :step="4"
          :complete="stepper > 4"
        >
          {{ steps[3] }}
        </v-stepper-step>
        <StepFour :step="4" :location="location" />
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import StepOne from "@/components/stepper/StepOne";
import StepTwo from "@/components/stepper/StepTwo";
import StepThree from "@/components/stepper/StepThree";
import StepFour from "@/components/stepper/StepFour";

export default {
  name: "AppStepper",
  components: { StepOne, StepTwo, StepThree, StepFour },
  props: {
    steps: Array,
    services: Array,
    maxWidth: String,
    hourlyIncrement: Number,
    location: Array
  },

  data() {
    return {
      checked: [],

      success: false,
      error: false
    };
  },
  computed: {
    stepper: function() {
      return this.$store.state.step;
    }
  }
};
</script>

<style>
@media only screen and (max-width: 499px) {
  .container {
    padding: 4px;
  }
  .v-stepper__content {
    margin: 0 8px 0 8px !important;
    padding: 12px 0px 0 8px !important;
  }
  .v-stepper--vertical .v-stepper__content {
    border: 0 !important;
  }
  .v-stepper--vertical .v-stepper__step {
    padding: 18px 18px 12px !important;
  }
}

@media only screen and (min-width: 600px) {
  .v-stepper__label {
    display: flex !important;
  }
}
</style>
