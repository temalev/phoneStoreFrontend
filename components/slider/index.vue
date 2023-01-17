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
  padding: 10px;
}
 .productLink {
  width: 300px;
  height: 350px;
  background-color: #fff;
  box-shadow: 0 0 5px #dadada;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: .2s;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 20px #c4c4c4;
  }
 }
</style>