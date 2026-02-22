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

  hooks: {
    'pages:extend'(pages) {
      // Ограничиваем маршрут [uuid] только UUID-форматом
      // чтобы он не конфликтовал с [category]
      const uuidPage = pages.find((p) => p.name === 'uuid');
      if (uuidPage) {
        uuidPage.path = '/:uuid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})';
      }
    },
  },
});
