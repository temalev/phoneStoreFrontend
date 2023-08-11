<template>
  <Head>
    <Title>RK-Tech - магазин техники Apple</Title>
  </Head>
  <div class="main-admin">
    <div class="main" style="overflow: scroll;">
      <TheHeader :isDesktop="isDesktop" />
      <slot />
      <Transition name="slide-fade">
        <TheCookie v-if="!api.isCookie" />
      </Transition>
      <TheFooter />
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useDetermininingWidth } from '~/stores/determiningWidth';
import { useApi } from '~/stores/api';
import { createHead } from 'unhead';
// Create a global head instance
const head = createHead();

const determiningWidth = useDetermininingWidth();
const api = useApi();

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

const yaMetrica = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(92637429, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });`;
const yaMetricaNoScript = '<div><img src="https://mc.yandex.ru/watch/92637429" style="position:absolute; left:-9999px;" alt="" /></div>';

// eslint-disable-next-line no-undef
useHead({
  script: [
    {
      children: yaMetrica,
      body: true,
      type: 'text/javascript',
    },
  ],
  noscript: [
    {
      children: yaMetricaNoScript,
      body: true,
    },
  ],
});
</script>

<style scoped>
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.main-admin {
  display: flex;
  flex-direction: column;
  height: 100%;
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
