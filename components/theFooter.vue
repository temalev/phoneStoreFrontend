<template>
  <div class="mainFooter">
    <div class="navContainer">
      <div class="linksContainer">
        <h3>Навигация</h3>
        <nav class="links">
          <NuxtLink
            v-for="link in categories.categories"
            :key="link.name"
            :to="`/product/${link.link}`"
            class="navLinkMobile"
            @click="getProduct(link.link)"
          >
            {{ link?.name }}
          </NuxtLink>
        </nav>
      </div>
      <div class="linksContainer">
        <h3>Информация</h3>
        <nav class="links">
          <NuxtLink
            v-for="link in info"
            :key="link.name"
            :to="`/product/${link?.link}`"
            class="navLinkMobile"
            @click="getProduct(link?.link)"
          >
            {{ link?.name }}
          </NuxtLink>
        </nav>
      </div>
    </div>

    <div class="linksContainer">
      <div class="rowLinks">
        <div class="tel">+7(910)901-10-00</div>
        <a href="https://t.me/RK_TECH01" class="telegramIco"></a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useCategories } from '~/stores/categories';
import { useApi } from '~/stores/api';

const categories = useCategories();
const api = useApi();

const info = ref([
  {
    id: 1,
    name: 'Оригинальность',
  },
  {
    id: 1,
    name: 'Оплата',
  },
  {
    id: 1,
    name: 'Доставка',
  },
]);

const getProduct = (link) => {
  const uuidSelectCategory = categories.categories.find((el) => el.link === link)?.uuid;
  if (uuidSelectCategory) {
    api.getProducts(uuidSelectCategory);
  }
};
</script>
<style scoped lang="scss">
.mainFooter {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 400px;
  background-color: #2c2c2c;
  box-shadow: inset 0 20px 30px rgb(34, 34, 34);
  margin-top: 50px;
  color: #fff;
  padding: 50px;
  box-sizing: border-box;

  @media (max-width: 500px) {
    flex-direction: column;
  }
}

.navContainer {
  display: flex;
  gap: 50px;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.navLinkMobile {
  color: #fff;
}

.linksContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rowLinks {
  display: flex;
  align-items: center;
  gap: 20px;
}

.telegramIco {
  background-image: url(~/public/icons/telegram.svg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 30px;
  height: 30px;
  display: block;
}
</style>
