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
      <div class="statictic">
        <div class="statistic-indicator">
          <span class="indicator-title"
            >Общее количество заказов
            <el-tooltip content="Прирост за неделю" placement="top">
              <NuxtIcon
                name="question"
                style="color: rgb(49, 49, 49); font-size: 16px"
              />
            </el-tooltip>
          </span>
          <div class="d-flex align-center gap-2">
            <span class="indicator-value">{{ api.newOrders.length }}</span>
            <span style="color: #67c23a; font-size: 13px"
              >+{{ ordersPerWeek.length }}</span
            >
          </div>
        </div>
        <div class="statistic-indicator">
          <span class="indicator-title">На сумму</span>
          <div class="d-flex align-center gap-2">
            <span class="indicator-value">{{ ru }} ₽</span>
            <span style="color: #67c23a; font-size: 13px"
              >+{{ new Intl.NumberFormat("ru").format(weeklyIncome) }} ₽</span
            >
          </div>
        </div>
      </div>
      <div class="d-flex align-center gap-2">
        <el-switch
          v-model="isNotification"
          style="margin-left: 24px"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
          @change="setNotification"
        />
        Уведомление о высокой волативности
      </div>
      <div class="d-flex-column gap-2 width-container">
        <CustomButton @click="isCreateProduct = true" name="Создать товар" />
      <CustomButton @click="isCreatePromocode = true" name="Создать промокод" />
      <NuxtLink to="/PromocodesList">
        <CustomButton @click="isCreatePromocode = true" name="Все промокоды" />
      </NuxtLink>
      </div>
      <CustomModal
        v-if="isCreateProduct"
        @close="isCreateProduct = false"
        width="800px"
      >
        <CreateProduct />
      </CustomModal>
      <CustomModal v-if="isCreatePromocode" @close="isCreatePromocode = false">
        <CreatePromocode @close="isCreatePromocode = false" />
      </CustomModal>

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
import { ref, computed } from 'vue';
import { Check, Close } from '@element-plus/icons-vue';
import { useDetermininingWidth } from '~/stores/determiningWidth';
import { useApi } from '~/stores/api';
import moment from 'moment';

const api = useApi();

const isNotification = ref(false);

const determiningWidth = useDetermininingWidth();

const ordersPerWeek = computed(() => {
  const curDate = new Date();
  const sevenDaysAgo = new Date(curDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const ordersWeek = api.newOrders.filter(
    (el) => new Date(el.createdAt) >= sevenDaysAgo
      && new Date(el.createdAt) <= curDate,
  );
  return ordersWeek;
});

const weeklyIncome = computed(() => ordersPerWeek.value.reduce(
  (prevValue, item) => (prevValue += item.costs.cost),
  0,
));

const setNotification = async () => {
  if (!isNotification.value) {
    api.setParams('popup_message', { value: 'false' });
  } else api.setParams('popup_message', { value: 'true' });
};

// eslint-disable-next-line no-return-assign

const ru = computed(() => {
  const statisticCost = api.newOrders.reduce(
    (prevValue, item) => (prevValue += item.costs.cost),
    0,
  );
  return new Intl.NumberFormat('ru').format(statisticCost);
});

const isCreateProduct = ref(false);
const isCreatePromocode = ref(false);
const nameCount = ref({});

const adminData = ref({ login: '', password: '' });

const login = () => {
  api.login(adminData.value);
};

// eslint-disable-next-line no-undef
onMounted(async () => {
  api.getOrders();
  api.getStatistics();
  api.getAllPromocode();
  const notif = await api.getParams('popup_message');
  isNotification.value = notif?.value === 'true';

});
</script>

<style scoped lang="scss">
.width-container {
  @media (max-width: 850px) {
    width: 100%;
  }
  width: 20%;
}

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

.statictic {
  background-color: #f3f3f3;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-wrap: 0;
  max-width: 600px;
  border-radius: 4px;
}

.statistic-indicator {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.indicator-title {
  font-size: 13px;
}

.indicator-value {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 28px;
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
  width: 100%;
  box-sizing: border-box;
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
