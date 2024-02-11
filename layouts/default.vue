<template>
  <Head>
    <Title>RK-Tech - магазин техники Apple</Title>
  </Head>
  <div class="main-admin">
    <div class="main" style="overflow-x: scroll">
      <TheHeader/>
      <slot />
      <Transition name="slide-fade">
        <TheCookie v-if="!api.isCookie" />
      </Transition>
      <TheFooter />
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="Внимание" width="90%" style="max-width: 600px;">
    <span
      >Уважаемые покупатели! В связи с нестабильным курсом валют и сложностями с
      поставками цены на товары могут меняться. Вы всегда можете уточнить
      актуальную стоимость устройств в аккаунте поддержки в Telegram</span
    >
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Закрыть</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          <template #default>
          <a href="https://t.me/RK_TECH01" target="_blank" style="color: #fff"> @RK_Tech_Support</a>
        </template>

        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useApi } from '~/stores/api';
import { createHead } from 'unhead';
// Create a global head instance
const head = createHead();

const api = useApi();

const dialogVisible = ref(false);

// eslint-disable-next-line no-undef
onMounted(async () => {
  api.getOrders();
  const notif = await api.getParams('popup_message');
  if (notif?.value === 'true') {
    dialogVisible.value = true;
  } else dialogVisible.value = false;

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

<style scoped lang="scss">
.main {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  overflow-x: hidden !important;
}

.main-admin {
  position: relative;
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
