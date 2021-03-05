<template>
  <v-stepper-content :step="step">
    <v-sheet
      class="d-flex flex-row justify-space-between align-center grey lighten-4 rounded-pill mx-auto pa-1 mb-6"
      height="38"
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
          size="30"
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
          size="30"
          dense
        ></v-icon>
      </v-btn>
    </v-sheet>

    <v-row
      v-if="!showErrorMsg && loaded"
      class="mb-2 px-0 mx-0"
      justify="center"
    >
      <v-col
        v-for="(hourArray, key, index) in available"
        :key="key"
        class="d-flex flex-column align-center grey lighten-4 grey--text text--darken-3 py-1 px-1"
        :class="[key != 'sunday' ? 'mr-1' : '']"
        style="max-width: 12.8%"
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
          v-for="(hour, i) in hourArray"
          :key="hour"
          class="white"
          :class="[i < hourArray.length - 1 ? 'mb-2' : '']"
          style="width: 100%; min-width: 30px"
          v-bind="btnSize"
          @click="selectTime(hour, index)"
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
        :class="[$vuetify.breakpoint.smAndUp ? 'text-body-1' : 'text-body-2']"
        >{{ errorMsg }}</span
      >
    </div>
  </v-stepper-content>
</template>

<script>
import { db } from "@/plugins/firebaseInit";
import {
  addDays,
  addMinutes,
  addWeeks,
  getDate,
  getISOWeek,
  getMonth,
  getYear,
  startOfWeek
} from "date-fns";

export default {
  name: "StepTwo",
  props: { step: Number, hourlyIncrement: Number },

  data() {
    let today = new Date();
    return {
      weekDays: ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],

      currentWeek: today,
      selectedWeek: today,
      maxWeek: addWeeks(today, this.$store.state.details.weeksToLoad - 1),

      errorMsg: "Ingen timer tilgjengelig.",
      showErrorMsg: false,
      loaded: false
    };
  },

  watch: {
    checked() {
      this.availableHours();
    }
  },

  computed: {
    checked() {
      return this.$store.state.checked;
    },
    weekDescription() {
      return (
        "Uke " +
        getISOWeek(this.selectedWeek) +
        ", " +
        getYear(this.selectedWeek)
      );
    },
    servicesDuration() {
      let length = 0;
      let checked = this.checked;
      if (checked) {
        for (let i in checked) {
          length += parseInt(checked[i].minutes);
        }
      }
      return length;
    },
    weekStart() {
      return startOfWeek(this.selectedWeek, { weekStartsOn: 1 });
    },
    btnSize() {
      let width = window.innerWidth;
      switch (true) {
        case width < 340:
          return { "x-small": true, height: "26px" };
        case width < 520:
          return { small: true, height: "30px" };
        default:
          return { medium: true, height: "36px" };
      }
    }
  },
  methods: {
    incrementWeek(n) {
      this.selectedWeek = addWeeks(this.selectedWeek, n);
      this.availableHours();
    },
    weekAndMonth(days) {
      let date = addDays(this.weekStart, days);
      let dayOfMonth = this.prefixZero(getDate(date));
      let monthOfYear = this.prefixZero(getMonth(date) + 1); // months index from 0
      return dayOfMonth + "." + monthOfYear;
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

      // default opening hours
      const defRef = db
        .collection(`${this.$store.state.details.fbPrefix}_hours`)
        .doc("default");
      // taken hours
      const weekRef = db
        .collection(`${this.$store.state.details.fbPrefix}_hours`)
        .doc(ISOdate);

      weekRef.get().then(weekDoc => {
        defRef.get().then(defDoc => {
          for (let day in defDoc.data()) {
            let hoursArray = [];
            let start = defDoc.data()[day].start;
            let end = defDoc.data()[day].end;
            let duration = this.servicesDuration / 60;
            let intervalsRequired = Math.ceil(duration / this.hourlyIncrement);

            for (
              let hour = start;
              hour <= end - this.hourlyIncrement * intervalsRequired;
              hour += this.hourlyIncrement
            ) {
              if (!weekDoc.data()) {
                hoursArray.push(hour);
              } else {
                let eligibleStart = true;
                // check if future intervals not taken as well
                for (let i = 0; i < intervalsRequired; i++) {
                  if (
                    weekDoc.data()[day] &&
                    weekDoc
                      .data()
                      [day].includes(hour + i * this.hourlyIncrement)
                  ) {
                    eligibleStart = false;
                  }
                }
                if (eligibleStart) {
                  hoursArray.push(hour);
                }
              }
              this.available[day] = hoursArray;
            }
          }
          this.loaded = true;
        });
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
        return "0" + num;
      } else {
        return num;
      }
    },
    selectTime(hour, weekday) {
      // weekday index from 0
      let selectedDay = addDays(this.weekStart, weekday); // monday: 1+0 => 1
      let bookingTime = addMinutes(selectedDay, hour * 60); // float hour to minutes
      this.$store.commit("updateServicesDuration", this.servicesDuration);
      this.$store.commit("updateBookingTime", bookingTime);
      this.$store.commit("updateStep", 3);
    }
  }
};
</script>
