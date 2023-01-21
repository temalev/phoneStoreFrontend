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
          <div class="rightContainer">o</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  emits: ['closeShopBag'],
};
</script>

<style scoped>
h3 {
  font-size: 20px;
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
  padding: 25px;
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
}
</style>
