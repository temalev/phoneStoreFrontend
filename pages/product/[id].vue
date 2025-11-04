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
    description:
      "Купить Apple iPhone в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинал. В наличии. Гарантия. Чехол и стекло в подарок.",
    title: "Купить Apple Iphone в РК-Тек по выгодной цене",
    img: "/images/iphone.webp",
  },
  {
    category: "ipad",
    description:
      "Купить Apple iPad в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинальная продукция. В наличии. Гарантия.",
    title: "Купить Apple iPad в РК-Тек по выгодной цене",
    img: "/images/ipad.webp",
  },
  {
    category: "mac",
    description:
      "Купить Apple Macbook в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинал. В наличии. Гарантия. Гравировка в подарок.",
    title: "Купить Apple Macbook в РК-Тек по выгодной цене",
    img: "/images/mac.webp",
  },
  {
    category: "watch",
    description:
      "Купить Apple Watch в Москве и Рязани с быстрой доставкой. Низкие цены. Оригинальная продукция. В наличии. Гарантия.",
    title: "Купить Apple Watch в РК-Тек по выгодной цене",
    img: "/images/watchCard.webp",
  },
  {
    category: "airpods",
    description:
      "Купить Apple AirPods в Москве и Рязани с быстрой доставкой. Низкие цены. Оригинальная продукция. В наличии. Гарантия.",
    title: "Купить Apple AirPods в РК-Тек по выгодной цене",
    img: "/images/airpods.webp",
  },
  {
    category: "samsung",
    description:
      "Купить Samsung в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинал. В наличии. Гарантия.",
    title: "Купить Samsung в РК-Тек по выгодной цене",
    img: "/images/samsung.webp",
  },
  {
    category: "dyson",
    description:
      "Купить Dyson в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинал. В наличии. Гарантия.",
    title: "Купить Dyson в РК-Тек по выгодной цене",
    img: "/images/dyson.webp",
  },
  {
    category: "ps",
    description:
      "Купить PlayStation 5 с дисководом в Москве и Рязани с бесплатной доставкой. Низкие цены. Оригинал. В наличии. Гарантия.",
    title: "Купить PlayStation в РК-Тек по выгодной цене",
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
      content: `${currentCategory.value}, apple, купить, цена, интернет-магазин, каталог, бесплатная доставка, Москва, Рязань, оригинал`,
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
