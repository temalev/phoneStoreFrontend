<template>
  <div class="main">
    <div class="welcome"></div>
    <Slider />
    <div v-if="determiningWidth.isDesktop" class="wrapper">
      <InfoContainers />
    </div>
  </div>
</template>

<script setup>
import { useDetermininingWidth } from '~/stores/determiningWidth';

const determiningWidth = useDetermininingWidth();

// export default {
//   data() {
//     return {
//       categories: null,
//       all: null,
//     };
//   },
//   async mounted() {
//     const res = await this.$nuxt.$api.getCategories(this.$route);
//     if (res.success) {
//       this.categories = res.data;
//     } else {
//       console.log('Упс, ошибка!');
//     }

//     const res2 = await this.$nuxt.$api.getAll(this.$route);
//     if (res2.success) {
//       this.all = res2.data;
//     } else {
//       console.log('Упс, ошибка!');
//     }
//   },
// };
</script>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
.welcome {
  position: relative;
  margin-top: 70px;
  background-image: url(~/public/images/mainPageBackground.jpeg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 80vh;
  box-shadow: inset 2px 0 10px rgb(144, 144, 144);
}
</style>
