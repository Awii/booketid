<template>
  <v-stepper-content :step="4">
    <v-sheet
      class="d-flex justify-center align-center"
      style="min-height: 400px"
    >
      <div v-if="this.success" class="d-flex flex-column">
        <v-icon
          class="justify-center mdi mdi-check-circle-outline"
          color="success"
          size="60"
        ></v-icon>

        <div class="d-flex flex-column mt-2">
          <span class="text-body-1 font-weight-medium mt-4">
            Din reservasjon har blitt registrert.
          </span>
          <div class="mt-2">
            <v-icon
              class="mdi mdi-clock-time-four-outline pr-2"
              aria-hidden="true"
              size="18"
              dense
            ></v-icon>
            <span class="text-subtitle-2">{{ formattedBookingTime }}</span>
          </div>
          <div>
            <v-icon
              class="mdi mdi-map-marker pr-2"
              aria-hidden="true"
              size="18"
              dense
            >
            </v-icon>
            <span class="text-subtitle-2">{{ location.join(", ") }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="this.success == false" class="d-flex flex-column">
        <v-icon
          class="justify-center mdi mdi-alert-circle-outline"
          color="error"
          size="60"
        ></v-icon>

        <div class="d-flex flex-column mt-2">
          <span class="text-body-1 font-weight-medium mt-4">
            Noe gikk feil. Vennligst prøv igjen eller kontakt oss.
          </span>
        </div>
      </div>

      <div v-else>
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
    </v-sheet>
  </v-stepper-content>
</template>

<script>
import { format } from "date-fns";
import { addMinutes } from "date-fns";
import { nb } from "date-fns/locale";
export default {
  name: "StepOne",
  props: { step: Number, location: Array },

  computed: {
    success() {
      return this.$store.state.success;
    },
    bookingTime() {
      return this.$store.state.bookingTime;
    },
    formattedBookingTime() {
      if (this.bookingTime) {
        let fBookingTime = format(
          this.bookingTime,
          "dd. MMMM yyyy 'kl.' kk:mm - ",
          {
            locale: nb
          }
        );
        let endingHour = format(
          addMinutes(this.bookingTime, this.$store.state.servicesDuration),
          "kk:mm"
        );
        return fBookingTime + endingHour;
      } else {
        return null;
      }
    }
  }
};
</script>

<style></style>
