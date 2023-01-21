<template>
  <div class="main">
    <TheHeader :isDesktop="isDesktop" />
    <slot />
    <TheFooter />
  </div>
</template>
<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies

import { useDetermininingWidth } from '~/stores/determiningWidth';

const determiningWidth = useDetermininingWidth();

// eslint-disable-next-line no-undef
onMounted(() => {
  if (window.screen.width <= 700) {
    determiningWidth.editDesktop(false);
  } else {
    determiningWidth.editDesktop(true);
  }
});

//   created() {
//     if (process.client) {
//       window.addEventListener('resize', this.onResize);
//     }
//   },
//   mounted() {
//     console.log(this.determiningWidth.isDesktop);
//     this.$nextTick(() => {
//       if (window.screen.width <= 700) {
//         this.isDesktop = false;
//       } else {
//         this.isDesktop = true;
//       }
//     });
//   },
//   methods: {
//     onResize() {
//       if (process.client) {
//         if (window.screen.width <= 700) {
//           this.isDesktop = false;
//         } else {
//           this.isDesktop = true;
//         }
//       }
//       console.log(this.isDesktop);
//     },
//   },
// };
</script>

<style scoped>
.main {
  position: relative;
}
</style>
