<template>
  <div class="mainSliderContainer">
    <NuxtLink
      v-for="card in props.categories.categories"
      :key="card"
      :to="!isNoLink ? card.link : ''"
    >
      <div class="productLink" :style="{borderRadius: isMessageBlock ? '10px 10px 0 0' : '10px'}">
        <div class="header">{{ card.name }}</div>
        <img class="img" :src="card.img" :alt="card.name" />
      </div>
      <div v-if="isMessageBlock" class="message-block">
        <p>
          Мы всегда рады найти для вас нужный товар данного производителя по
          выгодной цене!<br /> <br>
          Свяжитесь с нами в мессенджерах, которые указаны внизу страницы.
        </p>
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
  isNoLink: {
    type: Boolean,
    default: false,
  },
  isMessageBlock: {
    type: Boolean,
    default: false,
  },
});

// eslint-disable-next-line no-undef
onMounted(() => {});
</script>

<style scoped lang="scss">
.mainSliderContainer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  overflow: scroll;
  scroll-behavior: smooth;
  padding: 20px 10px;
  flex-shrink: 0;
  width: inherit;

  @media (max-width: 500px) {
    scroll-snap-type: x mandatory;
    padding: 20px 100px;
    width: auto;
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

.message-block {
  // margin-top: 10px;
  padding: 12px;
  background-color: #ffffff;
  border-top: 1px solid #eee;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 0px 10px 5px rgb(247, 247, 247);
  font-size: 11px;
  color: #353535;
  width: 300px;
  box-sizing: border-box;
  // box-shadow: inset 0 5px 10px 5px #dedede;
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
