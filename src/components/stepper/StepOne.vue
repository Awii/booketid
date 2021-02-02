<template
  ><v-stepper-content :step="step">
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
                    {{ servicesPrice }}<small> kr</small>
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
              @click="nextStep()"
            >
              Neste
              <span class="text-h5 pl-1" style="margin-bottom: 3px">
                &#8250;
              </span>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-stepper-content>
</template>

<script>
export default {
  name: "StepOne",
  props: { step: Number, services: Array },

  data() {
    return {
      checked: []
    };
  },

  computed: {
    servicesPrice() {
      let val = 0;
      this.checked.forEach(e => {
        val += parseInt(e.price);
      });
      return val;
    }
  },

  watch: {
    checked() {
      this.$store.commit("updateChecked", this.checked);
    }
  },

  methods: {
    nextStep() {
      this.$store.commit("updateStep", 2);
    }
  }
};
</script>

<style></style>
