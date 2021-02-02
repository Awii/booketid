<template>
  <div class="site">
    <AppHeader :title="title" :logo="logo" :maxWidth="maxWidth" />

    <v-main>
      <AppStepper
        :steps="steps"
        :services="services"
        :maxWidth="maxWidth"
        :hourlyIncrement="hourlyIncrement"
        :location="location"
      />
    </v-main>
    <AppFooter :contact="contact" :location="location" />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import AppStepper from "@/components/AppStepper";
import db from "@/plugins/firebaseInit";

export default {
  name: "Site",
  components: {
    AppHeader,
    AppFooter,
    AppStepper
  },

  data() {
    return {
      // navbar props
      title: "Site",
      logo: require("@/assets/logo.jpg"),

      // stepper props
      steps: ["Tjeneste", "Tidspunkt", "Personalia", "Bekreftelse"],
      services: [],
      hourlyIncrement: 0.5,

      // footer props
      contact: { number: "+47 900 45 100", email: "placeholder@email.com" },
      location: ["Stenersgata 1 E", "0050 Oslo"],

      maxWidth: "660px"
    };
  },

  methods: {
    resizeWidth() {
      var width = (window.innerWidth * 3) / 7;
      if (width > 660) {
        this.maxWidth = width + "px";
      }
    }
  },

  created() {
    // fill services from firestore
    db.collection("site_services")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.services.push(doc.data());
        });
      });

    window.addEventListener("resize", this.resizeWidth, { passive: true });
    this.resizeWidth();
  }
};
</script>
