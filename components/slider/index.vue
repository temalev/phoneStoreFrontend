<template>
  <div class="mainSliderContainer">
    <NuxtLink
      v-for="card in categories.categories"
      :key="card"
      :to="`/product/${card.link}`"
      @click="getProduct(card.link)"
    >
      <div class="productLink">
        <div class="header">{{ card.name }}</div>
        <img class="img" :src="card.img" />
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { useCategories } from '~/stores/categories';
import { useApi } from '~/stores/api';

const categories = useCategories();
const api = useApi();

const getProduct = (link) => {
  const uuidSelectCategory = categories.categories.find((el) => el.link === link)?.uuid;
  api.getProducts(uuidSelectCategory);
};

// eslint-disable-next-line no-undef
onMounted(() => {
  console.log(categories);
});
</script>

<style scoped lang="scss">
.mainSliderContainer {
  display: flex;
  gap: 30px;
  overflow: scroll;
  padding: 20px 10px;
  &::-webkit-scrollbar {
    display: none;
  }
  .productLink {
    width: 300px;
    height: 350px;
    flex-shrink: 0;
    overflow: hidden;
    padding-top: 40px;
    background-color: #fff;
    box-shadow: 0 0 5px #dadada;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    transition: 0.2s;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 20px #c4c4c4;
    }
  }
}

.header {
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: #2c2c2c;
}
.img {
  object-fit: fill;
  width: 100%;
}
</style>
