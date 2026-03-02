<!-- eslint-disable max-len -->
<template>
  <div class="accessories">
    <div class="accessories__header">
      <nav class="accessories__breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="accessories__crumb">Главная</NuxtLink>
        <span class="accessories__sep">/</span>
        <span class="accessories__crumb accessories__crumb--current">Аксессуары</span>
      </nav>
      <h1 class="accessories__title">Аксессуары для Apple в Рязани и Москве</h1>
      <p class="accessories__desc">Чехлы, кабели, клавиатуры и мыши для iPhone, iPad и MacBook. Оригинальные аксессуары с доставкой по Рязани и Москве.</p>
    </div>
    <Slider :categories="categories" />
  </div>
</template>
<script setup>
import { ref } from 'vue';

const siteUrl = 'https://рк-тек.рф';
const pageUrl = `${siteUrl}/accessories`;
const pageTitle = 'Аксессуары для Apple — купить в Рязани и Москве | РК-Тек';
const pageDescription = 'Аксессуары для iPhone, iPad и MacBook в Рязани и Москве. Чехлы, кабели для зарядки, клавиатуры и мыши. Быстрая доставка, гарантия качества.';
const ogImage = `${siteUrl}/images/accessories.webp`;

useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: 'аксессуары для iphone рязань, аксессуары для ipad, кабели apple рязань, чехлы iphone купить рязань, клавиатуры для mac, мыши apple' },
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
            name: 'Аксессуары',
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
      name: 'Аксессуары для iPhone',
      ico: '/icons/iphone.svg',
      link: '/accessories/case',
      img: '/images/case.webp',
      uuid: '3c28df49-c662-469e-90df-888724e24da1',
      isName: true,
    },
    {
      name: 'Адаптеры питания и кабели для зарядки',
      ico: '/icons/ipad.svg',
      link: '/accessories/cable',
      img: '/images/cable.webp',
      uuid: 'baa43a78-850b-42c5-8487-e706e10292c5',
      isName: true,
    },
    {
      name: 'Клавиатуры и мыши',
      ico: '/icons/mac.svg',
      link: '/accessories/mouse',
      img: '/images/mouse.webp',
      uuid: '9c4fc64f-6545-4c8b-9745-e900e506082a',
      isName: true,
    },
    
  ],
});
</script>
<style scoped lang="scss">
.accessories {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  @media (max-width: 500px) {
    align-items: stretch;
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
