<template>
  <v-container fluid>
    <AppHeader :title="data.title" />

    <v-main>
      <AppStepper />
    </v-main>
    <AppFooter
      :contact="this.data.contact"
      :location="this.data.location"
      :social="this.data.social"
    />
  </v-container>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import AppStepper from "@/components/AppStepper";
import { db } from "@/plugins/firebaseInit";

export default {
  name: "Default",

  components: {
    AppHeader,
    AppFooter,
    AppStepper
  },

  props: { data: Object },

  data() {
    return {
      steps: ["Tjeneste", "Tidspunkt", "Personalia", "Bekreftelse"],
      services: [],
      hourlyIncrement: this.data.hourlyIncrement,
      location: this.data.location
    };
  },

  created() {
    this.$store.commit("updateSiteDetails", {
      title: this.data.title,
      fbPrefix: this.data.fbPrefix,
      steps: this.steps,
      path: this.$route.path,
      maxWidth: "700px",
      hourlyIncrement: this.data.hourlyIncrement,
      location: this.data.location,
      contact: this.data.contact,
      terms: this.data.terms,
      weeksToLoad: this.data.weeksToLoad
    });

    // fill services from firestore
    db.collection(`${this.data.fbPrefix}_services`)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.services.push(doc.data());
        });

        // details used in child components
        this.$store.commit("updateServices", this.services);
      });
  }
};
</script>
