// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  ssr: true,
  mode: "universal",
  css: ["~/assets/styles/main.css", "~/assets/styles/common.scss"],
  modules: ["@pinia/nuxt", "nuxt-icons", "@element-plus/nuxt"],
  buildModules: [
    // Simple usage
    "@nuxtjs/moment",

    // With options
    [
      "@nuxtjs/moment",
      {
        /* module options */
      },
    ],
  ],
  plugins: ["~/plugins/uuid.js"],
  app: {
    head: {
      title: "RK Tech - интернет магазин техники и аксессуаров Apple и Dyson",
      meta: [
        {
          hid: "og:title",
          property: "og:title",
          content: "RK TECH - техника и аксессуары Apple и Dyson",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "Гарантия 1 год на всю продукцию. Доставка в день заказа.",
        },
        { hid: "og:site_name", property: "og:site_name", content: "RK TECH" },
        { hid: 'og:image', property: 'og:image', content: '/images/rk.png' },
        { charset: "utf-8" },
        { name: "mailru-domain", content: "CoFCclY1n4fubWZE" },
        { name: "yandex-verification", content: "001f935542fddf66" },
        {
          name: 'google-site-verification',
          content: '87OfPmhEli0X2U9zoAFLC3xOxwnncBA-z515eRDQ4Rk'
        }
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      htmlAttrs: {
        lang: 'ru',
      },
    },
  },

  runtimeConfig: {
    public: {
      URL: process.env.URL || "",
      NODE_ENV: process.env.NODE_ENV || "production",
    },
  },
  svgo: {
    autoImportPath: "./assets/icons/",
  },
});
