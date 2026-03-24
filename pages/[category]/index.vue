<template>
  <div v-if="isLoading" class="mainProducts">
    <div class="category-header">
      <div class="skeleton-breadcrumb" />
      <div class="skeleton-title" />
      <div class="skeleton-desc" />
    </div>
    <div class="mainProducts-list">
      <CardProductSkeleton v-for="i in 6" :key="i" />
    </div>
  </div>
  <div v-else class="mainProducts">
    <div class="category-header">
      <nav class="category-breadcrumbs" aria-label="Хлебные крошки">
        <NuxtLink to="/" class="category-breadcrumbs__item">Главная</NuxtLink>
        <span class="category-breadcrumbs__sep">/</span>
        <span class="category-breadcrumbs__item category-breadcrumbs__item--current">
          {{ categoryName }}
        </span>
      </nav>
      <h1 class="category-title">
        {{ currentProduct()?.title?.split('—')[0]?.trim() ?? categoryName }}
      </h1>
      <p class="category-desc">{{ currentProduct()?.description ?? '' }}</p>
    </div>

    <div class="mainProducts-list">
    <template v-if="api.isAuth">
      <CardProductEdit
        v-for="product in (api.products?.[currentCategory] ?? products)?.filter(
          (el) => !el.isDeleted
        )"
        :key="product.uuid || product._tempId"
        :product="product"
      />
    </template>
    <template v-else>
      <CardProduct
        v-for="product in (api.products?.[currentCategory] ?? products)?.filter(
          (el) => !el.isDeleted
        )"
        :key="product.uuid"
        :product="product"
      />
    </template>
  </div>
  </div>

</template>

<script setup>
import { ref, computed } from "vue";
import { useApi } from "~/stores/api";
import { useCategories } from "~/stores/categories";
import { useRoute } from "vue-router";

const route = useRoute();
const config = useRuntimeConfig();

const currentCategory = ref(route.params.category);

const apiBase = config.public.URL;
const siteUrl = 'https://рк-тек.рф';
const pageUrl = `${siteUrl}/${currentCategory.value}`;

const descriptions = ref([
  {
    category: "iphone",
    title: "Купить Apple iPhone в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальный Apple iPhone в Москве и Рязани с быстрой доставкой. Низкие цены, гарантия, проверка при получении. Чехол и стекло в подарок.",
    keywords:
      "купить iphone, iphone цена, оригинальный iphone, iphone с доставкой, купить iphone в москве, купить iphone в рязани",
    img: "/images/iphone.webp",
  },
  {
    category: "ipad",
    title: "Купить Apple iPad в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальный Apple iPad в Москве и Рязани с быстрой доставкой. Актуальные модели, низкие цены, официальная гарантия.",
    keywords:
      "купить ipad, ipad цена, оригинальный ipad, ipad с доставкой, купить ipad в москве, купить ipad в рязани",
    img: "/images/ipad.webp",
  },
  {
    category: "mac",
    title: "Купить Apple MacBook в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальный Apple MacBook в Москве и Рязани с быстрой доставкой. Гарантия, низкие цены, гравировка в подарок.",
    keywords:
      "купить macbook, macbook цена, macbook apple, оригинальный macbook, macbook с доставкой",
    img: "/images/mac.webp",
  },
  {
    category: "watch",
    title: "Купить Apple Watch в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальные Apple Watch в Москве и Рязани с быстрой доставкой. Все актуальные модели, гарантия.",
    keywords:
      "купить apple watch, apple watch цена, оригинальные apple watch, apple watch с доставкой",
    img: "/images/watchCard.webp",
  },
  {
    category: "airpods",
    title: "Купить Apple AirPods в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальные Apple AirPods в Москве и Рязани с быстрой доставкой. Низкие цены, гарантия.",
    keywords:
      "купить airpods, airpods цена, оригинальные airpods, airpods с доставкой",
    img: "/images/airpods.webp",
  },
  {
    category: "samsung",
    title: "Купить Samsung в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальные смартфоны Samsung в Москве и Рязани с быстрой доставкой. Гарантия, низкие цены.",
    keywords:
      "купить samsung, samsung цена, смартфоны samsung, samsung с доставкой",
    img: "/images/samsung.webp",
  },
  {
    category: "dyson",
    title: "Купить Dyson в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальную технику Dyson в Москве и Рязани с быстрой доставкой. Фены, пылесосы, стайлеры в наличии.",
    keywords:
      "купить dyson, dyson цена, техника dyson, dyson с доставкой",
    img: "/images/dyson.webp",
  },
  {
    category: "ps",
    title: "Купить PlayStation 5 в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить PlayStation 5 с дисководом в Москве и Рязани с быстрой доставкой. Оригинал, гарантия, в наличии.",
    keywords:
      "купить playstation 5, ps5 цена, playstation 5 с дисководом, ps5 с доставкой",
    img: "/images/ps.webp",
  },
  {
    category: "canon",
    title: "Купить Canon в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить Canon в Москве и Рязани с быстрой доставкой. Оригинал, гарантия, в наличии.",
    keywords:
      "купить Canon, Canon цена, Canon, Canon с доставкой",
    img: "/images/camera.webp",
  },
  {
    category: "whoop",
    title: "Купить Whoop в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить Whoop в Москве и Рязани с быстрой доставкой. Оригинал, гарантия, в наличии.",
    keywords:
      "купить Whoop, Whoop цена, Whoop, Whoop с доставкой",
    img: "/images/whoop.webp",
  },
  {
    category: "other",
    title: "Другое — товары в Москве и Рязани | РК-Тек",
    description:
      "Купить товары других брендов в Москве и Рязани с быстрой доставкой. Оригинал, гарантия.",
    keywords:
      "купить техника, другие бренды, доставка Москва Рязань",
    img: "/images/other.webp",
  },
]);

