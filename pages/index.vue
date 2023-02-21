<template>
  <div class="body">
    <div class="welcome">
      <div class="text">
        <h1>RK TECH</h1>
        <p>Высокий уровень сервиса и доступные цены.</p>
      </div>
    </div>
    <Slider :categories="categories" />
    <InfoContainers />
  </div>
</template>

<script setup>
import { useCategories } from '~/stores/categories';

const categories = useCategories();
</script>

<style scoped lang="scss">
// @media (max-width: 850px) {
//   .wrapper {
//     display: none;
//   }
// }
.body {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

h1 {
  font-size: 52px;
}
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  justify-content: center;
  position: relative;
  margin-top: 70px;
  background-image: url(/images/mainPageBackground.jpeg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 60vh;
  box-shadow: inset 2px 0 10px rgb(144, 144, 144);

  @media (max-width: 850px) {
    height: 40vh;
  }
}

.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-top: -45px;
}
</style>
