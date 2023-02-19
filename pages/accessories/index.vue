<template>
  <div class="accessories">
    <Slider :categories="categories" />
  </div>
</template>
<script setup>
import { ref } from 'vue';

const categories = ref({
  categories: [
    {
      name: 'Аксессуары для iPhone',
      ico: '/icons/iphone.svg',
      link: '/accessories/case',
      img: '/images/case.png',
      uuid: '3c28df49-c662-469e-90df-888724e24da1',
      isName: true,
    },
    {
      name: 'Адаптеры питания и кабели для зарядки',
      ico: '/icons/ipad.svg',
      link: '/accessories/cable',
      img: '/images/cable.jpeg',
      uuid: 'baa43a78-850b-42c5-8487-e706e10292c5',
      isName: true,
    },
    {
      name: 'Клавиатуры и мыши',
      ico: '/icons/mac.svg',
      link: '/accessories/mouse',
      img: '/images/mouse.jpeg',
      uuid: '9c4fc64f-6545-4c8b-9745-e900e506082a',
      isName: true,
    },
  ],
});
</script>
<style scoped>
.accessories {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}
</style>
