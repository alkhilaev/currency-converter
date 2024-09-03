import { defineStore } from "pinia";
import axios from "axios";

export const useDefaultStore = defineStore({
  id: "default",
  state: () => ({
    currencies: [
      { title: "RUB", value: "RUB" },
      { title: "USD", value: "USD" },
      { title: "EUR", value: "EUR" },
    ],
    activeCurrency: { title: "RUB", value: "RUB" },
    rates: {},
  }),
  actions: {
    async updateRates() {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${this.activeCurrency.value}`
      );
      this.rates = response.data.rates;
    },
  },
});
