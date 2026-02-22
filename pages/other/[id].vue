<template>
  <div v-if="api.products" class="mainProducts">
    <CardProduct v-for="product in api.products?.[currentCategory]?.filter(el => !el.isDeleted)" :key="product.uuid" :product="product" />
  </div>
  <div v-else class="loader">загрузка</div>
</template>
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/stores/api';
import { useCategories } from '~/stores/categories';

const route = useRoute();
const api = useApi();
const categories = useCategories();

const currentCategory = ref(route.params.id);

const otherDescriptions = {
  marshall: {
    title: 'Купить Marshall в Москве — колонки и наушники | РК-Тек',
    description: 'Колонки и наушники Marshall в Москве. Подберём нужную модель по выгодной цене. Быстрая доставка.',
    keywords: 'marshall купить москва, колонки marshall, наушники marshall',
    img: '/images/marshall.webp',
  },
  dji: {
    title: 'Купить DJI в Москве — дроны и стабилизаторы | РК-Тек',
    description: 'Дроны и стабилизаторы DJI в Москве. Подберём нужную модель по выгодной цене. Быстрая доставка.',
    keywords: 'dji купить москва, дрон dji, стабилизатор dji',
    img: '/images/dji.webp',
  },
  xiaomi: {
    title: 'Купить Xiaomi в Москве — техника и гаджеты | РК-Тек',
    description: 'Техника и гаджеты Xiaomi в Москве по выгодным ценам. Быстрая доставка, гарантия.',
    keywords: 'xiaomi купить москва, техника xiaomi, гаджеты xiaomi',
    img: '/images/xiaomi.webp',
  },
  jbl: {
    title: 'Купить JBL в Москве — колонки и наушники | РК-Тек',
    description: 'Колонки и наушники JBL в Москве по выгодным ценам. Быстрая доставка, гарантия.',
    keywords: 'jbl купить москва, колонки jbl, наушники jbl',
    img: '/images/jbl.webp',
  },
  dreame: {
    title: 'Купить Dreame в Москве — пылесосы и уход за волосами | РК-Тек',
    description: 'Пылесосы и приборы для укладки волос Dreame в Москве. Быстрая доставка, гарантия.',
    keywords: 'dreame купить москва, пылесос dreame, фен dreame',
    img: '/images/dreame.webp',
  },
};

const desc = otherDescriptions[currentCategory.value] || {
  title: `Купить ${currentCategory.value} в Москве | РК-Тек`,
  description: 'Техника и гаджеты в Москве по выгодным ценам. Быстрая доставка, гарантия.',
  keywords: `${currentCategory.value} купить москва`,
  img: '/images/other.webp',
};

const pageUrl = `https://рк-тек.рф/other/${currentCategory.value}`;

useHead({
  title: desc.title,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: desc.description },
    { name: 'keywords', content: desc.keywords },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: desc.title },
    { property: 'og:description', content: desc.description },
    { property: 'og:image', content: desc.img },
    { property: 'og:url', content: pageUrl },
    { property: 'og:site_name', content: 'РК-Тек' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: desc.title },
    { name: 'twitter:description', content: desc.description },
    { name: 'twitter:image', content: desc.img },
  ],
});

onMounted(() => {
  const cat = categories.categories.find((el) => el.categories);
  api.currentCategory = currentCategory.value;

  const uuidCategory = cat.categories.find(
    (el) => el.link.toLowerCase().includes(currentCategory.value),
  ).uuid;
  api.getProducts(uuidCategory);
});
</script>
<style scoped lang="scss">
.mainProducts {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 70px;
  padding: 20px;
}
</style>
