// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  ssr: true,
  css: ['~/assets/styles/main.css'],
  modules: ['@pinia/nuxt'],
  head: {
    title: 'rk-tech',
    titleTemplate: '%s - Nuxt',
    meta: [{ name: 'mailru-domain', content: 'CoFCclY1n4fubWZE' }],
  },
  runtimeConfig: {
    public: {
      URL: process.env.URL,
    },
  },
});
