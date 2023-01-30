<template>
  <div class="orders">
    <ShopBagOrdersOrder v-for="(order, idOrder) in api.orders" :key="idOrder" :order="order" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const emit = defineEmits(['orderPrice']);
const cost = ref(null);

// const orderPrice = (val) => {
//   emit('orderPrice', val);
// };

// eslint-disable-next-line no-undef
onMounted(() => {});
</script>

<style scoped lang="scss">
.orders {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 5px;
  overflow-y: auto;
}

.orders::-webkit-scrollbar {
  width: 0;
}
</style>
