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

          <v-row v-if="!showErrorMsg && loaded" class="mb-2" justify="center">
            <v-col
              v-for="(hourArray, key, index) in available"
              :key="key"
              class="d-flex flex-column align-center grey lighten-4 grey--text text--darken-3 pa-1"
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
                v-for="hour in hourArray"
                :key="hour"
                class="white mb-2"
                style="width: 100%; min-width: 30px"
                v-bind="btnSize"
                @click="selectHour(hour, index)"
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

        <v-stepper-content :step="3">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6">
                <v-card-text>
                  <v-text-field
                    v-model="name"
                    autocomplete="name"
                    :rules="[v => !!v || 'Navn er påkrevd']"
                    label="Navn og etternavn"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="email"
                    autocomplete="email"
                    :rules="[
                      v => !!v || 'E-post er påkrevd',
                      v => /.+@.+\..+/.test(v) || 'E-post må være gyldig'
                    ]"
                    label="E-post"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="mobile"
                    autocomplete="tel"
                    :rules="[
                      v => !!v || 'Mobilnummer er påkrevd',
                      v =>
                        (/^\+?\d+$/.test(v) && v.length <= 12) || // 0047{nr}, +47{nr}, {nr}
                        'Mobilnummer må være gyldig'
                    ]"
                    label="Mobilnummer"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="address"
                    autocomplete="address-line1"
                    :rules="[v => !!v || 'Adresse er påkrevd']"
                    label="Adresse"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="postnr"
                    autocomplete="postal-code"
                    :rules="[
                      v => !!v || 'Postnummer er påkrevd',
                      v =>
                        (/^\d+$/.test(v) && v.length <= 4) ||
                        'Postnummer må være gyldig'
                    ]"
                    label="Postnr."
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="poststed"
                    autocomplete="address-level2"
                    :rules="[v => !!v || 'Poststed er påkrevd']"
                    label="Poststed"
                    required
                  ></v-text-field>

                  <v-textarea
                    v-model="extraInfo"
                    label="Ekstra informasjon"
                    rows="2"
                    auto-grow
                  ></v-textarea>

                  <v-checkbox
                    v-if="this.$vuetify.breakpoint.smAndUp"
                    v-model="checkbox"
                    :rules="[
                      v =>
                        !!v ||
                        'Vilkårene må aksepteres for å kunne bekrefte bookingen'
                    ]"
                    label="Jeg aksepterer vilkårene"
                    required
                  ></v-checkbox>
                </v-card-text>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card-text>
                  <div class="text-center text-body-1 font-weight-medium">
                    Oppsummering
                  </div>
                  <v-simple-table dense class="mt-4">
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
                  <div class="mt-6">
                    <v-icon
                      class="mdi mdi-clock-time-four-outline pr-2"
                      aria-hidden="true"
                      medium
                      dense
                    ></v-icon
                    ><span>{{ formattedBookingTime }}</span>
                    <v-icon
                      class="mdi mdi-map-marker pr-2"
                      aria-hidden="true"
                      medium
                      dense
                    ></v-icon>
                    <span>{{ location.join(", ") }}</span>
                  </div>
                  <div class="text-center text-body-2 font-weight-medium mt-8">
                    Vilkår
                  </div>
                  <div class="mt-2" style="white-space: pre-line">
                    {{ terms }}
                  </div>
                  <v-checkbox
                    v-if="this.$vuetify.breakpoint.xsOnly"
                    v-model="checkbox"
                    :rules="[
                      v =>
                        !!v ||
                        'Vilkårene må aksepteres for å kunne bekrefte bookingen'
                    ]"
                    label="Jeg aksepterer vilkårene"
                    required
                  ></v-checkbox>
                </v-card-text>
              </v-col>
            </v-row>
            <div class="d-flex justify-center">
              <v-btn :disabled="!valid" color="primary" @click="validate()">
                Fullfør booking
              </v-btn>
            </div>
          </v-form>
        </v-stepper-content>

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
                  <span class="text-subtitle-2">{{
                    formattedBookingTime
                  }}</span>
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
            <div v-else-if="this.error" class="d-flex flex-column">
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
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script>
import db from "@/plugins/firebaseInit";
import firebase from "firebase/app";
import {
  addDays,
  addMinutes,
  addWeeks,
  format,
  getDate,
  getDay,
  getISOWeek,
  getMonth,
  getYear,
  startOfWeek
} from "date-fns";

