<template>
  <main class="home-page page">
    <div class="container-padding">
      <div class="home-page__inner">
        <h2>Курсы валют относительно {{ activeCurrency.title }}</h2>
        <ul v-if="rates" class="home-page__list">
          <li v-for="currency in filteredCurrencies" :key="currency.value">
            1 {{ currency.value }} = {{ (1 / rates[currency.value]).toFixed(2) }} {{ activeCurrency.value }}
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useHead } from "#app";
import { computed, onMounted } from "vue";
import { useDefaultStore } from "~/stores/default";

useHead({
  titleTemplate: "Главная",
});

const store = useDefaultStore();

const currencies = computed(() => store.currencies);
const rates = computed(() => store.rates);
const activeCurrency = computed(() => store.activeCurrency);

const filteredCurrencies = computed(() => {
  return currencies.value.filter((currency) => currency.value !== activeCurrency.value.value);
});

onMounted(() => {
  store.updateRates();
});
</script>

<style lang="stylus">
.home-page {
  padding-bottom 50px

  &__list {
    margin-top 15px
    width fit-content

    li {
      padding 10px
      border-radius 6px
      border 1px solid var(--main)
      background var(--white)
      margin-bottom 5px
      width auto
      //color var(--main)
    }
  }
}
</style>
