<template>
  <div class="mainAdmin">
    <div v-if="!api.isAuth" class="authContainer">
      <h2>Авторизация</h2>
      <CustomInput @inputValue="(val) => (adminData.login = val)" />
      <CustomInput @inputValue="(val) => (adminData.password = val)" />
      <CustomButton @click="login" :name="'Войти'" />
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
.mainAdmin {
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40vh;
}

.authContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
}
</style>
