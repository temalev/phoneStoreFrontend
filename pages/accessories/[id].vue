<template>
  <Head>
    <Title>RK-Tech - {{ currentCategory }}</Title>
  </Head>
  <div v-if="api.products" class="mainProducts">
    <template v-if="api.isAuth">
      <CardProductEdit v-for="product in api.products?.[currentCategory]?.filter(el => !el.isDeleted)" :key="product.uuid" :product="product" />
    </template>
    <template v-else>
      <CardProduct v-for="product in api.products?.[currentCategory]?.filter(el => !el.isDeleted)" :key="product.uuid" :product="product" />
    </template>
  </div>
  <div v-else class="loader">загрузка</div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';
import { useCategories } from '~/stores/categories';

const api = useApi();
const categories = useCategories();

const currentCategory = ref(null);
// const orders = ref([]);
// eslint-disable-next-line no-undef
onMounted(() => {
  const cat = categories.categories.find((el) => el.categories);
  currentCategory.value = window.location.pathname.split('/').pop();
  api.currentCategory = currentCategory.value;

  const uuidCategory = cat.categories.find(
    (el) => el.link.toLowerCase().includes(currentCategory.value),
  ).uuid;
  api.getProducts(uuidCategory);
});
// const selectedProducts = (product) => {
//   orders.value.push(product);
//   localStorage.setItem('orders', JSON.stringify(orders.value));
//   console.log(JSON.parse(localStorage.orders));
// };
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
