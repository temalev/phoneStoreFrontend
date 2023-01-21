<template>
  <div class="main">
    <div class="welcome"></div>
    <Slider />
    <div class="wrapper">
      <InfoContainers />
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
@media (max-width: 850px) {
  .wrapper {
    display: none;
  }
}
.main {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
.welcome {
  position: relative;
  margin-top: 70px;
  background-image: url(~/public/images/mainPageBackground.jpeg);
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
</style>
