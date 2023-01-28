<template>
  <div class="order">
    <div class="leftContainer">
      <img :src="imageOrder" :alt="order.product.name" width="50" height="50" class="imgOrder" />
      <div class="infoContainer">
        <span class="nameOrder">{{ order.product.name }}</span>
        <span class="orderOptions">Gold</span>
      </div>
    </div>

    <div class="rightContainer">
      <div class="icoClose">{{}}</div>
      <span class="priceOrder">{{ orderPrice }} <strong>₽</strong> </span>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  order: Object,
});

const imageOrder = ref(null);
const orderPrice = ref(null);

const img = () => {
  props.order.product.variants.forEach(({ optionsIds }, idx) => {
    const isContains = optionsIds.every((optionId) => props.order.options.includes(optionId));
    if (isContains) {
      // eslint-disable-next-line prefer-destructuring
      imageOrder.value = props.order.product.variants[idx].optionsInfo.images[0];
    }
  });
};

const price = () => {
  props.order.product.variants.forEach(({ optionsIds }, idx) => {
    const isContains = optionsIds.every((optionId) => props.order.options.includes(optionId));
    if (isContains) {
      // eslint-disable-next-line prefer-destructuring
      orderPrice.value = new Intl.NumberFormat('ru').format(
        props.order.product.variants[idx].optionsInfo.price,
      );
    }
  });
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
}

.infoContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 300;
  color: #373737;
}

.rightContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 300;
  color: #373737;
  flex-shrink: 0;
}
</style>