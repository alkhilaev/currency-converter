<template>
  <div id="app">
    <Header />
    <NuxtPage />
  </div>
</template>

<style lang="stylus">
@import "/styles/style.styl";
</style>

<script setup>
import { useHead } from "#app";
// import { onMounted } from "vue";
// import { useDefaultStore } from "~/stores/default";

useHead({
  title: "Currency Converter",
  titleTemplate: "%s | Currency Converter",
});

// const store = useDefaultStore();

// onMounted(() => {
//   store.fetchCurrencies();
// });
</script>

<style lang="stylus">
.app {}
</style>
