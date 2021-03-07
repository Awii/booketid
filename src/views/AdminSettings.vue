<template>
  <v-container fluid v-bind="smAndUp">
    <AppHeader />
    <AppDrawer />

    <v-main>
      <v-row justify="center" class="mt-0">
        <v-col style="max-width: 800px; min-height: 600px">
          <v-card>
            <v-tabs v-model="tab">
              <v-tab v-for="tab in tabs" :key="tab">
                {{ tab }}
              </v-tab>
              <v-spacer></v-spacer>

              <v-dialog
                v-model="serviceDialog"
                max-width="500px"
                v-if="this.tab == 0"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="$vuetify.breakpoint.smAndUp"
                    color="primary darken-1"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="mr-1 mt-1"
                  >
                    Ny tjeneste
                  </v-btn>
                  <v-btn
                    v-else
                    color="primary darken-1"
                    fab
                    small
                    v-bind="attrs"
                    v-on="on"
                    elevation="0"
                    class="mt-2 mr-3"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-container>
                    <v-card-text>
                      <v-form
                        ref="servicesForm"
                        v-model="servicesValidation"
                        @submit.prevent
                        lazy-validation
                      >
                        <v-text-field
                          label="Tjeneste"
                          v-model="editedService.service"
                          :rules="[rules.required]"
                          required
                        ></v-text-field>
                        <v-textarea
                          label="Beskrivelse"
                          v-model="editedService.description"
                          auto-grow
                          rows="1"
                        ></v-textarea>
                        <v-text-field
                          label="Varighet (min)"
                          v-model="editedService.duration"
                          :rules="[rules.required, rules.number]"
                          required
                        ></v-text-field>
                        <v-text-field
                          label="Pris"
                          v-model="editedService.price"
                          :rules="[rules.required, rules.number]"
                          required
                        ></v-text-field>
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="closeService()">
                        Avbryt
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="saveService()">
                        Lagre
                      </v-btn>
                    </v-card-actions>
                  </v-container>
                </v-card>
              </v-dialog>
            </v-tabs>

            <v-tabs-items v-model="tab" touchless>
              <v-tab-item>
                <v-data-table
                  :headers="serviceHeaders"
                  :items="services"
                  :hide-default-footer="true"
                  :disable-sort="true"
                  :mobile-breakpoint="460"
                  :items-per-page="100"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editService(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteService(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-tab-item>

              <v-tab-item>
                <v-data-table
                  :headers="openingHoursHeaders"
                  :items="openingHours"
                  :hide-default-footer="true"
                  :disable-sort="true"
                  mobile-breakpoint="460"
                >
                  <template v-slot:item.opening="{ item }">
                    {{
                      formatNumberToHours(item.openingHour, item.openingMinute)
                    }}
                  </template>

                  <template v-slot:item.closing="{ item }">
                    {{
                      formatNumberToHours(item.closingHour, item.closingMinute)
                    }}
                  </template>

                  <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editOpeningHours(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="resetOpeningHours(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>

                <v-dialog
                  v-model="openingHoursDialog"
                  max-width="300px"
                  v-if="this.tab == 1"
                >
                  <v-card>
                    <v-card-title>
                      <span class="headline">Endre åpningstiden</span>
                    </v-card-title>

                    <v-container>
                      <v-card-text>
                        <v-form
                          ref="openingHoursForm"
                          v-model="openingHoursValidation"
                          @submit.prevent
                          lazy-validation
                        >
                          <v-row>
                            <v-col cols="6">
                              <v-text-field
                                label="Åpner (time)"
                                v-model="editedOpeningHours.openingHour"
                                :rules="[
                                  rules.required,
                                  rules.number,
                                  rules.hoursInterval
                                ]"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                label="min"
                                v-model="editedOpeningHours.openingMinute"
                                :rules="[
                                  rules.required,
                                  rules.number,
                                  rules.minsInterval
                                ]"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                label="Stenger (time)"
                                v-model="editedOpeningHours.closingHour"
                                :rules="[
                                  rules.required,
                                  rules.number,
                                  rules.hoursInterval
                                ]"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                label="min"
                                v-model="editedOpeningHours.closingMinute"
                                :rules="[
                                  rules.required,
                                  rules.number,
                                  rules.minsInterval
                                ]"
                                required
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="closeOpeningHours()"
                        >
                          Avbryt
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="saveOpeningHours()"
                        >
                          Lagre
                        </v-btn>
                      </v-card-actions>
                    </v-container>
                  </v-card>
                </v-dialog>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
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

