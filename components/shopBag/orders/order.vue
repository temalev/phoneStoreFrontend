<template>
<div class="order">
      <img :src="imageOrder" alt="" class="imgOrder" />
      <div class="infoContainer">
        <span class="nameOrder">{{ order.product.name }}</span>
        <span class="orderOptions">Gold</span>
      </div>
      <div class="rightContainer">
        <div class="icoClose">{{  }}</div>
        <span class="priceOrder">120 000</span>
      </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  order: Object,
});

const imageOrder = ref(null);
const img = (() => {
  props.order.product.variants.forEach(({ optionsIds }, idx) => {
    const isContains = optionsIds.every((optionId) => props.order.options.includes(optionId));
    if (isContains) {
      // eslint-disable-next-line prefer-destructuring
      imageOrder.value = props.order.product.variants[idx].optionsInfo.images[0];
    }
  });
});

// eslint-disable-next-line no-undef
onMounted(() => {
  img();
});

</script>
<style scoped lang="scss">
.order {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin: 20px 0;

  &:last-child {
    border-bottom: none;
  }
}

.imgOrder {
  width: 50px;
  height: 50px;

}

.infoContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rightContainer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
