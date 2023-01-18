<template>
  <div class="main">
    <div class="welcome"></div>
    <Slider />
    <InfoContainers />
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">

.main {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
.welcome {
  background-image: url(~/public/images/mainPageBackground.jpeg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 700px;
  box-shadow: inset 2px 0 10px rgb(144, 144, 144);
}
</style>
