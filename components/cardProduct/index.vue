<template>
  <div class="mainCardProduct">
    <div class="mainCardContainer">
      <img class="imgProduct" :src="baseImg" alt="" />
      <div class="infoContainer">
        <div class="header">
          <h3 class="productName">{{ product.name }}</h3>
          <span class="price">{{ price }} <strong>₽</strong> </span>
        </div>
        <div class="optionsContainer">
          <Option
            v-for="(option, idOpt) in product.options"
            :key="option.name"
            :option="option"
            @selectedOpt="(id) => selectedOpt(id, idOpt)"
          />
        </div>
      </div>
    </div>
    <div class="wrapperButton">
      <CustomButton @click="sendToShopBag" :name="'В корзину'" />
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const emit = defineEmits(['selectedProducts']);
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  product: Object,
});

const selectedColor = ref(null);
// const price = computed(() => new Intl.NumberFormat('ru').format(props.product.price));
const selectedOptions = ref([]);

const baseImg = computed(() => {
  if (selectedOptions.value.length) {
    // eslint-disable-next-line max-len
    let canditate = null;
    props.product.variants
      // eslint-disable-next-line max-len
      .forEach(({ optionsIds }, idx) => {
        const isContains = optionsIds.every((optionId) => selectedOptions.value.includes(optionId));

        if (isContains) {
          canditate = props.product.variants[idx];
        }
      });
    return canditate.optionsInfo.images[0];
  }
  return props.product.variants[0].optionsInfo?.images[0];
});

const price = computed(() => {
  if (selectedOptions.value.length) {
    // eslint-disable-next-line max-len
    let canditate = null;
    props.product.variants
      // eslint-disable-next-line max-len
      .forEach(({ optionsIds }, idx) => {
        const isContains = optionsIds.every((optionId) => selectedOptions.value.includes(optionId));

        if (isContains) {
          canditate = props.product.variants[idx];
        }
      });
    return new Intl.NumberFormat('ru').format(canditate.optionsInfo.price);
  }
  return new Intl.NumberFormat('ru').format(props.product.price);
});

const selectedOpt = (id, index) => {
  selectedOptions.value[index] = id;
};

const sendToShopBag = () => {
  // TODO хранить uuid продукта, чтобы проверять актуальность данных, в первую очередь цены
  const selectedProduct = { product: props.product, options: selectedOptions.value };
  api.orders.push(selectedProduct);
  localStorage.setItem('orders', JSON.stringify(api.orders));
};

// eslint-disable-next-line no-undef
onMounted(() => {});
</script>

<style scoped lang="scss">
.mainCardProduct {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 330px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  border-radius: 12px;
}

.wrapperButton {
  padding: 30px 20px;
  width: 100%;
  box-sizing: border-box;
}

.mainCardContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.imgProduct {
  width: 250px;
  height: 250px;
  background-color: #eee;
}

.infoContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
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
</style>
