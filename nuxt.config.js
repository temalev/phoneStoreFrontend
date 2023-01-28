// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  ssr: true,
  css: ['~/assets/styles/main.css'],
  modules: ['@pinia/nuxt', 'nuxt-icons'],
  head: {
    title: 'rk-tech',
    titleTemplate: '%s - Nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'mailru-domain', content: 'CoFCclY1n4fubWZE' },
      { name: 'yandex-verification', content: '6b51acfc4a41812d' },
    ],
    link: [{ rel: 'icon', type: 'image/svg', href: '/favicon.svg' }],
  },
  runtimeConfig: {
    public: {
      URL: process.env.URL,
    },
  },
});
