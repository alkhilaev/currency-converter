import { defineNuxtConfig } from "nuxt/config";
import rupture from "rupture";

export default defineNuxtConfig({
  experimental: {
    renderJsonPayloads: false,
  },
  devtools: { enabled: true },
  nitro: {
    compressPublicAssets: true,
  },
  build: {
    transpile: ["tslib"],
  },
  modules: ["@pinia/nuxt", "vue3-perfect-scrollbar/nuxt"],
  components: [
    {
      path: "~/components",
      pathPrefix: true,
    },
  ],
  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          use: [rupture()],
        },
      },
    },
  },
});
