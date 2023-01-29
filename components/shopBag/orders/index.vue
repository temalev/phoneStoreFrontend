<template>
  <div class="orders">
    <ShopBagOrdersOrder
      v-for="(order, idOrder) in orders"
      :key="idOrder"
      :order="order"
      @orderPrice="orderPrice"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  orders: Object,
});

const emit = defineEmits(['orderPrice']);

const orderPrice = (val) => {
  emit('orderPrice', val);
};

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
