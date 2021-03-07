<template>
  <v-container fluid fill-height>
    <AppHeader />
    <AppDrawer />
    <v-main>
      <v-row justify="center" class="mt-0">
        <v-col style="max-width: 1200px" class="d-flex align-center">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title
            v-if="$refs.calendar && $vuetify.breakpoint.smAndUp"
            class="pl-2 pr-6"
          >
            {{ $refs.calendar.title | capitalize }}
          </v-toolbar-title>
          <v-row>
            <v-select
              v-model="interval"
              :items="intervals"
              dense
              outlined
              hide-details
              class="my-2 px-2"
              label="intervall"
              style="max-width: 50%"
            ></v-select>
            <v-select
              v-model="type"
              :items="types"
              dense
              outlined
              hide-details
              class="my-2 px-2"
              label="type"
              style="max-width: 50%"
            ></v-select>
          </v-row>

          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-toolbar-title
        v-if="$refs.calendar && $vuetify.breakpoint.xsOnly"
        class="pl-2 pr-6"
      >
        {{ $refs.calendar.title | capitalize }}
      </v-toolbar-title>

      <v-row justify="center">
        <v-col style="max-width: 1200px">
          <v-calendar
            ref="calendar"
            color="primary"
            v-model="value"
            :now="today"
            :value="today"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            :interval-minutes="interval"
            :interval-height="80"
            :first-interval="intervalFirst"
            :interval-count="intervalCount"
            :weekdays="weekday"
            locale="no-NO"
            @click:event="showEvent"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card color="grey lighten-4" min-width="300px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="secondary" @click="selectedOpen = false">
                  Avbryt
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="deleteBooking(selectedEvent)"
                  >Slett</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-col>
      </v-row>
    </v-main>
  </v-container>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import AppDrawer from "@/components/AppDrawer";
import { db, auth } from "@/plugins/firebaseInit";
import users from "@/users.js";
import firebase from "firebase/app";
import {
  addMinutes,
  format,
  getDay,
  getISOWeek,
  getMonth,
  getYear,
  parseISO
} from "date-fns";

export default {
  name: "AdminDashboard",

  components: {
    AppHeader,
    AppDrawer
  },

  data() {
    let today = format(new Date(), "yyyy-MM-dd");
    return {
      value: "",

      interval: 60,
      intervals: [
        { text: "1 time", value: 60 },
        { text: "30 min", value: 30 }
      ],

      type: "week",
      types: [
        { text: "7 dager", value: "week" },
        { text: "4 dager", value: "4day" },
        { text: "1 dag", value: "day" }
      ],

      weekday: [1, 2, 3, 4, 5, 6, 0],

      events: [],

      weekdays: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      ],
      filledISOdates: [],

      earliestOpening: 8,
      latestClosing: 18,

      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      colors: [
        "red",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "green",
        "orange",
        "deep-orange"
      ],
      shades: ["", " darken-2", " darken-4"],

      // navbar props
      title: "Site",
      logo: require("@/assets/logo.jpg"),

      // stepper props
      steps: ["Tjeneste", "Tidspunkt", "Personalia", "Bekreftelse"],
      hourlyIncrement: 0.5,

      // footer props
      contact: { number: "+47 900 45 100", email: "placeholder@email.com" },
      location: ["Stenersgata 1 E", "0050 Oslo"],

      maxWidth: "660px",

      today: today
    };
  },

  computed: {
    intervalFirst() {
      if (this.interval == 60) {
        return Math.floor(this.earliestOpening);
      } else {
        return 2 * this.earliestOpening;
      }
    },
    intervalCount() {
      if (this.interval == 60) {
        return Math.ceil(this.latestClosing - this.earliestOpening);
      } else {
        return 2 * (this.latestClosing - this.earliestOpening);
      }
    },
    calendarValue() {
      return this.value;
    },
    ISOdate() {
      let date = parseISO(this.value);
      let week = getISOWeek(date);
      let year =
        week > 50 && getMonth(date) == 0
          ? getYear(date) - 1 // if january and week above 50, use last year's doc ref
          : getYear(date);

      return year + "-W" + week;
    },
    fbPrefix() {
      return users[auth.currentUser.uid].fbPrefix;
    }
  },

  watch: {
    calendarValue() {
      let ISOdate = this.ISOdate;
      if (!this.filledISOdates.includes(ISOdate)) {
        this.filledISOdates.push(ISOdate);
        for (let day of this.weekdays) {
          db.collection(`${this.fbPrefix}_bookings/${ISOdate}/${day}`)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                let docId = doc.id;
                doc = doc.data();
                let name = doc.services.map(e => e.service).join(", ");
                let date = doc.date.toDate();
                let start = format(date, "yyyy-MM-dd HH:mm");
                let end = format(
                  addMinutes(date, doc.duration),
                  "yyyy-MM-dd HH:mm"
                );
                let extra = "";
                if (doc.extra) {
                  extra = doc.extra + "<br><br>";
                }
                let details = `${extra}${doc.name}<br>${doc.email}<br>${doc.mobile}<br><br>${doc.address}<br>${doc.postnr} ${doc.poststed}`;

                this.events.push({
                  name: name,
                  start: start,
                  end: end,
                  color: this.colors[
                    this.random(0, this.colors.length - 1)
                  ].concat(this.shades[this.random(0, this.shades.length - 1)]),
                  details: details,
                  bookingTimes: doc.bookingTimes,
                  id: docId,
                  day: this.weekdays[getDay(date) - 1]
                });
              });
            });
        }
      }
    }
  },

  methods: {
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    getEventColor(event) {
      return event.color;
    },

    random(a, b) {
      return Math.floor((Math.abs(a - b) + 1) * Math.random()) + a;
    },

    deleteBooking(event) {
      if (window.confirm("Er du sikker på at du vil slette denne bookingen?")) {
        db.collection(`${this.fbPrefix}_hours`)
          .doc(this.ISOdate)
          .set(
            {
              monday: firebase.firestore.FieldValue.arrayRemove(
                ...event.bookingTimes
              )
            },
            { merge: true }
          )
          .then(() => {
            db.collection(`${this.fbPrefix}_bookings`)
              .doc(this.ISOdate)
              .collection(event.day)
              .doc(event.id)
              .delete()
              .then(() => {
                this.selectedOpen = false;
                this.events.splice(this.events.indexOf(event), 1);
              });
          });
      }
    }
  },

  created() {
    if (this.$vuetify.breakpoint.xs) {
      this.type = "day";
    } else if (this.$vuetify.breakpoint.sm) {
      this.type = "4day";
    }

    this.value = this.today;

    db.collection(`${this.fbPrefix}_hours`)
      .doc("default")
      .get()
      .then(doc => {
        if (doc.exists) {
          let earliestOpening, latestClosing;
          for (let day in doc.data()) {
            let currentDay = doc.data()[day];
            if (
              typeof currentDay.start == "number" &&
              typeof currentDay.end == "number"
            ) {
              // dynamic calendar hours
              if (!earliestOpening) {
                earliestOpening = currentDay.start;
              } else if (earliestOpening > currentDay.start) {
                earliestOpening = currentDay.start;
              }
              if (!latestClosing) {
                latestClosing = currentDay.end;
              } else if (latestClosing < currentDay.end) {
                latestClosing = currentDay.end;
              }
            }
          }
          if (typeof earliestOpening == "number") {
            this.earliestOpening = earliestOpening;
          }
          if (typeof latestClosing == "number") {
            this.latestClosing = latestClosing;
          }
        }
      });
  },

  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
};
</script>

<style>
.v-btn--fab.v-size--default {
  height: 40px;
  width: 40px;
}
</style>
