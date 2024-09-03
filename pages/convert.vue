<template>
  <main class="convert-page page">
    <div class="container-padding">
      <form class="convert-page__form">
        <SelectComponent
          v-model="fromCurrency"
          :options="currencies"
          @update:modelValue="updateRates"
          placeholder="Выберите валюту"
        />
        <InputComponent
          v-model="fromAmount"
          @update:modelValue="convertFromTo"
          type="number"
          placeholder="Введите число"
        />
        <SelectComponent
          v-model="toCurrency"
          :options="currencies"
          @update:modelValue="updateRates"
          placeholder="Выберите валюту"
        />
        <InputComponent
          v-model="toAmount"
          @update:modelValue="convertToFrom"
          type="number"
          placeholder="Введите число"
        />
      </form>
      <p v-if="conversionRate">1 {{ fromCurrency.title }} = {{ conversionRate }} {{ toCurrency.title }}</p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import axios from "axios";
import SelectComponent from "@/components/inputs/select/input.vue";
import { useDefaultStore } from "~/stores/default";
import InputComponent from "~/components/inputs/InputComponent.vue";

const store = useDefaultStore();

const currencies = computed(() => {
  return store.currencies;
});

const fromCurrency = ref({ title: "USD", value: "USD" });
const toCurrency = ref({ title: "RUB", value: "RUB" });
const fromAmount = ref("1");
const toAmount = ref("");
const conversionRate = ref(null);

async function updateRates() {
  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency.value.value}`
    );
    const rates = response.data.rates;
    conversionRate.value = rates[toCurrency.value.value];
    convertFromTo();
  } catch (error) {
    console.error("Ошибка при получении курсов валют:", error);
    conversionRate.value = null;
  }
}

function convertFromTo() {
  if (conversionRate.value && !isNaN(parseFloat(fromAmount.value))) {
    toAmount.value = (parseFloat(fromAmount.value) * conversionRate.value).toFixed(2);
  } else {
    toAmount.value = "";
  }
}

function convertToFrom() {
  if (conversionRate.value && !isNaN(parseFloat(toAmount.value))) {
    fromAmount.value = (parseFloat(toAmount.value) / conversionRate.value).toFixed(2);
  } else {
    fromAmount.value = "";
  }
}

function formatInput(value) {
  return parseFloat(value.replace(/[^0-9.]/g, "")).toFixed(2);
}

watch(fromAmount, (newValue) => {
  fromAmount.value = formatInput(newValue);
});

watch(toAmount, (newValue) => {
  toAmount.value = formatInput(newValue);
});

onMounted(() => {
  updateRates();
});
</script>

<style lang="stylus">
.convert-page {
  &__form {
    max-width 300px
    display grid
    grid-template-columns 1fr 2fr
    grid-gap 15px 5px
    margin-bottom 10px
  }
}
</style>
