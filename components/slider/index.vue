<template>
  <div class="mainSliderContainer">
    <NuxtLink
      v-for="card in props.categories.categories"
      :key="card"
      :to="card.link"
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
import { useApi } from '~/stores/api';

const api = useApi();

const props = defineProps({
  categories: {
    type: Object,
    default: () => {},
  },
});

const getProduct = (link) => {
  const uuidSelectCategory = props.categories.categories.find((el) => el.link === link)?.uuid;
  api.getProducts(uuidSelectCategory);
};

// eslint-disable-next-line no-undef
onMounted(() => {});
</script>

<style scoped lang="scss">
.mainSliderContainer {
  display: flex;
  gap: 30px;
  overflow: scroll;
  scroll-behavior: smooth;
  padding: 20px 10px;
  flex-shrink: 0;

  @media (max-width: 500px) {
    scroll-snap-type: x mandatory;
    padding: 20px 100px;
  }
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
    @media (max-width: 500px) {
      scroll-snap-align: center;
    }
    &:hover {
      box-shadow: 0 0 20px #c4c4c4;
    }
  }
}

.header {
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 22px;
  color: #2c2c2c;
  text-align: center;
}
.img {
  object-fit: fill;
  width: 100%;
  background-color: #fff;
}
</style>
