<template>
  <div class="accessories">
    <Slider :categories="categories" is-no-link is-message-block />
  </div>
</template>
<script setup>
import { ref } from 'vue';

const categories = ref({
  categories: [
    {
      name: 'Marshall',
      ico: '/icons/iphone.svg',
      link: '/accessories/case',
      img: '/images/marshall.png',
      uuid: 'e0844263-9fc4-4e72-8e3e-21f94bff72f4',
      isName: true,
    },
    {
      name: 'Samsung',
      ico: '/icons/iphone.svg',
      link: '/accessories/case',
      img: '/images/samsung.webp',
      uuid: 'e0844263-9fc4-4e72-8e3e-21f94bff72f4',
      isName: true,
    },
    {
      name: 'DJI',
      ico: '/icons/ipad.svg',
      link: '/accessories/cable',
      img: '/images/dji.png',
      uuid: 'cf87ad6b-f3b3-41e4-ae78-7d69bbb7366b',
      isName: true,
    },
    {
      name: 'Яндекс',
      ico: '/icons/mac.svg',
      link: '/accessories/mouse',
      img: '/images/yandex.png',
      uuid: '37c7f8bd-48a4-42af-8c27-740559f50e7b',
      isName: true,
    },
    {
      name: 'Xiaomi',
      ico: '/icons/mac.svg',
      link: '/accessories/mouse',
      img: '/images/xiaomi.png',
      uuid: 'afcd0861-edab-44b5-85dc-fd59bcd15233',
      isName: true,
    },
    {
      name: 'Dreame',
      ico: '/icons/mac.svg',
      link: '/accessories/mouse',
      img: '/images/dreame.png',
      uuid: 'da8f765a-805d-49d3-b254-d496da65ee0c',
      isName: true,
    },
    {
      name: 'JBL',
      ico: '/icons/mac.svg',
      link: '/accessories/mouse',
      img: '/images/jbl.png',
      uuid: '0b5c1b8c-dace-47cd-bca2-17454d4ea135',
      isName: true,
    },
  ],
});
</script>
<style scoped lang="scss">
.accessories {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  width: 100%;
  padding: 0 20px;
  @media (max-width: 500px) {
    align-items: stretch;
    padding: 0;
  }
}
</style>
