<!-- eslint-disable max-len -->
<template>
  <div class="body">
    <div class="welcome">
      <div class="text">
        <h1>RK TECH</h1>
        <p>Высокий уровень сервиса и доступные цены.</p>
      </div>
    </div>
    <Slider :categories="categories" />
    <InfoContainers @openModal="onOpenModal" />
    <DeliveryInfoModal v-if="api.infoModal === 'DELIVERY'" @close="api.infoModal = null" />
    <PaymentInfoModal v-if="api.infoModal === 'PAYMENT'" @close="api.infoModal = null" />
    <OriginalityInfoModal v-if="api.infoModal === 'ORIGINALITY'" @close="api.infoModal = null" />
    <Teleport v-if="api.infoModal && api.infoModal !== 'DELIVERY' && api.infoModal !== 'PAYMENT' && api.infoModal !== 'ORIGINALITY'" to="body">
      <InfoModal @close="api.infoModal = null" />
    </Teleport>
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { useHead } from 'unhead';
import { useCategories } from '~/stores/categories';
import { useApi } from '~~/stores/api';

const api = useApi();
const categories = useCategories();

const pageUrl = 'https://рк-тек.рф';
const pageTitle = 'RK Tech — интернет-магазин техники Apple и Dyson в Москве';
const pageDescription = 'RK Tech — техника и аксессуары Apple и Dyson в Москве по низким ценам. iPhone, iPad, Mac, AirPods, Apple Watch. Гарантия 1 год. Доставка по Москве в день заказа.';
const ogImage = '/images/mainPageBackground.webp';

useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: 'купить iPhone Москва, купить iPad, Apple Watch купить, AirPods купить, Dyson купить, Mac купить, интернет магазин Apple Москва, RK Tech' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:url', content: pageUrl },
    { property: 'og:site_name', content: 'РК-Тек' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: ogImage },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'RK Tech',
        url: pageUrl,
        description: pageDescription,
        logo: `${pageUrl}/icons/logo.svg`,
        image: `${pageUrl}${ogImage}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Москва',
          addressCountry: 'RU',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          url: 'https://t.me/Rktech_shop',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Техника Apple и Dyson',
          itemListElement: categories.categories.map((cat) => ({
            '@type': 'OfferCatalog',
            name: cat.name,
            url: `${pageUrl}${cat.link}`,
          })),
        },
      }),
    },
  ],
});

const onOpenModal = (modal) => {
  api.infoModal = modal;
};
</script>

<style scoped lang="scss">
.body {
  display: flex;
  flex-direction: column;
  gap: 50px;
  @media (max-width: 850px) {
    gap: 26px;
  }
}

h1 {
  font-size: 52px;
}
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  justify-content: center;
  position: relative;
  margin-top: 70px;
  background-image: url(/images/mainPageBackground.webp);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 60vh;
  box-shadow: inset 2px 0 10px rgb(144, 144, 144);
  flex-shrink: 0;

  @media (max-width: 850px) {
    height: 40vh;
  }
}

.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-top: -45px;
}
</style>
