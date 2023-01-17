<template>
  <div class="mainHeader">
    <div class="logo" />
    <nav class="menu">
      <ul>
        <li><a href="#">Главная</a></li>
        <li><a href="#">О нас</a></li>
        <li><a href="#">Контакты</a></li>
      </ul>
    </nav>
  </div>
</template>
<script>
export default {};
</script>
<style scoped lang="scss">
.mainHeader {
  position: fixed;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100px;
  width: 100%;
  box-shadow: 0 0 10px #868686;
}

.logo {
  background-image: url(~/assets/ico/logo.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 100px;
  height: 50px;
  transition: 0.1s;
  cursor: pointer;
  &:hover {
    filter: drop-shadow(0 4px 2px #9e9e9e);
  }
}

.menu {
  ul {
    display: flex;
    gap: 10px;
  }
}
</style>
