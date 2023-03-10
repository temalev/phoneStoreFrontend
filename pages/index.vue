<template>
  <div class="body">
    <div class="welcome">
      <div class="text">
        <h1>RK TECH</h1>
        <p>Высокий уровень сервиса и доступные цены.</p>
      </div>
    </div>
    <Slider :categories="categories" />
    <InfoContainers @click="onInfoModal" />
    <Teleport v-if="api.isInfoModal" to="body">
      <InfoModal @close="api.isInfoModal = false" />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, useMeta } from 'vue';
import { useCategories } from '~/stores/categories';
import { useApi } from '~~/stores/api';

const api = useApi();

const categories = useCategories();

const isInfoModal = ref(false);

const onInfoModal = () => {
  api.isInfoModal = true;
};

// useMeta({
//   meta: [
//     {
//       hid: 'description',
//       name: 'description',
//       content: 'RK TECH - техника и аксессуары Apple и Dyson в Москве по низким ценам. Гарантия 1 год на всю продукцию. Доставка в Москве в день заказа.',
//     },
//   ],
// });

const { description } = useMeta();
description.value = 'RK TECH - техника и аксессуары Apple и Dyson в Москве по низким ценам. Гарантия 1 год на всю продукцию. Доставка в Москве в день заказа.';

</script>

<style scoped lang="scss">
.body {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

h1 {
  font-size: 52px;
}
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  justify-content: center;
  position: relative;
  margin-top: 70px;
  background-image: url(/images/mainPageBackground.jpeg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 60vh;
  box-shadow: inset 2px 0 10px rgb(144, 144, 144);
  flex-shrink: 0;

  @media (max-width: 850px) {
    height: 40vh;
  }
}

.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-top: -45px;
}
</style>
