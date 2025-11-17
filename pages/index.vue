<!-- eslint-disable max-len -->
<template>
  <Head>
    <Title>RK Tech - интернет магазин техники и аксессуаров Apple и Dyson</Title>
    <Meta name="description" content="RK Tech - техника и аксессуары Apple и Dyson в Москве по низким ценам. Гарантия 1 год на всю продукцию. Доставка в Москве в день заказа."/>
  </Head>
  <div class="body">
    <div class="welcome">
      <div class="text">
        <h1>RK TECH</h1>
        <p>Высокий уровень сервиса и доступные цены.</p>
      </div>
    </div>
    <Slider :categories="categories" />
    <InfoContainers @openModal="onOpenModal" />
    <DeliveryInfoModal v-if="api.infoModal === 'DELIVERY'" @close="api.infoModal = null" />
    <PaymentInfoModal v-if="api.infoModal === 'PAYMENT'" @close="api.infoModal = null" />
    <OriginalityInfoModal v-if="api.infoModal === 'ORIGINALITY'" @close="api.infoModal = null" />
    <Teleport v-if="api.infoModal && api.infoModal !== 'DELIVERY' && api.infoModal !== 'PAYMENT' && api.infoModal !== 'ORIGINALITY'" to="body">
      <InfoModal @close="api.infoModal = null" />
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCategories } from '~/stores/categories';
import { useApi } from '~~/stores/api';

const api = useApi();

const categories = useCategories();

const isInfoModal = ref(false);
const isDeliveryModal = ref(true);

const onOpenModal = (modal) => {
  api.infoModal = modal;
};
</script>

<style scoped lang="scss">
.body {
  display: flex;
  flex-direction: column;
  gap: 50px;
  @media (max-width: 850px) {
    gap: 26px;
  }
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
  background-image: url(/images/mainPageBackground.webp);
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
