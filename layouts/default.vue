<template>
  <div>
    <TheHeader :isDesktop="isDesktop" />
    <slot />
    <TheFooter />
  </div>
</template>
<script>
export default {
  data() {
    return {
      isDesktop: true,
    };
  },
  created() {
    if (process.client) {
      window.addEventListener('resize', this.onResize);
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (window.screen.width <= 700) {
        this.isDesktop = false;
      } else {
        this.isDesktop = true;
      }
      this.reveal = true;
    });
  },
  methods: {
    onResize() {
      if (process.client) {
        if (window.screen.width <= 700) {
          this.isDesktop = false;
        } else {
          this.isDesktop = true;
        }
      }
      console.log(this.isDesktop);
    },
  },
};
</script>
