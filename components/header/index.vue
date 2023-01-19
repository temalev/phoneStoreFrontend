<template>
  <div class="mainHeader">
    <NuxtLink to="/">
      <div class="logo" />
    </NuxtLink>
    
    <nav class="menu">

          <NuxtLink to="product/iphone" class="navLink">
            <div class="ico" style="background-image: url(/icons/iphone.svg)" />
            <span class="name">IPhone</span>
          </NuxtLink>

          <NuxtLink class="navLink">
            <div class="ico" style="background-image: url(/icons/ipad.svg)"></div>
            <span class="name">IPad</span>
          </NuxtLink>

          <NuxtLink class="navLink">
            <div class="ico" style="background-image: url(/icons/mac.svg)"></div>
            <span class="name">Mac</span>
          </NuxtLink>

          <NuxtLink class="navLink">
            <div class="ico" style="background-image: url(/icons/watch.svg)"></div>
            <span class="name">Watch</span>
          </NuxtLink>

          <NuxtLink class="navLink">
            <div class="ico" style="background-image: url(/icons/airpods.svg)"></div>
            <span class="name">AirPods</span>
          </NuxtLink>

          <NuxtLink class="navLink">
            <div class="ico" style="background-image: url(/icons/accessories.svg)"></div>
            <span class="name">Аксессуары</span>
          </NuxtLink>

          <NuxtLink class="navLink">
            <div class="ico" style="background-image: url(/icons/dyson.svg); height: 70px; width: 70px;"></div>
          </NuxtLink>

          <NuxtLink class="navLink" style="height: 70px; width: 100px;">
            <div class="ico" style="background-image: url(/icons/ps.jpg); height: 70px; width: 120px;"></div>
          </NuxtLink>

    </nav>
    <div class="leftContainer">
      <div class="call" />
      <div class="shopBag" />
    </div>
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
  height: 70px;
  width: 100%;
  box-shadow: 0 0 10px #868686;
}

.logo {
  background-image: url(~/public/icons/rk.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100px;
  height: 50px;
  transition: 0.1s;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid rgb(89, 89, 89);
  }
}

.menu {
    display: flex;
    gap: 40px;
    align-items: center;
    justify-content: space-around;
}

.navLink {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: max-content;
  height: 50px;
  box-sizing: border-box;
  cursor: pointer;
}

.name {
  font-family: Inter, Helvetica, Arial,  sans-serif;
  font-size: 15px;
  font-weight: 400;
}

.ico {
  width: 50px;
  height: 50px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.leftContainer {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.call {
  background-image: url(~/public/icons/call.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
}

.shopBag {
  background-image: url(~/public/icons/shopBag.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
}
</style>
