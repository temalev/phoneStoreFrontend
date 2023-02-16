<template>
  <Head>
    <Title>RK-Tech - магазин техники Apple</Title>
  </Head>
  <div class="main">
    <TheHeader :isDesktop="isDesktop" />
    <slot />
    <Transition name="slide-fade">
      <TheCookie v-if="!api.isCookie" />
    </Transition>
    <TheFooter />
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useDetermininingWidth } from '~/stores/determiningWidth';
import { useApi } from '~/stores/api';

const determiningWidth = useDetermininingWidth();
const api = useApi();
// const isCookie = computed(() => {
//   if (!localStorage?.cookie) {
//     return false;
//   } return true;
// });
// eslint-disable-next-line no-undef
onMounted(() => {
  api.getOrders();
  if (window.screen.width <= 700) {
    determiningWidth.editDesktop(false);
  } else {
    determiningWidth.editDesktop(true);
  }
  if (localStorage?.orders) {
    api.orders = JSON.parse(localStorage.orders);
    api.getCategories();
  }

  if (localStorage?.cookie) {
    api.isCookie = true;
  } else api.isCookie = false;
});
</script>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
