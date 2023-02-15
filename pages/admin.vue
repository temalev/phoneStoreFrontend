<template>
  <div class="mainAdmin" :style="{ alignItems: !api.isAuth ? 'center' : '' }">
    <div v-if="!api.isAuth" class="authContainer">
      <h2>Авторизация</h2>
      <CustomInput @inputValue="(val) => (adminData.login = val)" />
      <CustomInput @inputValue="(val) => (adminData.password = val)" />
      <CustomButton @click="login" :name="'Войти'" />
    </div>
    <div v-if="api.newOrders && api.isAuth" class="container">
      <CustomButton name="Добавить продукт" />
      <CreateProduct />
      <h3>Новые заказы</h3>
      <div class="ordersContainer">
        <div v-for="order in api.newOrders" :key="`order_${order.uuid}`" class="wrapper">
          <CardOrder v-if="order.status === 0" :data="order" />
        </div>
      </div>
    </div>
    <div v-if="api.newOrders && api.isAuth" class="container">
      <h3>В работе</h3>
      <div class="ordersContainer">
        <div v-for="order in api.newOrders" :key="`order_${order.uuid}`" class="wrapper">
          <CardOrder v-if="order.status === 1" :data="order" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useDetermininingWidth } from '~/stores/determiningWidth';
import { useApi } from '~/stores/api';

const api = useApi();

const determiningWidth = useDetermininingWidth();

const adminData = ref({ login: '', password: '' });

const login = () => {
  api.login(adminData.value);
};

// eslint-disable-next-line no-undef
onMounted(() => {
  api.getOrders();
});
</script>
<style scoped>
h3 {
  font-size: 25px;
}
.mainAdmin {
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
}

.authContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  margin: 30px 0;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 40px;
}

.ordersContainer {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
