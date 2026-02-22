<template>
  <div v-if="api.products" class="mainProducts">
    <template v-if="api.isAuth">
      <CardProductEdit v-for="product in api.products?.[currentCategory]?.filter(el => !el.isDeleted)" :key="product.uuid || product._tempId" :product="product" />
    </template>
    <template v-else>
      <CardProduct v-for="product in api.products?.[currentCategory]?.filter(el => !el.isDeleted)" :key="product.uuid" :product="product" />
    </template>
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

const accessoryDescriptions = {
  case: {
    title: 'Аксессуары для iPhone — купить в Москве | РК-Тек',
    description: 'Чехлы, защитные стёкла и аксессуары для iPhone в Москве. Быстрая доставка, гарантия качества.',
    keywords: 'аксессуары для iphone, чехлы iphone, защитное стекло iphone, купить москва',
    img: '/images/case.webp',
  },
  cable: {
    title: 'Кабели и адаптеры питания Apple — купить в Москве | РК-Тек',
    description: 'Оригинальные кабели и адаптеры питания Apple в Москве. Быстрая доставка, гарантия.',
    keywords: 'кабель apple, адаптер питания apple, зарядка iphone, купить кабель москва',
    img: '/images/cable.webp',
  },
  mouse: {
    title: 'Клавиатуры и мыши Apple — купить в Москве | РК-Тек',
    description: 'Оригинальные клавиатуры и мыши Apple в Москве. Magic Mouse, Magic Keyboard с доставкой.',
    keywords: 'magic mouse купить, magic keyboard купить, клавиатура apple, мышь apple москва',
    img: '/images/mouse.webp',
  },
};

const desc = accessoryDescriptions[currentCategory.value] || {
  title: `Аксессуары ${currentCategory.value} — РК-Тек`,
  description: 'Аксессуары для Apple в Москве. Быстрая доставка, гарантия качества.',
  keywords: 'аксессуары apple, купить москва',
  img: '/images/accessories.webp',
};

const pageUrl = `https://рк-тек.рф/accessories/${currentCategory.value}`;

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
