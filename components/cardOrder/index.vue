<template>
  <div class="order">
    <div class="mainInfo">
      <div class="infoContainer">
        <span class="headerName">{{ data?.fullName }}</span>
        <a class="info" :href="`tel:${data?.phoneNumber}`">{{ data?.phoneNumber }}</a>
      </div>
    </div>
    <div class="orderItemsContainer">
      <CardOrderItemOrder v-for="order in data?.items" :key="order.uuid" :order="order" />
    </div>
    <h5 class="delivery">{{ deliveryVariants.find(el => el.id === data?.delivery).name }}</h5>

    <div class="deliveryMesg">
      {{ data?.deliveryMessage }}
    </div>

    <div class="buttons">
      <CustomButton @click="deleteOrder(data.uuid)" name="Отменить" />
      <CustomButton @click="upgradeOrderStatus(data.uuid, data.status)" name="Подтвердить" />
    </div>
    <span class="date">{{ date }}</span>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const props = defineProps({
  data: Object,
});
const deleteOrder = (uuid) => {
  api.deleteOrder(uuid);
  api.getOrders();
};

const deliveryVariants = ref([
  {
    name: 'Самовывоз из офиса г. Москва',
    id: 1,
    info: 'Самовывоз - бесплатно. Офис №335 (3 этаж) по адресу: улица Барклая, 8.',
  },
  {
    name: 'Самовывоз из магазина г. Рязань',
    id: 4,
    info: 'Самовывоз - бесплатно. Рязань, ул. Кольцова, дом 1',
  },
  {
    name: 'Доставка по Москве внутри МКАД',
    id: 2,
    info: 'Курьерская доставка в Москве - бесплатно/490р',
  },
  {
    name: 'Дотсавка СДЭК в регионы',
    id: 3,
    info: 'Доставка по России - 490 рублей. Надежно упакуем и отправим в день заказа транспортной компанией «Сдэк».',
  },
]);

const upgradeOrderStatus = (uuid, status) => {
  if (status === 0) {
    api.upgradeOrderStatus(uuid, 1);
    api.getOrders();
  } else if (status === 1) {
    api.upgradeOrderStatus(uuid, 2);
    api.getOrders();
  }
};

const date = computed(() => {
  const createdAt = new Date(props.data?.createdAt);
  const currentDate = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const formatted = new Intl.DateTimeFormat('ru-RU', options).format(createdAt);
  return formatted;
});

// eslint-disable-next-line no-undef
onMounted(() => {});
</script>
<style scoped>
.order {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 20px rgb(160, 160, 160);
  border-radius: 32px;
  flex-shrink: 0;
  padding: 20px;
  width: 320px;
  box-sizing: border-box;
  overflow: hidden;
  @media (max-width: 500px) {
    width: 100%;
    }
}

.info {
  color: #1d1d1d;
}

.mainInfo {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.infoContainer {
  display: flex;
  flex-direction: column;
}

.orderItemsContainer {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.headerName {
  font-size: 26px;
  font-weight: bold;
}

.headerInfo {
  font-size: 13px;
  white-space: nowrap;
}
.buttons {
  display: flex;
  gap: 12px;
  box-sizing: border-box;
  margin-bottom: 5px;
}

.date {
  position: absolute;
  bottom: 2px;
  right: 20px;
  font-size: 13px;
}
</style>
