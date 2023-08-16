// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  ssr: true,
  mode: 'universal',
  css: ['~/assets/styles/main.css', '~/assets/styles/common.scss'],
  modules: ['@pinia/nuxt', 'nuxt-icons', '@element-plus/nuxt'],
  buildModules: [
    // Simple usage
    '@nuxtjs/moment',

    // With options
    ['@nuxtjs/moment', { /* module options */ }],
  ],
  plugins: [
    '~/plugins/uuid.js',
  ],
  head: {
    title: 'rk-tech',
    titleTemplate: '%s - Nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'mailru-domain', content: 'CoFCclY1n4fubWZE' },
      { name: 'yandex-verification', content: '6b51acfc4a41812d' },
      {
        hid: 'description',
        name: 'description',
        content: 'RK TECH - техника и аксессуары Apple и Dyson в Москве по низким ценам. Гарантия 1 год на всю продукцию. Доставка в Москве в день заказа.',
      },
    ],
    link: [{ rel: 'icon', href: '/favicon.png' }],
  },
  runtimeConfig: {
    public: {
      URL: process.env.URL || '',
      NODE_ENV: process.env.NODE_ENV || 'production',
    },
  },
  svgo: {
    autoImportPath: './assets/icons/',
  }
});