import { nb } from "date-fns/locale";

export default {
  name: "AppStepper",
  props: { steps: Array, services: Array, maxWidth: String, location: Array },
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
      bookingTime: null,
      selectedHour: null,
      selectedWeekDay: null,
      hourlyIncrement: 0.5,

      serviceTime: 0,
      errorMsg: "Ingen timer tilgjengelig.",
      showErrorMsg: false,
      loaded: false,

      valid: true,
      name: "",
      email: "",
      mobile: "",
      address: "",
      postnr: "",
      poststed: "",
      extraInfo: "",
      checkbox: false,
      terms:
        "Avbestilling må skje senest 24 timer før avtalt tid.\nVennligst møt opp presist.\nE-post vil bli lagret og brukt til å sende påminnelse før avtalt tid.",
      intervalsRequired: 1,

      success: false,
      error: false
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
    servicesDuration: function() {
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
    },
    btnSize: function() {
      let width = window.innerWidth;
      switch (true) {
        case width < 340:
          return { "x-small": true, height: "26px" };
        case width < 520:
          return { small: true, height: "30px" };
        default:
          return { medium: true, height: "36px" };
      }
    },
    formattedBookingTime: function() {
      if (this.bookingTime) {
        let fBookingTime = format(
          this.bookingTime,
          "dd. MMMM yyyy 'kl.' kk:mm - ",
          { locale: nb }
        );
        let endingHour = format(
          addMinutes(this.bookingTime, this.servicesDuration),
          "kk:mm"
        );
        return fBookingTime + endingHour;
      } else {
        return null;
      }
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
              let start = defDoc.data()[day].start;
              let end = defDoc.data()[day].end;
              let taken = weekDoc.data().taken;
              let hourlyIncrement = this.hourlyIncrement;
              let duration = this.servicesDuration / 60;
              let intervalsRequired = Math.ceil(duration / hourlyIncrement);
              this.intervalsRequired = intervalsRequired;

              for (
                let hour = start;
                hour <= end - hourlyIncrement * intervalsRequired;
                hour += hourlyIncrement
              ) {
                if (!taken) {
                  hoursArray.push(hour);
                } else {
                  let eligibleStart = true;
                  for (let i = 0; i < intervalsRequired; i++) {
                    if (
                      taken[day] &&
                      taken[day].includes(hour + i * hourlyIncrement)
                    ) {
                      eligibleStart = false;
                    }
                  }
                  if (eligibleStart) {
                    hoursArray.push(hour);
                  }
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
    selectHour(hour, weekday) {
      // weekday index from 0
      this.selectedHour = hour;
      this.selectedWeekDay = weekday;
      let selectedDay = addDays(this.weekStart, weekday);
      let bookingTime = addMinutes(selectedDay, hour * 60);
      this.bookingTime = bookingTime;
      this.stepper = 3;
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.stepper = 4;
        // circular

        let weekDays = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday"
        ];

        let week = getISOWeek(this.selectedWeek);
        let year =
          week > 50 && getMonth(this.selectedWeek) == 0
            ? getYear(this.selectedWeek) - 1 // if january and week above 50, use last year's doc ref
            : getYear(this.selectedWeek);
        let ISOdate = String(year + "-W" + week);

        // TODO: handle simultaneous

        const bookingsRef = db
          .collection("site_bookings")
          .doc(ISOdate)
          .collection(weekDays[getDay(this.bookingTime) - 1]);

        const takenRef = db.collection("site_hours").doc(ISOdate);

        bookingsRef
          .add({
            name: this.name,
            email: this.email,
            mobile: this.mobile,
            address: this.address,
            postnr: this.postnr,
            poststed: this.poststed,
            date: this.bookingTime,
            intervals: this.intervalsRequired,
            duration: this.servicesDuration,
            extra: this.extraInfo,
            services: this.checked
          })
          .then(() => {
            let takenArr = [];
            for (let i = 0; i < this.intervalsRequired; i++) {
              takenArr.push(this.selectedHour + i * this.hourlyIncrement);
            }

            takenRef.set(
              {
                taken: {
                  [weekDays[
                    this.selectedWeekDay
                  ]]: firebase.firestore.FieldValue.arrayUnion(...takenArr)
                }
              },
              { merge: true }
            );

            setTimeout(() => {
              this.success = true;
            }, 600);
          })
          .catch(() => {
            setTimeout(() => {
              this.error = true;
            }, 600);
          });
      }
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
