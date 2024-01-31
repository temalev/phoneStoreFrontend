<template>
  <div v-if="api.products" class="mainProducts">
    <CardProduct v-for="product in api.products?.[currentCategory].filter(el => !el.isDeleted)" :key="product.uuid" :product="product" />
  </div>
  <div v-else class="loader">загрузка</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';
import { useCategories } from '~/stores/categories';
import { useHead } from 'unhead';

const currentCategory = ref(null);
const descriptions = ref([
  {
    category: 'iphone',
    text: 'Купить Apple iPhone в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинал. В наличии. Гарантия. Чехол и стекло в подарок.',
  },
  {
    category: 'ipad',
    text: 'Купить Apple iPad в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинальная продукция. В наличии. Гарантия.',
  },
  {
    category: 'mac',
    text: 'Купить Apple Macbook в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинал. В наличии. Гарантия. Гравировка в подарок.',
  },
  {
    category: 'watch',
    text: 'Купить Apple Watch в Москве и Рязани с быстрой доставкой. Низкие цены. Оригинальная продукция. В наличии. Гарантия.',
  },
  {
    category: 'airpods',
    text: 'Купить Apple AirPods в Москве и Рязани с быстрой доставкой. Низкие цены. Оригинальная продукция. В наличии. Гарантия.',
  },
  {
    category: 'dyson',
    text: 'Купить Dyson в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинал. В наличии. Гарантия.',
  },
  {
    category: 'ps',
    text: 'Купить PlayStation 5 с дисководом в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинал. В наличии. Гарантия.',
  },
]);

// eslint-disable-next-line max-len
const currentDescription = () => {
  const current = descriptions.value.find((el) => el.category === currentCategory.value)?.text;
  return current;
};

useHead({
  meta: [
    { name: 'description', content: 'currentDescription' },
  ],
});

const api = useApi();
const categories = useCategories();

// eslint-disable-next-line no-undef
onMounted(() => {
  currentCategory.value = window.location.pathname.split('/').pop();
  api.currentCategory = currentCategory.value;
  const uuidCategory = categories.categories.find(
    (el) => el.link.split('/').pop() === currentCategory.value,
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
