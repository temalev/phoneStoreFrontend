<template>
  <div class="main">
    <Header />
    <div class="welcome"></div>
    <Slider />
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
background-image: url(~/assets/images/mainPageBackground.jpeg);
background-position: center;
background-repeat: no-repeat;
background-size: cover;
width: 100%;
height: 500px;

}
</style>
