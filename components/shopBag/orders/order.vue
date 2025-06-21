<template>
  <div class="order">
    <div class="leftContainer">
      <img :src="imageOrder" :alt="order.product.name" width="50" height="50" class="imgOrder" />
      <div class="infoContainer">
        <span class="nameOrder">{{ order.product.name }}</span>
        <span class="orderOptions">{{ getSelectedOptionsNames().join(' ') }}</span>
        <span v-if="order.quantity > 1" class="quantity">Количество: {{ order.quantity }}</span>
      </div>
    </div>

    <div class="rightContainer">
      <div class="icoDelete" @click="deleteOrder(order.product.uuid)" />
      <span class="priceOrder">{{ orderPrice }} <strong>₽</strong> </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const props = defineProps({
  order: Object,
});

const imageOrder = ref(null);
const orderPrice = ref(null);

const img = () => {
  if (props.order.product.variants.length) {
    props.order.product.variants.forEach(({ optionsIds }, idx) => {
      const isContains = optionsIds.every((optionId) => props.order.options.includes(optionId));
      if (isContains) {
      // eslint-disable-next-line prefer-destructuring
        imageOrder.value = props.order.product.variants[idx]?.optionsInfo.images?.[0]
          ? props.order.product.variants[idx]?.optionsInfo.images?.[0]
          : props.order.product.images?.[0];
      }
    });
  // eslint-disable-next-line prefer-destructuring
  } else imageOrder.value = props.order.product.images[0];
};

const price = () => {
  let basePrice = 0;
  if (props.order.product.variants.length) {
    props.order.product.variants.forEach(({ optionsIds }, idx) => {
      const isContains = optionsIds.every((optionId) => props.order.options.includes(optionId));
      if (isContains) {
      // eslint-disable-next-line prefer-destructuring
        basePrice = props.order.product.variants[idx].optionsInfo.price;
      }
    });
  } else {
    basePrice = props.order.product.price;
  }
  
  // Умножаем на количество товара
  const totalPrice = basePrice * (props.order.quantity || 1);
  orderPrice.value = new Intl.NumberFormat('ru').format(totalPrice);
};

const getSelectedOptionsNames = () => props.order.product.options.map(
  ({ items }) => items.find(({ id }) => props.order.options.includes(id)).name,
);

const deleteOrder = (uuid) => {
  const index = api.orders.findIndex((el) => {
    // Проверяем UUID товара
    if (el.product.uuid !== uuid) {
      return false;
    }

    // Если у товара есть варианты, проверяем также выбранные опции
    if (el.product.variants && el.product.variants.length > 0) {
      return el.options.length === props.order.options.length
        && el.options.every((optionId) => props.order.options.includes(optionId));
    }

    // Если вариантов нет, просто проверяем UUID
    return true;
  });

  if (index !== -1) {
    api.orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(api.orders));
    api.getTotalCost();
  }
};

// eslint-disable-next-line no-undef
onMounted(() => {
  img();
  price();
});
</script>
<style scoped lang="scss">
.order {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin: 10px 0;

  &:last-child {
    border-bottom: none;
  }
}

.leftContainer {
  display: flex;
  align-items: center;
}

.infoContainer {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 300;
  color: #373737;
  gap: 2px;
}

.quantity {
  font-size: 14px;
  color: #666;
}

.rightContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 14px;
  font-weight: 300;
  color: #373737;
  flex-shrink: 0;
}

.icoDelete {
  background-image: url(/icons/close.svg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 25px;
  height: 25px;
  cursor: pointer;
  opacity: 0.4;
  transition: 0.2s;

  &:hover {
    opacity: 1;
  }
}
</style>
