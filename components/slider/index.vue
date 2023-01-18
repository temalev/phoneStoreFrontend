<template>
<div class="mainSliderContainer">
  <NuxtLink v-for="a in 5" :key="a">
    <div class="productLink">
      <div class="header">IPhone</div>
      <div class="img" />
    </div>
  </NuxtLink>
  
</div>
</template>
<script>
export default {

}
</script>
<style scoped lang="scss">

.mainSliderContainer {
  display: flex;
  gap: 30px;
  overflow: scroll;
  padding: 20px 10px;
}
 .productLink {
  width: 300px;
  height: 350px;
  padding-top: 40px;
  background-color: #fff;
  box-shadow: 0 0 5px #dadada;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: .2s;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 20px #c4c4c4;
  }
 }

 .header {
  font-family: Helvetica, Arial,  sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: #2c2c2c;
}
 .img {
  background-image: url(~/assets/images/iphone.jpeg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 100%;
  height: 220px;
 }
</style>