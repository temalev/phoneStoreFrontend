<template>
  <div v-if="isLoading" class="mainProducts">
    <div class="skeleton-title"></div>
    <div class="mainProducts-list">
      <CardProductSkeleton v-for="i in 6" :key="i" />
    </div>
  </div>
  <div v-else class="mainProducts">
    <h1 style="text-transform: capitalize;">{{currentProduct().category}}</h1>
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
import { ref } from "vue";
import { useApi } from "~/stores/api";
import { useCategories } from "~/stores/categories";
import { useRoute } from "vue-router";

const route = useRoute();
const config = useRuntimeConfig();

const currentCategory = ref(route.params.category);

const apiBase = config.public.URL;
const pageUrl = `https://рк-тек.рф/${currentCategory.value}`;

const descriptions = ref([
  {
    category: "iphone",
    title: "Купить Apple iPhone в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальный Apple iPhone в Москве и Рязани с бесплатной доставкой. Низкие цены, гарантия, проверка при получении. Чехол и стекло в подарок.",
    keywords:
      "купить iphone, iphone цена, оригинальный iphone, iphone с доставкой, купить iphone в москве, купить iphone в рязани",
    img: "/images/iphone.webp",
  },
  {
    category: "ipad",
    title: "Купить Apple iPad в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальный Apple iPad в Москве и Рязани с бесплатной доставкой. Актуальные модели, низкие цены, официальная гарантия.",
    keywords:
      "купить ipad, ipad цена, оригинальный ipad, ipad с доставкой, купить ipad в москве, купить ipad в рязани",
    img: "/images/ipad.webp",
  },
  {
    category: "mac",
    title: "Купить Apple MacBook в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальный Apple MacBook в Москве и Рязани с бесплатной доставкой. Гарантия, низкие цены, гравировка в подарок.",
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
      "Купить оригинальные смартфоны Samsung в Москве и Рязани с бесплатной доставкой. Гарантия, низкие цены.",
    keywords:
      "купить samsung, samsung цена, смартфоны samsung, samsung с доставкой",
    img: "/images/samsung.webp",
  },
  {
    category: "dyson",
    title: "Купить Dyson в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить оригинальную технику Dyson в Москве и Рязани с бесплатной доставкой. Фены, пылесосы, стайлеры в наличии.",
    keywords:
      "купить dyson, dyson цена, техника dyson, dyson с доставкой",
    img: "/images/dyson.webp",
  },
  {
    category: "ps",
    title: "Купить PlayStation 5 в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить PlayStation 5 с дисководом в Москве и Рязани с бесплатной доставкой. Оригинал, гарантия, в наличии.",
    keywords:
      "купить playstation 5, ps5 цена, playstation 5 с дисководом, ps5 с доставкой",
    img: "/images/ps.webp",
  },
  {
    category: "canon",
    title: "Купить Canon в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить Canon в Москве и Рязани с бесплатной доставкой. Оригинал, гарантия, в наличии.",
    keywords:
      "купить Canon, Canon цена, Canon, Canon с доставкой",
    img: "/images/camera.webp",
  },
  {
    category: "whoop",
    title: "Купить Whoop в Москве и Рязани — цены | РК-Тек",
    description:
      "Купить Whoop в Москве и Рязани с бесплатной доставкой. Оригинал, гарантия, в наличии.",
    keywords:
      "купить Whoop, Whoop цена, Whoop, Whoop с доставкой",
    img: "/images/camera.webp",
  },
]);

// eslint-disable-next-line max-len
const currentProduct = () => descriptions.value.find((el) => el.category === currentCategory.value);

useHead({
  title: currentProduct().title,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: currentProduct().description },
    { name: 'keywords', content: currentProduct().keywords },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: currentProduct().title },
    { property: 'og:description', content: currentProduct().description },
    { property: 'og:image', content: currentProduct().img },
    { property: 'og:url', content: pageUrl },
    { property: 'og:site_name', content: 'РК-Тек' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: currentProduct().title },
    { name: 'twitter:description', content: currentProduct().description },
    { name: 'twitter:image', content: currentProduct().img },
  ],
});

const api = useApi();
const categories = useCategories();

const uuidCategory = categories.categories.find(
  (el) => el.link.split("/").pop() === currentCategory.value
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
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 80px;
  padding: 20px;

  & h1 {
    margin-left: 30px;
  }

  &-list {
    display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 20px;
  }
}

.skeleton-title {
  height: 40px;
  width: 200px;
  margin-left: 30px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
