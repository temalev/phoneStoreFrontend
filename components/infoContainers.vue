<template>
<div class="mainInfoContainers">
  <div class="leftContainer"></div>
  <div class="rightContainers">
    <div class="rightContainer"></div>
    <div class="rightContainer"></div>
  </div>
</div>
</template>
<script>
export default {

}
</script>
<style scoped>
.mainInfoContainers {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin: 20px 80px;
}

.leftContainer {
  display: flex;
  flex: 1;
  height: 400px;
  background-color: #fff;
  box-shadow: 0 0 10px rgb(212, 212, 212);
  border-radius: 22px;
}

.rightContainers {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 20px;
}

.rightContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;

  box-shadow: 0 0 10px rgb(212, 212, 212);
  border-radius: 22px;
}
</style>