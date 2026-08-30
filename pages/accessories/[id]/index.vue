<template>
  <div class="accessoryCategory">
    <nav class="accessoryCategory__breadcrumbs" aria-label="Хлебные крошки">
      <NuxtLink to="/" class="accessoryCategory__crumb">Главная</NuxtLink>
      <span class="accessoryCategory__sep">/</span>
      <NuxtLink to="/accessories" class="accessoryCategory__crumb">Аксессуары</NuxtLink>
      <span class="accessoryCategory__sep">/</span>
      <span class="accessoryCategory__crumb accessoryCategory__crumb--current">
        {{ desc.crumb }}
      </span>
    </nav>
  </div>
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
import { SITE_URL } from '~/composables/useSiteUrl.ts';

const route = useRoute();
const api = useApi();
const categories = useCategories();

const currentCategory = ref(route.params.id);

const validAccessories = ['case', 'cable', 'mouse'];
if (!validAccessories.includes(currentCategory.value)) {
  // eslint-disable-next-line no-undef
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    fatal: true,
  });
}

const accessoryDescriptions = {
  case: {
    crumb: 'Аксессуары для iPhone',
    title: 'Аксессуары для iPhone — купить в Рязани | РК-Тек',
    description: 'Чехлы, защитные стёкла и аксессуары для iPhone в Рязани. Быстрая доставка, гарантия качества.',
    keywords: 'аксессуары для iphone, чехлы iphone, защитное стекло iphone, купить москва',
    img: '/images/case.webp',
  },
  cable: {
    crumb: 'Адаптеры питания и кабели для зарядки',
    title: 'Кабели и адаптеры питания Apple — купить в Рязани | РК-Тек',
    description: 'Оригинальные кабели и адаптеры питания Apple в Рязани. Быстрая доставка, гарантия.',
    keywords: 'кабель apple, адаптер питания apple, зарядка iphone, купить кабель москва',
    img: '/images/cable.webp',
  },
  mouse: {
    crumb: 'Клавиатуры и мыши',
    title: 'Клавиатуры и мыши Apple — купить в Рязани | РК-Тек',
    description: 'Оригинальные клавиатуры и мыши Apple в Рязани. Magic Mouse, Magic Keyboard с доставкой.',
    keywords: 'magic mouse купить, magic keyboard купить, клавиатура apple, мышь apple москва',
    img: '/images/mouse.webp',
  },
};

const desc = accessoryDescriptions[currentCategory.value] || {
  crumb: 'Аксессуары',
  title: `Аксессуары ${currentCategory.value} — РК-Тек`,
  description: 'Аксессуары для Apple в Рязани. Быстрая доставка, гарантия качества.',
  keywords: 'аксессуары apple, купить москва',
  img: '/images/accessories.webp',
};

const pageUrl = `${SITE_URL}/accessories/${currentCategory.value}`;

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
            name: 'Аксессуары',
            item: `${SITE_URL}/accessories`,
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
.accessoryCategory {
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
