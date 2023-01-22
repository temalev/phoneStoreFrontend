<template>
  <Teleport to="body">
    <div class="background" @click.self="$emit('closeShopBag')">
      <div class="shopBagContainer">
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
  </Teleport>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref } from 'vue';

const options = ref([
  { name: 'Самовывоз', info: '' },
  { name: 'Доставка по Москве', info: '' },
  { name: 'Доставка по России', info: '' },
]);
</script>

<style scoped>
h3 {
  font-size: 20px;
}

h2 {
  font-size: 16px;
}
.background {
  position: fixed;
  top: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.636);
}
.shopBagContainer {
  position: fixed;
  top: 20%;
  left: 10%;
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
  width: 80%;
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
  margin-right: 100px;
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
  width: 200px;
  height: 100px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  border-radius: 10px;
}
</style>
