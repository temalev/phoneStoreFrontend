<template>
  <div class="accessories">
    <Slider :categories="categories" is-message-block />
  </div>
</template>
<script setup>
import { ref } from 'vue';

const pageUrl = 'https://рк-тек.рф/other';
const pageTitle = 'Другие бренды — Marshall, DJI, Xiaomi, JBL | РК-Тек';
const pageDescription = 'Техника Marshall, Samsung, DJI, Яндекс, Xiaomi, Dreame, JBL в Москве. Свяжитесь с нами для подбора нужного товара по выгодной цене.';
const ogImage = '/images/other.webp';

useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: 'marshall купить москва, dji купить, xiaomi купить москва, jbl купить, dreame купить, яндекс станция купить' },
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
      name: 'Canon',
      ico: '/icons/iphone.svg',
      link: 'c568e1fd-4206-422d-aa73-a8e448fe5690',
      img: '/images/camera.webp',
      uuid: 'c568e1fd-4206-422d-aa73-a8e448fe5690',
      isName: true,
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
.accessories {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  width: 100%;
  padding: 0 20px;
  @media (max-width: 500px) {
    align-items: stretch;
    padding: 0;
  }
}
</style>
