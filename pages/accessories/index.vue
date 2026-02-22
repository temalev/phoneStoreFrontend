<template>
  <div class="accessories">
    <Slider :categories="categories" />
  </div>
</template>
<script setup>
import { ref } from 'vue';

const pageUrl = 'https://рк-тек.рф/accessories';
const pageTitle = 'Аксессуары для Apple — купить в Москве | РК-Тек';
const pageDescription = 'Аксессуары для iPhone, iPad и MacBook в Москве. Чехлы, кабели для зарядки, клавиатуры и мыши. Быстрая доставка, гарантия качества.';
const ogImage = '/images/accessories.webp';

useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: 'аксессуары для iphone, аксессуары для ipad, кабели apple, чехлы iphone купить, клавиатуры для mac, мыши apple' },
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
}
</style>
