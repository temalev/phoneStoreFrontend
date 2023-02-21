// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  ssr: true,
  css: ['~/assets/styles/main.css'],
  modules: ['@pinia/nuxt'],
  buildModules: [
    // Simple usage
    '@nuxtjs/moment',

    // With options
    ['@nuxtjs/moment', { /* module options */ }],
  ],
  head: {
    title: 'rk-tech',
    titleTemplate: '%s - Nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'mailru-domain', content: 'CoFCclY1n4fubWZE' },
      { name: 'yandex-verification', content: '6b51acfc4a41812d' },
    ],
    link: [{ rel: 'icon', href: '/favicon.png' }],
  },
  runtimeConfig: {
    public: {
      URL: process.env.URL || '',
      NODE_ENV: process.env.NODE_ENV || 'production',
    },
  },
});
