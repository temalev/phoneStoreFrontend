<template>
  <Head>
    <Title>RK-Tech - магазин техники Apple</Title>
  </Head>
  <div class="main">
    <TheHeader :isDesktop="isDesktop" />
    <slot />
    <Transition mode="out-in">
      <TheCookie v-if="!api.isCookie" />
    </Transition>
    <TheFooter />
  </div>
</template>
<script setup>
import { ref } from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useDetermininingWidth } from '~/stores/determiningWidth';
import { useApi } from '~/stores/api';

const determiningWidth = useDetermininingWidth();
const api = useApi();

// eslint-disable-next-line no-undef
onMounted(() => {
  if (window.screen.width <= 700) {
    determiningWidth.editDesktop(false);
  } else {
    determiningWidth.editDesktop(true);
  }
  if (localStorage?.orders) {
    api.orders = JSON.parse(localStorage.orders);
    api.getCategories();
  }
  if (localStorage?.jwt1) {
    api.isAuth = true;
  }
  if (!localStorage?.cookie) {
    api.isCookie = false;
  }
});
</script>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
