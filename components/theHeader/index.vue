<template>
  <div class="mainHeader">
    <NuxtLink to="/">
      <div class="logo" />
    </NuxtLink>

    <nav class="menu">
      <NuxtLink
        v-for="link in arrLinks"
        :key="link.name"
        :to="`product/${link.link}`"
        class="navLink"
      >
        <div class="ico" :style="{ backgroundImage: `url(${link.img}); ${link.style}` }" />
        <span class="name">{{ link.name }}</span>
      </NuxtLink>
    </nav>
    <div class="leftContainer">
      <div class="call" />
      <div class="shopBag" @click="isShopBag = true" />
    </div>
    <ShopBag v-if="isShopBag" @closeShopBag="isShopBag = false" />
  </div>
</template>
<script>
export default {
  name: 'theHeader',
  data() {
    return {
      arrLinks: [
        {
          name: 'IPhone',
          img: '/icons/iphone.svg',
          link: 'iphone',
        },
        {
          name: 'IPad',
          img: '/icons/ipad.svg',
          link: 'ipad',
        },
        {
          name: 'Mac',
          img: '/icons/mac.svg',
          link: 'mac',
        },
        {
          name: 'Watch',
          img: '/icons/watch.svg',
          link: 'watch',
        },
        {
          name: 'AirPods',
          img: '/icons/airpods.svg',
          link: 'airpods',
        },
        {
          name: 'Аксессуары',
          img: '/icons/accessories.svg',
          link: 'accessories',
        },
        {
          img: '/icons/dyson.svg',
          style: 'height: 70px; width: 100px;',
          link: 'dyson',
        },
        {
          img: '/icons/ps.jpg',
          style: 'height: 70px; width: 120px;',
          link: 'ps',
        },
      ],
      isShopBag: false,
    };
  },
};
</script>
<style scoped lang="scss">
.mainHeader {
  position: fixed;
  z-index: 5;
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
  color: #2c2c2c;

  &:hover {
    color: #000000;
  }
}

.name {
  font-family: Inter, Helvetica, Arial, sans-serif;
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
  cursor: pointer;
}

.shopBag {
  background-image: url(~/public/icons/shopBag.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
