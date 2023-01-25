<template>
  <div class="mainCardProduct">
    <img class="imgProduct" :src="baseImg" alt="" />
    <div class="infoContainer">
      <div class="header">
        <h3 class="productName">{{ product.name }}</h3>
        <span class="price">{{ price }} <strong>₽</strong> </span>
      </div>
      <div class="optionsContainer">
        <Option
          v-for="option in product.options"
          :key="option.name"
          :option="option"
          @selectedOpt="(id) => selectedOpt(id)"
        />
      </div>
    </div>
    <button class="buttonProduct" @click="sendToShopBag">В корзину</button>
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, computed } from 'vue';

const emit = defineEmits(['selectedProducts']);
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  product: Object,
});
const selectedColor = ref(null);
const price = computed(() => new Intl.NumberFormat('ru').format(props.product.price));
const selectedOptions = ref([]);

const baseImg = computed(() => {
  if (selectedColor.value) {
    const selectedVariant = props.product.variants.find((el) => el.id === selectedColor.value);
    return selectedVariant.optionsInfo.images[0];
  }
  return props.product.variants[0].optionsInfo?.images[0];
});
const selectedOpt = (id) => {
  selectedOptions.value.push(id);
};

const selectedProduct = ref([]);

const sendToShopBag = () => {
  selectedProduct.value.push([props.product, selectedOptions.value]);
  console.log(selectedProduct.value);
  emit('selectedProducts', selectedProduct.value);
};

// eslint-disable-next-line no-undef
onMounted(() => {});

// console.log(options);
</script>

<style scoped lang="scss">
.mainCardProduct {
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 300px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  border-radius: 12px;
}

.imgProduct {
  width: 100%;
  height: 300px;
  background-color: #eee;
}

.infoContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
}

.productName {
  font-size: 20px;
  font-family: -apple-system, Roboto, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
}

.price {
  font-family: -apple-system, Roboto, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #373737;
}

.optionsContainer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.buttonProduct {
  height: 40px;
  background-color: #2c2c2c;
  color: #fff;
  border-radius: 10px;
  border: 1px solid #242424;
  margin: 15px 20px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    box-shadow: 0 0 10px rgba(103, 103, 103, 0.781);
    background-color: #313131;
  }
}
</style>
