<template>
  <v-container :style="{ 'max-width': maxWidth }" class="mt-4">
    <v-stepper v-model="stepper" alt-labels class="elevation-4 rounded-lg">
      <v-stepper-header>
        <template v-for="(step, index) in steps">
          <v-stepper-step
            :key="index"
            :complete="stepper > index + 1"
            :step="index + 1"
            >{{ step }}</v-stepper-step
          >
          <v-divider :key="step" v-if="index !== steps.length - 1"></v-divider>
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content :step="1">
          <v-row v-if="services">
            <v-col cols="12" sm="7">
              <v-card
                v-for="(service, index) in services"
                :key="index"
                class="d-flex flex-row justify-space-between rounded align-center px-2 py-1 mb-2"
                style="border: 1px solid #ddd"
              >
                <div class="d-flex flex-column">
                  <span class="text-subtitle-2"> {{ service.title }}</span>
                  <span class="text-body-2">{{ service.subtitle }}</span>
                </div>
                <div
                  class="d-flex flex-row align-center text-no-wrap text-subtitle-2 pl-2 my-n4 mr-n1"
                >
                  <span>{{ service.price }}<small> kr</small></span>
                  <v-checkbox
                    class="pl-1"
                    color="primary darken-2"
                    v-model="checked"
                    :value="service"
                  >
                  </v-checkbox>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="5">
              <div class="d-flex flex-column">
                <div v-if="checked.length">
                  <v-simple-table dense>
                    <thead>
                      <tr>
                        <th>Tjeneste</th>
                        <th>Pris</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in checked" :key="item.name">
                        <td
                          :class="[
                            checked.length > 1
                              ? 'font-weight-medium text-caption'
                              : 'font-weight-bold text-subtitle-2'
                          ]"
                        >
                          {{ item.title }}
                        </td>
                        <td
                          :class="[
                            checked.length > 1
                              ? 'font-weight-medium text-caption'
                              : 'font-weight-bold text-subtitle-2'
                          ]"
                        >
                          {{ item.price }}<small> kr</small>
                        </td>
                      </tr>
                      <tr v-if="checked.length > 1">
                        <th class="text-subtitle-2 font-weight-bold">Totalt</th>
                        <th class="text-subtitle-2 font-weight-bold">
                          {{ sum }}<small> kr</small>
                        </th>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </div>
                <div v-else>
                  <div class="text-subtitle-2 text-center">
                    Vennligst legg til tjenester for å fortsette.
                  </div>
                </div>
                <div class="d-flex justify-center mb-2 mt-4 mx-4">
                  <v-btn
                    block
                    color="primary"
                    elevation="2"
                    :disabled="!checked.length"
                    @click="
                      stepper = 2;
                      availableHours();
                    "
                    >Neste
                    <span class="text-h5 pl-1" style="margin-bottom: 3px"
                      >&#8250;</span
                    ></v-btn
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content :step="2">
          <v-sheet
            class="d-flex flex-row justify-space-between align-center grey lighten-4 rounded-pill mx-auto pa-1 mb-6"
            height="40"
            elevation="2"
            shaped
            width="92%"
          >
            <v-btn
              icon
              :disabled="selectedWeek <= currentWeek ? true : false"
              @click="incrementWeek(-1)"
            >
              <v-icon
                class="justify-center mdi mdi-arrow-left-drop-circle-outline transparent ma-1"
                large
                dense
              ></v-icon>
            </v-btn>
            <span class="font-weight-medium grey--text text--darken-3">{{
              weekDescription
            }}</span>
            <v-btn
              icon
              :disabled="selectedWeek >= maxWeek ? true : false"
              @click="incrementWeek(1)"
            >
              <v-icon
                class="justify-center mdi mdi-arrow-right-drop-circle-outline transparent ma-1"
                large
                dense
              ></v-icon>
            </v-btn>
          </v-sheet>

          <v-row v-if="!showErrorMsg && loaded" class="mb-2" justify="center">
            <v-col
              v-for="(hourArray, key, index) in available"
              :key="key"
              class="d-flex flex-column align-center grey lighten-3 grey--text text--darken-3 pa-1"
              :class="[key != 'sunday' ? 'mr-1' : '']"
              style="max-width: 12%"
              :style="[
                key == 'monday' ? { 'border-radius': '8px 0px 0px 8px' } : '',
                key == 'sunday' ? { 'border-radius': '0px 8px 8px 0px' } : ''
              ]"
            >
              <div
                class="d-flex flex-column align-center text-subtitle-2 mb-2"
                style="width: 100%"
              >
                <div>
                  {{
                    $vuetify.breakpoint.smAndUp
                      ? weekDays[index] + "dag"
                      : weekDays[index]
                  }}
                </div>
                <div>{{ weekAndMonth(index) }}</div>
              </div>
              <v-btn
                elevation="0"
                v-for="(hour, index) in hourArray"
                :key="hour"
                class="white text-button"
                style="width: 100%; min-width: 12px; padding: 0px; max-height: 32px"
                :class="[index < hourArray.length - 1 ? 'mb-1' : '']"
                @click="selectedHour(hour)"
              >
                {{ formatNumberToHours(hour) }}
              </v-btn>
            </v-col>
          </v-row>
          <div
            v-else-if="showErrorMsg && loaded"
            class="d-flex justify-center grey lighten-3 rounded-pill mx-8 py-3"
          >
            <span
              class="font-weight-medium"
              :class="[
                $vuetify.breakpoint.smAndUp ? 'text-body-1' : 'text-body-2'
              ]"
              >{{ errorMsg }}</span
            >
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import db from "@/plugins/firebaseInit";
import {
  addDays,
  addWeeks,
  getDate,
  getISOWeek,
  getMonth,
  getYear,
  startOfWeek
} from "date-fns";

