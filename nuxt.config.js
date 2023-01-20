// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  ssr: true,
  css: ['~/assets/styles/main.css'],
  modules: ['@pinia/nuxt'],
  head: {
    titleTemplate: '%s - Nuxt',
  },
  runtimeConfig: {
    public: {
      URL: process.env.URL,
    },
  },
});
