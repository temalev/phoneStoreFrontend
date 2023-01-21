<template>
  <div v-if="determiningWidth.isDesktop" class="mainHeader">
    <NuxtLink to="/">
      <div class="logo" />
    </NuxtLink>

    <nav class="menu">
      <NuxtLink
        v-for="link in categories.categories"
        :key="link.name"
        :to="`/product/${link.link}`"
        class="navLink"
      >
        <div
          class="ico"
          :style="{
            backgroundImage: `url(${link.ico})`,
            width: `${link.style?.width}px`,
            height: `${link.style?.height}px`,
          }"
        />
        <span class="name">{{ link.name }}</span>
      </NuxtLink>
    </nav>

    <div class="leftContainer">
      <div class="call" />
      <div class="shopBag" @click="isShopBag = true" />
    </div>
    <ShopBag v-if="isShopBag" @closeShopBag="isShopBag = false" />
  </div>

  <div v-else class="mainHeader">
    <div class="wrapper" style="justify-content: flex-start">
      <div class="btnMenu" />
    </div>

    <div class="wrapper" style="justify-content: center">
      <div class="logo" />
    </div>

    <div class="wrapper" style="justify-content: flex-end">
      <div class="leftContainer">
        <div class="call" />
        <div class="shopBag" @click="isShopBag = true" />
      </div>
    </div>
    <ShopBag v-if="isShopBag" @closeShopBag="isShopBag = false" />
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref } from 'vue';
import { useDetermininingWidth } from '~/stores/determiningWidth';
import { useCategories } from '~/stores/categories';

const isShopBag = ref(false);
const determiningWidth = useDetermininingWidth();
const categories = useCategories();
</script>

<style scoped lang="scss">
.mainHeader {
  position: fixed;
  z-index: 5;
  top: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 70px;
  width: 100%;
  box-shadow: 0 0 10px #868686;
  box-sizing: border-box;

  @media (max-width: 750px) {
    padding: 0 20px;
  }
}

.logo {
  background-image: url(~/public/icons/rk.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100px;
  height: 50px;
  transition: 0.1s;
  cursor: pointer;
  border-bottom: 1px solid transparent;

  &:hover {
    border-bottom: 1px solid rgb(89, 89, 89);
  }
}

.menu {
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: space-around;
}

.navLink {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: 50px;
  box-sizing: border-box;
  cursor: pointer;
  color: #2c2c2c;

  &:hover {
    color: #000000;
  }
}

.name {
  font-family: Inter, Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
}

.ico {
  width: 50px;
  height: 50px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.leftContainer {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.call {
  background-image: url(~/public/icons/call.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.shopBag {
  background-image: url(~/public/icons/shopBag.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.btnMenu {
  background-image: url(~/public/icons/burger.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
}

.wrapper {
  display: flex;
  flex: 1;
}
</style>
