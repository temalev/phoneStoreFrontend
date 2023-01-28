<template>
  <Head>
    <Title>RK-Tech - {{ currentCategory }}</Title>
  </Head>
  <div class="mainProducts">
    <CardProduct
      v-for="product in api.products"
      :key="product.uuid"
      :product="product"
      @selectedProducts="(product) => selectedProducts(product)"
    />
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

// eslint-disable-next-line no-undef
onMounted(() => {
  const currentCategory = window.location.href.split('/').at(-1);
  console.log(currentCategory);
});
const selectedProducts = (product) => {
  console.log(product);
};
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
