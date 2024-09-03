<template>
  <header class="header">
    <div class="container-padding">
      <div class="header__inner">
        <nav class="header__links">
          <nuxt-link :to="{ name: 'index' }" class="header__link"> Главная </nuxt-link>
          <nuxt-link :to="{ name: 'convert' }" class="header__link"> Конвертация </nuxt-link>
        </nav>
        <SelectComponent
          v-model="activeCurrency"
          :options="currencies"
          @update:modelValue="changeActiveCurrency"
          class="header__select"
          placeholder="Выберите валюту"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useDefaultStore } from "~/stores/default";
import SelectComponent from "@/components/inputs/select/input.vue";

const store = useDefaultStore();

const currencies = computed(() => store.currencies);

// onMounted(() => {
//   store.updateRates();
// });

const activeCurrency = ref(store.activeCurrency);

const changeActiveCurrency = (data) => {
  store.activeCurrency = data;
  store.updateRates();
};
</script>

<style lang="stylus">
.header {
  padding 20px 0

  &__inner {
    display flex
    justify-content space-between
  }

  &__links {
    display flex
    gap 20px
  }

  &__link {
    font-size 1.5rem
    font-weight 500
  }

  &__select {
     max-width 100px
  }
}
</style>
