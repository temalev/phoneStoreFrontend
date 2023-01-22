<template>
  <div class="mainCardProduct">
    <img class="imgProduct" src="" alt="" />
    <div class="infoContainer">
      <div class="header">
        <h3>{{ product.name }}</h3>
        <span class="price">{{ price }} <strong>₽</strong> </span>
      </div>
    </div>
    <button class="buttonProduct">В корзину</button>
  </div>
</template>
<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { computed } from 'vue';
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  product: Object,
});
const price = computed(() => new Intl.NumberFormat('ru').format(props.product.price));
</script>
<style scoped lang="scss">
.mainCardProduct {
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 300px;
  height: 400px;
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
  margin: 10px;
}

.price {
  font-family: -apple-system, Roboto, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #373737;
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
