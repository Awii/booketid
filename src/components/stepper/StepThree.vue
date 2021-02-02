<template>
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
              <div class="d-flex flex-row">
                <v-icon
                  class="mdi mdi-clock-time-four-outline pr-2"
                  aria-hidden="true"
                  medium
                  dense
                ></v-icon
                ><span>{{ formattedBookingTime }}</span>
              </div>
              <div class="d-flex flex-row">
                <v-icon
                  class="mdi mdi-map-marker pr-2"
                  aria-hidden="true"
                  medium
                  dense
                ></v-icon>
                <span>{{ location.join(", ") }}</span>
              </div>
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
</template>

<script>
import db from "@/plugins/firebaseInit";
import firebase from "firebase/app";
import {
  addMinutes,
  format,
  getDay,
  getHours,
  getISOWeek,
  getMinutes,
  getMonth,
  getYear
} from "date-fns";
import { nb } from "date-fns/locale";

export default {
  name: "StepThree",
  props: { step: Number, location: Array, hourlyIncrement: Number },

  data() {
    return {
      checked: [],

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
        "Avbestilling må skje senest 24 timer før avtalt tid.\nVennligst møt opp presist.\nE-post vil bli lagret og brukt til å sende påminnelse før avtalt tid."
    };
  },

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$store.commit("updateStep", 4);
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

        let week = getISOWeek(this.bookingTime - 1);
        let year =
          week > 50 && getMonth(this.bookingTime) == 0
            ? getYear(this.bookingTime) - 1 // if january and week above 50, use last year's doc ref
            : getYear(this.bookingTime);
        let ISOdate = String(year + "-W" + week);

        const bookingsRef = db
          .collection("site_bookings")
          .doc(ISOdate)
          .collection(weekDays[getDay(this.bookingTime) - 1]);

        const takenRef = db.collection("site_hours").doc(ISOdate);

        takenRef.get().then(doc => {
          let takenHours = doc.data().taken[
            weekDays[getDay(this.bookingTime) - 1]
          ];
          if (takenHours) {
            for (let i in takenHours) {
              if (this.bookingTimes.includes(takenHours[i])) {
                setTimeout(() => {
                  this.$store.commit("updateSuccess", false);
                }, 600);
                return;
              }
            }
          }

          bookingsRef
            .add({
              name: this.name,
              email: this.email,
              mobile: this.mobile,
              address: this.address,
              postnr: this.postnr,
              poststed: this.poststed,
              date: this.bookingTime,
              duration: this.$store.state.servicesDuration,
              extra: this.extraInfo,
              services: this.$store.state.checked
            })
            .then(() => {
              takenRef.set(
                {
                  taken: {
                    [weekDays[
                      getDay(this.bookingTime) - 1
                    ]]: firebase.firestore.FieldValue.arrayUnion(
                      ...this.bookingTimes
                    )
                  }
                },
                { merge: true }
              );

              setTimeout(() => {
                this.$store.commit("updateSuccess", true);
              }, 600);
            })
            .catch(() => {
              setTimeout(() => {
                this.$store.commit("updateSuccess", false);
              }, 600);
            });
        });
      }
    }
  },
  computed: {
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
    },
    bookingTimes() {
      let takenArr = [];
      let intervalsRequired = Math.ceil(
        this.$store.state.servicesDuration / 60 / this.hourlyIncrement
      );
      let hour = getHours(this.bookingTime) + getMinutes(this.bookingTime) / 60;

      for (let i = 0; i < intervalsRequired; i++) {
        takenArr.push(hour + i * this.hourlyIncrement);
      }
      return takenArr;
    }
  }
};
</script>
