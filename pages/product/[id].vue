<template>
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
import { ref } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const selectedProducts = (product) => {
  console.log(product);
};
</script>
<style scoped>
.mainProducts {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 70px;
  padding: 20px;
}
</style>