// eslint-disable-next-line max-len
const currentProduct = () => descriptions.value.find((el) => el.category === currentCategory.value);

useHead({
  title: currentProduct()?.title ?? '',
  link: [{ rel: 'canonical', href: pageUrl }],
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
            // eslint-disable-next-line max-len
            name: currentProduct()?.title?.split('—')[0]?.trim() ?? currentCategory.value,
            item: pageUrl,
          },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'РК Тек',
        url: siteUrl,
        telephone: '+7-910-503-32-37',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Рязань',
          streetAddress: 'ул. Кольцова, дом 12',
          addressCountry: 'RU',
        },
        areaServed: {
          '@type': 'City',
          name: 'Рязань',
        },
      }),
    },
  ],
  meta: [
    { name: 'description', content: currentProduct()?.description ?? '' },
    { name: 'keywords', content: currentProduct()?.keywords ?? '' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'og:title', content: currentProduct()?.title ?? '' },
    { property: 'og:description', content: currentProduct()?.description ?? '' },
    { property: 'og:image', content: `${siteUrl}${currentProduct()?.img ?? ''}` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:site_name', content: 'РК-Тек' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: currentProduct()?.title ?? '' },
    { name: 'twitter:description', content: currentProduct()?.description ?? '' },
    { name: 'twitter:image', content: `${siteUrl}${currentProduct()?.img ?? ''}` },
  ],
});

const api = useApi();
const categories = useCategories();

const categoryName = computed(() => {
  const found = categories.categories.find((c) => c.link === `/${currentCategory.value}`);
  return found?.name ?? currentCategory.value;
});

const uuidCategory = categories.categories.find(
  (el) => el.link.split('/').pop() === currentCategory.value,
)?.uuid;

const { data: products, pending: isLoading } = await useAsyncData(
  `products-${currentCategory.value}`,
  () => $fetch(`${apiBase}/api/v1/product?categoryUUID=${uuidCategory}`),
);

api.currentCategory = currentCategory.value;
if (products.value) {
  api.products[currentCategory.value] = products.value;
}

</script>

<style scoped lang="scss">
.mainProducts {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 80px;
  padding: 20px;

  &-list {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    padding: 20px;
  }
}

.category-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 30px 20px;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 850px) {
    padding: 16px 16px 16px;
  }
}

.category-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.category-breadcrumbs__item {
  color: #aeaeb2;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #1a1a1a;
  }

  &--current {
    color: #6b6b6b;
  }
}

.category-breadcrumbs__sep {
  color: #d1d1d6;
  font-size: 12px;
}

.category-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 4px 0 0;
  line-height: 1.2;

  @media (max-width: 850px) {
    font-size: 22px;
  }
}

.category-desc {
  font-size: 14px;
  color: #6b6b6b;
  margin: 0;
  line-height: 1.5;
  max-width: 600px;
}

.category-local {
  margin: 12px 30px 0;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e5e5e5;

  @media (max-width: 850px) {
    margin: 12px 16px 0;
  }
}

.category-local__title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 6px;
  color: #1a1a1a;
}

.category-local__text {
  margin: 0 0 6px;
  font-size: 14px;
  color: #4a4a4a;
  line-height: 1.5;
}

.category-local__list {
  margin: 0 0 4px 18px;
  padding: 0;
  font-size: 14px;
  color: #4a4a4a;
  line-height: 1.5;
}

$skeleton-gradient: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);

.skeleton-breadcrumb {
  height: 14px;
  width: 140px;
  background: $skeleton-gradient;
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 6px;
}

.skeleton-title {
  height: 34px;
  width: 320px;
  background: $skeleton-gradient;
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;

  @media (max-width: 600px) {
    width: 200px;
  }
}

.skeleton-desc {
  height: 16px;
  width: 480px;
  background: $skeleton-gradient;
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 6px;

  @media (max-width: 600px) {
    width: 100%;
  }
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
