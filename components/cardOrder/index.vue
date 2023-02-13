<template>
  <div class="order">
    <div class="mainInfo">
      <div class="header">
        <span class="headerName">{{ data.fullName }}</span>
        <span class="headerInfo"></span>
      </div>

      <div class="infoContainer">
        <span class="info">{{ data.phoneNumber }}</span>
      </div>
      <CardOrderItemOrder v-for="order in data.items" :key="order.uuid" :order="order" />
    </div>

    <div class="buttons">
      <CustomButton @click="deleteOrder(data.uuid)" name="Отменить" />
      <CustomButton name="Подтвердить" />
    </div>
    <span class="date">{{ date }}</span>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const props = defineProps({
  data: Object,
});
const deleteOrder = (uuid) => {
  api.deleteOrder(uuid);
};

const date = computed(() => {
  const createdAt = new Date(props.data?.createdAt);
  const currentDate = new Date();
  console.log(currentDate);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
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
