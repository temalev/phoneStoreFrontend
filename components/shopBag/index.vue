<template>
  <Teleport to="body">
    <div class="background" @click.self="$emit('closeShopBag')">
      <div class="shopBagContainer">
        <CustomInput :label="' ФИО*'" />
        Тут пока одиноко
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
  align-items: center;
  justify-content: center;
  font-size: 30px;
  background-color: #fff;
  box-shadow: 0 5px 20px #7a7a7a;
  border-radius: 32px;
  width: 80%;
  height: 500px;
}
</style>