export default {
  name: "AdminSettings",

  components: {
    AppHeader,
    AppDrawer
  },

  data() {
    return {
      tab: null,
      tabs: ["Tjenester", "Åpningstider"],

      services: [],
      serviceDialog: false,
      servicesValidation: true,

      editing: false,
      editedServiceIndex: null,
      editedService: {
        service: "",
        description: "",
        duration: "",
        price: ""
      },

      serviceHeaders: [
        { text: "Tjeneste", value: "service" },
        { text: "Beskrivelse", value: "description" },
        { text: "Varighet", value: "duration" },
        { text: "Pris", value: "price" },
        { text: "Handlinger", value: "actions", sortable: false }
      ],

      rules: {
        required: value => !!value || "Påkrevd.",
        hoursInterval: value =>
          (value < 24 && value >= 0) || "Må være mellom 0 og 23 timer.",
        minsInterval: value =>
          (value < 60 && value >= 0 && value % 30 == 0) ||
          "Må være 0 eller 30 min.",
        number: value => /^\d+$/.test(value) || "Må være et tall."
      },

      openingHours: [],
      openingHoursDialog: false,
      openingHoursValidation: true,

      editedOpeningIndex: null,
      editedOpeningHours: {
        openingHour: "",
        openingMinute: "",
        closingHour: "",
        closingMinute: ""
      },

      openingHoursHeaders: [
        { text: "Dag", value: "day" },
        { text: "Åpner", value: "opening" },
        { text: "Stenger", value: "closing" },
        { text: "Handlinger", value: "actions", sortable: false }
      ],

      weekdays: {
        monday: "Mandag",
        tuesday: "Tirsdag",
        wednesday: "Onsdag",
        thursday: "Torsdag",
        friday: "Fredag",
        saturday: "Lørdag",
        sunday: "Søndag"
      },

      // navbar props
      title: "Site",
      logo: require("@/assets/logo.jpg"),

      // stepper props
      steps: ["Tjeneste", "Tidspunkt", "Personalia", "Bekreftelse"],
      hourlyIncrement: 0.5,

      // footer props
      contact: { number: "+47 900 45 100", email: "placeholder@email.com" },
      location: ["Stenersgata 1 E", "0050 Oslo"],

      maxWidth: "660px"
    };
  },

  created() {
    let servicesRef = db.collection(`${this.fbPrefix}_services`);

    servicesRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.services.push({
          service: doc.data().service,
          description: doc.data().description,
          duration: doc.data().duration,
          price: doc.data().price,
          docId: doc.id
        });
      });
    });

    let openingRef = db.collection(`${this.fbPrefix}_hours`).doc("default");

    openingRef.get().then(doc => {
      let openingHours = [];
      if (doc.exists) {
        for (let day in doc.data()) {
          let currentDay = doc.data()[day];
          let openingHour = "",
            openingMinute = "0",
            closingHour = "",
            closingMinute = "0";

          if (typeof currentDay.start == "number") {
            openingHour = Math.floor(currentDay.start);
            openingMinute = String((currentDay.start * 60) % 60);
          }

          if (typeof currentDay.end == "number") {
            closingHour = Math.floor(currentDay.end);
            closingMinute = String((currentDay.end * 60) % 60);
          }

          openingHours.push({
            day: this.weekdays[day],
            openingHour: openingHour,
            openingMinute: openingMinute,
            closingHour: closingHour,
            closingMinute: closingMinute
          });
        }

        openingHours.sort((a, b) => {
          let days = {
            Mandag: 1,
            Tirsdag: 2,
            Onsdag: 3,
            Torsdag: 4,
            Fredag: 5,
            Lørdag: 6,
            Søndag: 7
          };

          let day1 = a.day;
          let day2 = b.day;
          return days[day1] - days[day2];
        });
      } else {
        openingRef
          .set({
            monday: {},
            tuesday: {},
            wednesday: {},
            thursday: {},
            friday: {},
            saturday: {},
            sunday: {}
          })
          .then(() => {
            for (let day in this.weekdays) {
              openingHours.push({
                day: this.weekdays[day],
                openingHour: "",
                openingMinute: "0",
                closingHour: "",
                closingMinute: "0"
              });
            }
            this.openingHours = openingHours;
          });
      }
      this.openingHours = openingHours;
    });
  },

  computed: {
    formTitle() {
      if (this.editing) {
        return "Endre tjeneste";
      } else {
        return "Ny tjeneste";
      }
    },
    smAndUp() {
      if (this.$vuetify.breakpoint.smAndUp) {
        return { "fill-height": true };
      } else {
        return {};
      }
    },

    fbPrefix() {
      return users[auth.currentUser.uid].fbPrefix;
    }
  },

  methods: {
    editService(item) {
      this.editing = true;
      this.editedServiceIndex = this.services.indexOf(item);
      this.editedService = Object.assign({}, item);
      this.serviceDialog = true;
    },
    deleteService(item) {
      if (
        window.confirm(
          `Er du sikker på at du vil fjerne tjenesten "${item.service}" ?`
        )
      ) {
        db.collection(`${this.fbPrefix}_services`)
          .doc(item.docId)
          .delete()
          .then(() => {
            this.services.splice(this.services.indexOf(item), 1);
          });
      }
    },
    saveService() {
      if (this.$refs.servicesForm.validate()) {
        if (this.editing) {
          db.collection(`${this.fbPrefix}_services`)
            .doc(this.editedService.docId)
            .set({
              service: this.editedService.service,
              description: this.editedService.description,
              duration: this.editedService.duration,
              price: this.editedService.price
            })
            .then(() => {
              Object.assign(
                this.services[this.editedServiceIndex],
                this.editedService
              );
              this.closeService();
            });
        } else {
          db.collection(`${this.fbPrefix}_services`)
            .add({
              service: this.editedService.service,
              description: this.editedService.description,
              duration: this.editedService.duration,
              price: this.editedService.price
            })
            .then(() => {
              this.services.push(this.editedService);
              this.closeService();
            });
        }
      }
    },
    closeService() {
      this.editing = false;
      this.serviceDialog = false;
      this.editedServiceIndex = null;
      this.$refs.servicesForm.resetValidation();
      this.editedService = {
        service: "",
        description: "",
        duration: "",
        price: ""
      };
    },

    editOpeningHours(item) {
      this.editedOpeningIndex = this.openingHours.indexOf(item);
      this.editedOpeningHours = Object.assign({}, item);
      this.openingHoursDialog = true;
    },
    resetOpeningHours(item) {
      if (window.confirm("Er du sikker på at du vil fjerne åpningstidene?")) {
        let day = Object.keys(this.weekdays).find(
          key => this.weekdays[key] === item.day
        );

        db.collection(`${this.fbPrefix}_hours`)
          .doc("default")
          .set(
            {
              [day]: {}
            },
            { merge: true }
          )
          .then(() => {
            Object.assign(this.openingHours[this.openingHours.indexOf(item)], {
              day: item.day,
              openingHour: "",
              openingMinute: "0",
              closingHour: "",
              closingMinute: "0"
            });
          });
      }
    },
    saveOpeningHours() {
      if (this.$refs.openingHoursForm.validate()) {
        let day = Object.keys(this.weekdays).find(
          key => this.weekdays[key] === this.editedOpeningHours.day
        );
        let start =
          parseInt(this.editedOpeningHours.openingHour) +
          parseInt(this.editedOpeningHours.openingMinute) / 60;
        let end =
          parseInt(this.editedOpeningHours.closingHour) +
          parseInt(this.editedOpeningHours.closingMinute) / 60;

        db.collection(`${this.fbPrefix}_hours`)
          .doc("default")
          .set(
            {
              [day]: {
                start: Math.min(start, end),
                end: Math.max(start, end)
              }
            },
            { merge: true }
          )
          .then(() => {
            Object.assign(
              this.openingHours[this.editedOpeningIndex],
              this.editedOpeningHours
            );
            this.closeOpeningHours();
          });
      }
    },
    closeOpeningHours() {
      this.openingHoursDialog = false;
      this.openingHoursIndex = null;
      this.$refs.openingHoursForm.resetValidation();
      this.editedOpeningHours = {
        openingHour: "",
        openingMinute: "",
        closingHour: "",
        closingMinute: ""
      };
    },

    formatNumberToHours(hours, minutes) {
      if (hours) {
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        return hours + ":" + minutes;
      } else {
        return "";
      }
    }
  },

  watch: {
    serviceDialog(val) {
      val || this.closeService();
    },
    openingHoursDialog(val) {
      val || this.closeOpeningHours();
    }
  }
};
</script>
