<template>
  <div class="mainHeader">
    <NuxtLink to="/">
      <div class="logo" />
    </NuxtLink>

    <nav class="menu">
      <NuxtLink
        v-for="link in categories.categories"
        :key="link.name"
        :to="link.link"
        class="navLink"
        @click="getProduct(link.link)"
      >
        <div
          class="ico"
          :style="{
            backgroundImage: `url(${link.ico})`,
            width: `${link.style?.width}px`,
            height: `${link.style?.height}px`,
          }"
        />
        <span v-if="link.isName" class="name">{{ link.name }}</span>
      </NuxtLink>
    </nav>

    <div v-if="!api.isAuth" class="leftContainer">
      <div class="telContainer">
        <a href="tel:+79156022896">+7 (915) 602-28-96</a>
      </div>
      <div class="shopBag" @click="isShopBag = true">
        <div v-if="totalItemsInCart > 0" class="ordersCounter">
          {{ totalItemsInCart }}
        </div>
      </div>
    </div>

    <div v-if="api.isAuth" class="leftContainerAdmin">
      <NuxtIcon name="plus" style="color: black; font-size: 20px" />
      <NuxtLink to="/OrdersList">
        <NuxtIcon name="doc" style="color: black; font-size: 20px" />
      </NuxtLink>
      <NuxtLink to="/admin">
        <NuxtIcon name="user" filled style="color: black; font-size: 22px" />
      </NuxtLink>
      <NuxtLink to="/" @click="logout">
        <NuxtIcon name="logout" filled style="color: black; font-size: 20px" />
      </NuxtLink>
    </div>
    <ShopBag v-if="isShopBag" @closeShopBag="isShopBag = false" />
  </div>

  <div class="mainHeader_mobile">
    <div
      class="wrapper"
      style="justify-content: space-between; align-items: center"
    >
      <div
        class="btnMenu"
        :class="isToLeft ? 'active' : ''"
        @click="isToLeft = !isToLeft, onMenu()"
      >
      <span></span>
        </div>
    </div>

    <div class="wrapper" style="justify-content: center">
      <NuxtLink @click="isToLeft = false, onMenu()" to="/">
        <div class="logo" />
      </NuxtLink>
    </div>

    <div class="wrapper" style="justify-content: flex-end">
      <div v-if="!api.isAuth" class="leftContainer">
        <a href="tel:+79156022896" class="call" />
        <div class="shopBag" @click="(isShopBag = true), (isMenu = false)">
          <div v-if="totalItemsInCart > 0" class="ordersCounter">
            {{ totalItemsInCart }}
          </div>
        </div>
      </div>
      <div v-if="api.isAuth" class="leftContainer">
        <NuxtLink to="/admin">
          <div class="admin" />
        </NuxtLink>
        <NuxtLink to="/OrdersList">
          <NuxtIcon name="doc" style="color: black; font-size: 20px" />
        </NuxtLink>
        <NuxtLink to="/" @click="logout">
          <div class="logout" />
        </NuxtLink>
      </div>
    </div>
    <Teleport v-if="isMenu" to="body">
      <div class="menuModal" :class="isToLeft ? 'toRight' : 'toLeft'">
        <nav class="menuModalLinks">
          <NuxtLink
            v-for="link in categories.categories"
            :key="link.name"
            :to="link.link"
            class="navLinkMobile"
            @click="getProduct(link.link)"
          >
            <span class="navNameMobile">{{ link.name }}</span>
          </NuxtLink>
        </nav>
      </div>
    </Teleport>
    <ShopBag v-if="isShopBag" @closeShopBag="isShopBag = false" />
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, watch, computed } from 'vue';
import { useCategories } from '~/stores/categories';
import { useApi } from '~/stores/api';

const isShopBag = ref(false);
const isMenu = ref(false);
const isToLeft = ref(false);
const categories = useCategories();
const api = useApi();

// Вычисляем общее количество товаров в корзине
const totalItemsInCart = computed(() => 
  api.orders.reduce((total, order) => total + (order.quantity || 1), 0)
);

const onMenu = () => {
  if (!isToLeft.value) {
    isToLeft.value = false;
    setTimeout(() => {
      isMenu.value = false;
    }, 200);
  } else {
    isToLeft.value = true;
    isMenu.value = true;
  }
};

const getProduct = (link) => {
  isToLeft.value = false;
  onMenu();
};

watch(isMenu, (newVal, oldVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
  } else document.body.style.overflow = 'visible';
});

const logout = () => {
  api.logout();
};


</script>

<style scoped lang="scss">
.mainHeader {
  position: fixed;
  z-index: 6;
  top: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 70px;
  width: 100%;
  box-shadow: 0 0 10px #868686;
  box-sizing: border-box;

  @media (max-width: 1300px) {
    display: none;
    padding: 0 20px;
  }
}

.mainHeader_mobile {
  position: fixed;
  z-index: 6;
  top: 0;
  background-color: #fff;
  display: none;
  align-items: center;
  justify-content: space-around;
  height: 70px;
  width: 100%;
  box-shadow: 0 0 10px #868686;
  box-sizing: border-box;
  padding: 0 20px;
  @media (max-width: 1300px) {
    display: flex;
  }
}

a {
  color: #fff;
}

.logo {
  background-image: url(/icons/rk.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100px;
  height: 50px;
  transition: 0.1s;
  cursor: pointer;
  border-bottom: 1px solid transparent;
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
  align-items: center;
  flex-direction: row;
  gap: 20px;
}

.leftContainerAdmin {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 20px;
  background-color: #ffffff;
  border: 1px solid black;
  border-radius: 22px;
  padding: 4px 8px;
  box-sizing: border-box;
}

.call {
  background-image: url(/icons/call.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.telContainer {
  position: absolute;
  bottom: -40px;
  right: 70px;
  width: max-content;
  background-color: #1d1d1dac;
  padding: 10px;
  color: #fff;
  border-radius: 0 0 8px 8px;
}

.shopBag {
  position: relative;
  background-image: url(/icons/shopBag.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.ordersCounter {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  box-shadow: 0 0 5px rgb(194, 67, 67);
}

.btnMenu {
  display: flex;
  position: relative;
  z-index: 50;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background-color: #333;
  border-radius: 12px;
  box-sizing: border-box;
  & span {
  height: 2px;
  width: 20px;
  transform: scale(1);
  background-color: #eee;
  border-radius: 10px;

  }
  &::before, &::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 20px;
    background-color: #eee;
    transition: all .3s ease 0s;
    border-radius: 10px;
  }

  &::before {
    top: 14px;
  }

  &::after {
    bottom: 14px;
  }

  &.active span {
   transform: scale(0);
  }

  &.active::before {
    width: 15px;
   top: 50%;
   transform: rotate(-45deg) translate(0, 0%);
  }

  &.active::after {
    width: 15px;
   top: 50%;
   transform: rotate(45deg) translate(0, 0%);
  }
}


.admin {
  background-image: url(/icons/user.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.logout {
  background-image: url(/icons/logout.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.wrapper {
  display: flex;
  flex: 1;
  width: 100%;
}

.menuModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding-top: 70px;
  z-index: 5;
}

.toRight {
  animation: left-to-rigth 0.2s ease-in;
}

.toLeft {
  animation: rigth-to-left 0.2s ease-in-out;
}

@keyframes left-to-rigth {
  0% {
    left: -1000px;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: 0;
  }
}

@keyframes rigth-to-left {
  0% {
    left: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: -1000px;
    opacity: 0;
  }
}

.menuModalLinks {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
}

.navNameMobile {
  color: #2c2c2c;
}
</style>
