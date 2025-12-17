<template>
  <div v-if="api.products" class="mainProducts">
    <Head>
      <Title>{{ currentProduct().title }}</Title>
    </Head>
    <h1 style="text-transform: capitalize;">{{currentProduct().category}}</h1>
    <div class="mainProducts-list">
    <template v-if="api.isAuth">
      <CardProductEdit
        v-for="product in api.products?.[currentCategory]?.filter(
          (el) => !el.isDeleted
        )"
        :key="product.uuid"
        :product="product"
      />
    </template>
    <template v-else>
      <CardProduct
        v-for="product in api.products?.[currentCategory]?.filter(
          (el) => !el.isDeleted
        )"
        :key="product.uuid"
        :product="product"
      />
    </template>
  </div>
  </div>
  <div v-else class="loader">загрузка</div>

</template>

<script setup>
import { ref, computed } from "vue";
import { useApi } from "~/stores/api";
import { useCategories } from "~/stores/categories";
import { useHead } from "unhead";
import { useRoute } from "vue-router";

const route = useRoute();
const currentCategory = ref(null);

const path = route.fullPath;
currentCategory.value = route.params.id;
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
]);

// eslint-disable-next-line max-len
const currentProduct = () => {
  const current = descriptions.value.find(
    (el) => el.category === currentCategory.value
  );
  return current;
};

useHead({
  link: [
    {
      rel: "canonical",
      href: `https://рк-тек.рф${path}`,
    },
  ],
  meta: [
    { property: "og:description", content: currentProduct().description },
    { property: "og:title", content: currentProduct().title },
    { property: "og:image", content: currentProduct().img },
    {
      hid: "title",
      name: "title",
      content: currentProduct().title,
    },
    {
      hid: "description",
      name: "description",
      content: currentProduct().description,
    },
    {
      name: "keywords",
      content: `${currentProduct()?.keywords}`,
    },
  ],
});

const api = useApi();
const categories = useCategories();

// eslint-disable-next-line no-undef
onMounted(() => {
  api.currentCategory = currentCategory.value;
  const uuidCategory = categories.categories.find(
    (el) => el.link.split("/").pop() === currentCategory.value
  ).uuid;
  api.getProducts(uuidCategory);
});
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
</style>
