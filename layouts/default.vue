<template>
  <div class="main">
    <TheHeader :isDesktop="isDesktop" />
    <slot />
    <TheFooter />
  </div>
</template>
<script setup>
import { useDetermininingWidth } from '~/stores/determiningWidth';
import { useApi } from '~/stores/api';

const determiningWidth = useDetermininingWidth();
const api = useApi;

// eslint-disable-next-line no-undef
onMounted(() => {
  if (window.screen.width <= 700) {
    determiningWidth.editDesktop(false);
  } else {
    determiningWidth.editDesktop(true);
  }
  console.log(api.getComponents);
});
// import { useDetermininingWidth } from '~/stores/determiningWidth';

// export default {
//   data() {
//     return {};
//   },
//   setup() {
//     const determiningWidth = useDetermininingWidth();
//     return determiningWidth;
//   },
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
