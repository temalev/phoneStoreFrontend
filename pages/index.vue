<template>
  <div class="main">
    <div class="welcome"></div>
    <Slider />
    <InfoContainers />
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: null,
    };
  },
  async mounted() {
    const res = await this.$nuxt.$api.getCategories(this.$route);
    if (res.success) {
      this.categories = res.data;
    } else {
      console.log('Упс, ошибка!');
    }
  },
};
</script>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
.welcome {
  position: relative;
  background-image: url(~/public/images/mainPageBackground.jpeg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 80vh;
  box-shadow: inset 2px 0 10px rgb(144, 144, 144);
}
</style>
