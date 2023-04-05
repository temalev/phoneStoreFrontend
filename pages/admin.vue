<template>
  <div class="mainAdmin" :style="{ alignItems: !api.isAuth ? 'center' : '' }">
    <div v-if="!api.isAuth" class="authContainer">
      <h2>Авторизация</h2>
      <Input @inputValue="(val) => (adminData.login = val)" />
      <Input
        type="password"
        @inputValue="(val) => (adminData.password = val)"
      />
      <CustomButton @click="login" :name="'Войти'" />
    </div>

    <div v-if="api.isAuth" class="container">
      <CreateProduct v-if="isCreateProduct" />
      <h4>Завершенных заказов: {{ api.statistics?.complited?.value }}</h4>
      <Table :data="api.newOrders" />
      <h3>Новые заказы</h3>
      <div v-if="api.newOrders.length && api.isAuth" class="ordersContainer">
        <div
          v-for="order in api.newOrders"
          :key="`order_${order.uuid}`"
          class="wrapper"
        >
          <CardOrder
            v-if="order?.status === 0"
            :data="order?.status === 0 ? order : null"
          />
        </div>
      </div>
    </div>
    <div v-if="api.newOrders && api.isAuth" class="container">
      <h3>В работе</h3>
      <div class="ordersContainer">
        <div
          v-for="order in api.newOrders"
          :key="`order_${order.uuid}`"
          class="wrapper"
        >
          <CardOrder v-if="order?.status === 1" :data="order" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDetermininingWidth } from '~/stores/determiningWidth';
import { useApi } from '~/stores/api';

const api = useApi();

const determiningWidth = useDetermininingWidth();

const isCreateProduct = ref(true);

const adminData = ref({ login: '', password: '' });

const login = () => {
  api.login(adminData.value);
};

// eslint-disable-next-line no-undef
onMounted(() => {
  api.getOrders();
  api.getStatistics();
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
  padding: 30px;
}

.ordersContainer {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.wrapper:empty {
  display: none;
}
</style>
