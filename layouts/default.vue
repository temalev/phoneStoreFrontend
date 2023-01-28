<template>
  <Head>
    <Title>RK-Tech - магазин техники Apple</Title>
  </Head>
  <div class="main">
    <TheHeader :isDesktop="isDesktop" />
    <slot />
    <TheFooter />
  </div>
</template>
<script setup>
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
  api.orders = JSON.parse(localStorage.orders);
  api.getCategories();
});
</script>

<style scoped>
.main {
  position: relative;
}
</style>
