<template>
  <Teleport to="body">
    <div class="background" @click.self="closeShopBag()">
      <div v-if="isEmptyShopBag" class="wrapper">
        <div class="shopBagContainer">
          <h3>Корзина</h3>
          <ShopBagOrders :orders="orders" />
        </div>
        <div class="orderContainer">
          <h3>Оформить заказ</h3>
          <div class="body">
            <div class="inputsContainer">
              <CustomInput :label="'ФИО*'" :placeholder="'Иванов Иван Иванович'" />
              <CustomInput :label="'Телефон*'" :placeholder="'+7 900 100-00-00'" />
            </div>
            <div class="rightContainer">
              <div class="btnOptionContainer">
                <div v-for="btn in options" :key="btn.name" class="btnOption">
                  <h2>{{ btn.name }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <h3>Тут одиноко..</h3>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref } from 'vue';

const emit = defineEmits(['closeShopBag']);

const closeShopBag = () => {
  emit('closeShopBag');
};

const options = ref([
  { name: 'Самовывоз', info: '' },
  { name: 'Доставка по Москве', info: '' },
  { name: 'Доставка по России', info: '' },
]);

const isEmptyShopBag = ref(true);
const orders = ref(null);

// eslint-disable-next-line no-undef
onMounted(() => {
  if (JSON.parse(localStorage?.orders).length) {
    isEmptyShopBag.value = true;
    orders.value = JSON.parse(localStorage?.orders);
  } else isEmptyShopBag.value = false;
});
</script>

<style scoped lang="scss">
h3 {
  font-size: 20px;
}

h2 {
  font-size: 16px;
}
.background {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.636);
}

.wrapper {
  display: flex;
}
.orderContainer {
  position: relative;
  z-index: 6;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 40px;
  padding: 45px;
  font-size: 30px;
  background-color: #fff;
  box-shadow: 0 5px 20px #7a7a7a;
  border-radius: 32px;
  width: 60%;
  height: 500px;
}

.body {
  display: flex;
  justify-content: space-between;
}

.inputsContainer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  margin-right: 40px;
}

.rightContainer {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.btnOptionContainer {
  display: flex;
  gap: 10px;
}

.btnOption {
  display: flex;
  justify-content: center;
  padding: 10px;
  flex: 1;
  height: 100px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px rgb(167, 167, 167);
  }
}

.shopBagContainer {
  margin-top: 50px;
  border-radius: 32px 0 0 32px;
  width: 300px;
  height: 300px;
  background-color: #fff;
  box-shadow: 0 0 10px rgb(166, 166, 166);
  padding: 20px;
}

.empty {
  background-color: #fff;
  padding: 50px;
  box-shadow: 0 0 20px rgb(166, 166, 166);
  border-radius: 32px;
}
</style>