export default {
  name: "AppStepper",
  props: { steps: Array, services: Array, maxWidth: String },
  data() {
    let today = new Date();
    return {
      stepper: 1,
      checked: [],
      available: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      },
      weekDays: ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
      today: today,
      currentWeek: today,
      selectedWeek: today,
      maxWeek: addWeeks(today, 3),

      serviceTime: 0,
      errorMsg: "Ingen timer tilgjengelig.",
      showErrorMsg: false,
      loaded: false
    };
  },
  computed: {
    sum: function() {
      let val = 0;
      this.checked.forEach(e => {
        val += parseInt(e.price);
      });
      return val;
    },
    weekDescription: function() {
      return (
        "Uke " +
        getISOWeek(this.selectedWeek) +
        ", " +
        getYear(this.selectedWeek)
      );
    },
    servicesLength: function() {
      let length = 0;
      if (this.checked.length) {
        for (let i in this.checked) {
          length += parseInt(this.checked[i].minutes);
        }
      }
      return length;
    },
    weekStart: function() {
      return startOfWeek(this.selectedWeek, { weekStartsOn: 1 });
    }
  },
  methods: {
    incrementWeek: function(n) {
      this.selectedWeek = addWeeks(this.selectedWeek, n);
      this.availableHours();
    },
    weekAndMonth: function(days) {
      let date = addDays(this.weekStart, days);
      return (
        this.prefixZero(getDate(date)) +
        "." +
        this.prefixZero(parseInt(getMonth(date) + 1))
      );
    },
    availableHours() {
      this.showErrorMsg = false;
      this.loaded = false;

      // reinstantiate array
      this.available = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      };

      let week = getISOWeek(this.selectedWeek);
      let year =
        week > 50 && getMonth(this.selectedWeek) == 0
          ? getYear(this.selectedWeek) - 1 // if january and week above 50, use last year's doc ref
          : getYear(this.selectedWeek);
      let ISOdate = String(year + "-W" + week);

      const defRef = db.collection("site_hours").doc("default");
      const weekRef = db.collection("site_hours").doc(ISOdate);

      weekRef.get().then(weekDoc => {
        if (weekDoc.exists && !weekDoc.data().closed) {
          defRef.get().then(defDoc => {
            for (let day in defDoc.data()) {
              let hoursArray = [];
              for (
                let hour = defDoc.data()[day].start;
                hour < defDoc.data()[day].end;
                hour += 0.5
              ) {
                if (weekDoc.data().taken) {
                  var takenHours = weekDoc.data().taken[day];
                }
                if (takenHours && !takenHours.includes(hour)) {
                  hoursArray.push(hour);
                } else if (!takenHours) {
                  hoursArray.push(hour);
                }
              }
              this.available[day] = hoursArray;
            }
            this.loaded = true;
          });
        } else {
          this.showErrorMsg = true;
          this.loaded = true;
        }
      });
    },
    formatNumberToHours(input) {
      let hours = Math.floor(input);
      if (hours < 10) hours = "0" + hours;
      let minutes = (input * 60) % 60;
      if (minutes < 10) minutes = "0" + minutes;
      return hours + ":" + minutes;
    },
    prefixZero(num) {
      if (num < 10 && num > 0) {
        return "0" + String(num);
      } else {
        return num;
      }
    },
    selectedHour(hour) {
      this.bookingTime = hour;
    }
  }
};
</script>

<style scoped>
@media only screen and (min-width: 480px) {
  .v-stepper__label {
    display: block !important;
  }
}

@media only screen and (max-width: 599px) {
  .v-stepper__content {
    padding: 16px 6px;
  }
}
</style>
