<template>
<div class="mainSliderContainer">
  <NuxtLink v-for="card in cards" :key="card">
    <div class="productLink">
      <div class="header">{{card.name}}</div>
      <img class="img" :src="card.img"/>
    </div>
  </NuxtLink>

</div>
</template>
<script>
export default {
  name: 'Slider',
  data() {
    return {
      cards: [
        {
          name: 'IPhone',
          img: '/images/iphone.jpeg',
        },
        {
          name: 'IPad',
          img: '/images/ipad.jpeg',
        },
        {
          name: 'Mac',
          img: '/images/mac.jpeg',
        },
        {
          name: 'Watch',
          img: '/images/watchCard.jpeg',
        },
        {
          name: 'Airpods',
          img: '/images/airpods.jpeg',
        },
        {
          name: 'Аксессуары',
          img: '/images/accessories.jpg',
        },
        {
          name: 'Dyson',
          img: '/images/dyson.jpeg',
        },
        {
          name: 'SonyPlaystation 5',
          img: '/images/ps.jpeg',
        },
      ],
    };
  },
};
</script>
<style scoped lang="scss">

.mainSliderContainer {
  display: flex;
  gap: 30px;
  overflow: scroll;
  padding: 20px 10px;
  &::-webkit-scrollbar {
    display: none;
}
 .productLink {
  width: 300px;
  height: 350px;
  flex-shrink: 0;
  overflow: hidden;
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
 }

 .header {
  font-family: Helvetica, Arial,  sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: #2c2c2c;
}
 .img {
  object-fit:fill;
  width: 100%;
 }
</style>
