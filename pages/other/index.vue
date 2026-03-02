<!-- eslint-disable max-len -->
<template>
  <div class="other-page">
    <div class="other-page__header">
      <nav class="other-page__breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="other-page__crumb">Главная</NuxtLink>
        <span class="other-page__sep">/</span>
        <span class="other-page__crumb other-page__crumb--current">Другие бренды</span>
      </nav>
      <h1 class="other-page__title">Marshall, Xiaomi, DJI, JBL в Рязани и Москве</h1>
      <p class="other-page__desc">Техника других брендов: Marshall, Samsung, DJI, Яндекс, Xiaomi, Dreame, JBL. Подберём нужный товар по выгодной цене с доставкой по Рязани и Москве.</p>
    </div>
    <Slider :categories="categories" is-message-block />
  </div>
</template>
<script setup>
import { ref } from 'vue';

const siteUrl = 'https://рк-тек.рф';
const pageUrl = `${siteUrl}/other`;
const pageTitle = 'Другие бренды — Marshall, DJI, Xiaomi, JBL в Рязани | РК-Тек';
const pageDescription = 'Техника Marshall, Samsung, DJI, Яндекс, Xiaomi, Dreame, JBL в Рязани и Москве. Подберём нужный товар по выгодной цене с доставкой.';
const ogImage = `${siteUrl}/images/other.webp`;

useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: 'marshall купить рязань, dji купить рязань, xiaomi купить рязань, jbl купить, dreame купить, яндекс станция купить рязань' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
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
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Главная',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Другие бренды',
            item: pageUrl,
          },
        ],
      }),
    },
  ],
});

const categories = ref({
  categories: [
    {
      name: 'Canon',
      ico: '/icons/iphone.svg',
      link: 'canon',
      img: '/images/camera.webp',
      uuid: 'c568e1fd-4206-422d-aa73-a8e448fe5690',
      isName: true,
      isHiddenForHeader: true,
    },
    {
      name: 'Whoop',
      ico: '/icons/whoop.svg',
      link: 'whoop',
      img: '/images/whoop.webp',
      uuid: 'd53d2d22-5d38-4651-8da2-1076f06d6511',
      isName: true,
      isHiddenForHeader: true,
    },
    {
      name: 'Marshall',
      ico: '/icons/iphone.svg',
      link: '',
      img: '/images/marshall.webp',
      uuid: 'e0844263-9fc4-4e72-8e3e-21f94bff72f4',
      isName: true,
    },
    {
      name: 'Samsung',
      ico: '/icons/iphone.svg',
      link: '',
      img: '/images/samsung.webp',
      uuid: 'e0844263-9fc4-4e72-8e3e-21f94bff72f4',
      isName: true,
    },
    {
      name: 'DJI',
      ico: '/icons/ipad.svg',
      link: '',
      img: '/images/dji.webp',
      uuid: 'cf87ad6b-f3b3-41e4-ae78-7d69bbb7366b',
      isName: true,
    },
    {
      name: 'Яндекс',
      ico: '/icons/mac.svg',
      link: '',
      img: '/images/yandex.webp',
      uuid: '37c7f8bd-48a4-42af-8c27-740559f50e7b',
      isName: true,
    },
    {
      name: 'Xiaomi',
      ico: '/icons/mac.svg',
      link: '',
      img: '/images/xiaomi.webp',
      uuid: 'afcd0861-edab-44b5-85dc-fd59bcd15233',
      isName: true,
    },
    {
      name: 'Dreame',
      ico: '/icons/mac.svg',
      link: '',
      img: '/images/dreame.webp',
      uuid: 'da8f765a-805d-49d3-b254-d496da65ee0c',
      isName: true,
    },
    {
      name: 'JBL',
      ico: '/icons/mac.svg',
      link: '',
      img: '/images/jbl.webp',
      uuid: '0b5c1b8c-dace-47cd-bca2-17454d4ea135',
      isName: true,
    },
  ],
});
</script>
<style scoped lang="scss">
.other-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  @media (max-width: 500px) {
    align-items: stretch;
    padding: 0;
  }

  &__header {
    max-width: 1100px;
    width: 100%;
    padding: 0 20px 24px;
    box-sizing: border-box;
  }

  &__breadcrumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }

  &__crumb {
    font-size: 13px;
    color: #888;
    text-decoration: none;
    &:hover { color: #333; }
    &--current { color: #333; }
  }

  &__sep {
    font-size: 13px;
    color: #bbb;
  }

  &__title {
    font-size: 28px;
    font-weight: 700;
    color: #1d1d1d;
    margin: 0 0 10px;
    line-height: 1.3;
    @media (max-width: 600px) { font-size: 22px; }
  }

  &__desc {
    font-size: 15px;
    color: #666;
    margin: 0;
    line-height: 1.6;
    max-width: 700px;
  }
}
</style>
