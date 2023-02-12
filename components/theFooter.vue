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
        >
          {{ link?.name }}
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>
<script setup>
import { useCategories } from '~/stores/categories';

const categories = useCategories();
</script>
<style scoped>
.mainFooter {
  width: 100%;
  height: 400px;
  background-color: #2c2c2c;
  box-shadow: inset 0 20px 30px rgb(34, 34, 34);
  margin-top: 50px;
  color: #fff;
}

.links {
  display: flex;
  flex-direction: column;
}
.navLinkMobile {
  color: #fff;
}
</style>
