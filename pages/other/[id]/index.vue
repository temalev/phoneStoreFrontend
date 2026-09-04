<template>
  <div class="otherCategory">
    <nav class="otherCategory__breadcrumbs" aria-label="Хлебные крошки">
      <NuxtLink to="/" class="otherCategory__crumb">Главная</NuxtLink>
      <span class="otherCategory__sep">/</span>
      <NuxtLink to="/other" class="otherCategory__crumb">Другие бренды</NuxtLink>
      <span class="otherCategory__sep">/</span>
      <span class="otherCategory__crumb otherCategory__crumb--current">{{ desc.crumb }}</span>
    </nav>
  </div>
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
import { SITE_URL } from '~/composables/useSiteUrl.ts';

const route = useRoute();
const api = useApi();
const categories = useCategories();

const currentCategory = ref(route.params.id);

const validBrands = ['marshall', 'dji', 'xiaomi', 'jbl', 'dreame'];
if (!validBrands.includes(currentCategory.value)) {
  // eslint-disable-next-line no-undef
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    fatal: true,
  });
}

const otherDescriptions = {
  marshall: {
    crumb: 'Marshall',
    title: 'Купить Marshall в Рязани — колонки и наушники | РК-Тек',
    description: 'Колонки и наушники Marshall в Рязани. Подберём нужную модель по выгодной цене. Быстрая доставка.',
    keywords: 'marshall купить москва, колонки marshall, наушники marshall',
    img: '/images/marshall.webp',
  },
  dji: {
    crumb: 'DJI',
    title: 'Купить DJI в Рязани — дроны и стабилизаторы | РК-Тек',
    description: 'Дроны и стабилизаторы DJI в Рязани. Подберём нужную модель по выгодной цене. Быстрая доставка.',
    keywords: 'dji купить москва, дрон dji, стабилизатор dji',
    img: '/images/dji.webp',
  },
  xiaomi: {
    crumb: 'Xiaomi',
    title: 'Купить Xiaomi в Рязани — техника и гаджеты | РК-Тек',
    description: 'Техника и гаджеты Xiaomi в Рязани по выгодным ценам. Быстрая доставка, гарантия.',
    keywords: 'xiaomi купить москва, техника xiaomi, гаджеты xiaomi',
    img: '/images/xiaomi.webp',
  },
  jbl: {
    crumb: 'JBL',
    title: 'Купить JBL в Рязани — колонки и наушники | РК-Тек',
    description: 'Колонки и наушники JBL в Рязани по выгодным ценам. Быстрая доставка, гарантия.',
    keywords: 'jbl купить москва, колонки jbl, наушники jbl',
    img: '/images/jbl.webp',
  },
  dreame: {
    crumb: 'Dreame',
    title: 'Купить Dreame в Рязани — пылесосы и стайлеры | РК-Тек',
    description: 'Пылесосы и приборы для укладки волос Dreame в Рязани. Быстрая доставка, гарантия.',
    keywords: 'dreame купить москва, пылесос dreame, фен dreame',
    img: '/images/dreame.webp',
  },
};

const desc = otherDescriptions[currentCategory.value] || {
  crumb: currentCategory.value,
  title: `Купить ${currentCategory.value} в Рязани | РК-Тек`,
  description: 'Техника и гаджеты в Рязани по выгодным ценам. Быстрая доставка, гарантия.',
  keywords: `${currentCategory.value} купить москва`,
  img: '/images/other.webp',
};

const pageUrl = `${SITE_URL}/other/${currentCategory.value}`;

useHead({
  title: desc.title,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: desc.description },
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
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Другие бренды',
            item: `${SITE_URL}/other`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: desc.crumb,
            item: pageUrl,
          },
        ],
      }),
    },
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
.otherCategory {
  max-width: 1100px;
  margin: 90px auto 0;
  padding: 0 20px;
  box-sizing: border-box;

  &__breadcrumbs {
    display: flex;
    align-items: center;
    gap: 8px;
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
}

.mainProducts {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding: 20px;
}
</style>
