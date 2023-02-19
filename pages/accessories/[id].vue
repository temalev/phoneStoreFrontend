<template>
  <Head>
    <Title>RK-Tech - {{ currentCategory }}</Title>
  </Head>
  <div v-if="api.products" class="mainProducts">
    <CardProduct v-for="product in api.products" :key="product.uuid" :product="product" />
  </div>
  <div v-else class="loader">загрузка</div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const currentCategory = ref(null);
// const orders = ref([]);

// eslint-disable-next-line no-undef
onMounted(() => {
  currentCategory.value = window.location.href.split('/').at(-1);
});
// const selectedProducts = (product) => {
//   orders.value.push(product);
//   localStorage.setItem('orders', JSON.stringify(orders.value));
//   console.log(JSON.parse(localStorage.orders));
// };
</script>
<style scoped>
.mainProducts {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 70px;
  padding: 20px;
}
</style>
