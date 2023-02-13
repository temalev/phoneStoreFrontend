<template>
  <div class="mainFooter">
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
  </div>
</template>
<script setup>
import { useCategories } from '~/stores/categories';
import { useApi } from '~/stores/api';

const categories = useCategories();
const api = useApi();

const getProduct = (link) => {
  const uuidSelectCategory = categories.categories.find((el) => el.link === link)?.uuid;
  if (uuidSelectCategory) {
    api.getProducts(uuidSelectCategory);
  }
};
</script>
<style scoped>
.mainFooter {
  width: 100%;
  height: 400px;
  background-color: #2c2c2c;
  box-shadow: inset 0 20px 30px rgb(34, 34, 34);
  margin-top: 50px;
  color: #fff;
  padding: 50px;
  box-sizing: border-box;
}

.linksContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.navLinkMobile {
  color: #fff;
}
</style>
