<template>
<div class="cookieContainer">
  <p class="info">Мы используем куки, в наше время без кук никуда </p>
  <CustomButton name="Прекрасно" @click="onCookie" style="width: fit-content; padding: 5px 10px;" />
</div>
</template>
<script setup>
const onCookie = () => {
  localStorage.setItem('cookie', 'true');
};
</script>
<style scoped>
.cookieContainer {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  width: 100%;
  background-color: #1c1c1c;
  padding: 0 10px;
  box-sizing: border-box;
  z-index: 10;
  animation: create .4s ease-out
}

.info {
  color: #fff;
}

@keyframes create {
  from {
    opacity: 0;
    bottom: -100px;
  }

  to {
   opacity: 1;
  }
}
</style>
