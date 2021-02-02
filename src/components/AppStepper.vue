<template>
  <v-container :style="{ 'max-width': maxWidth }" class="mt-4">
    <v-stepper v-model="stepper" alt-labels class="elevation-4 rounded-lg">
      <v-stepper-header>
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
        <StepOne :step="1" :services="services" />
        <StepTwo :step="2" :hourlyIncrement="hourlyIncrement" />
        <StepThree
          :step="3"
          :location="location"
          :hourlyIncrement="hourlyIncrement"
        />
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
@media only screen and (min-width: 480px) {
  .v-stepper__label {
    display: flex !important;
  }
}

@media only screen and (max-width: 599px) {
  .v-stepper__content {
    padding: 12px 8px;
  }
}

@media only screen and (max-width: 359px) {
  .v-stepper__content {
    padding: 10px 4px;
  }
  .container {
    padding: 8px;
  }
}
</style>
