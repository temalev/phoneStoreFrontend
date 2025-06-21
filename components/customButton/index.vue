<template>
  <div
    v-if="isLoading"
    class="customButton"
    style="
      background-color: #fff;
      color: #979797;
      border: 1px solid #eee;
      box-shadow: none;
      cursor: default;
    "
  >
    <div class="spinner"></div>
    <span>Загрузка</span>
  </div>
  <!-- <button
      v-if="type === 'plus'"
      style="width: 40px; height: 30px"
      class="customButton"
    >
      +
    </button> -->
  <button v-else class="customButton" :style="{backgroundColor: bColor}">
    <span v-if="type === 'plus'">+</span>
    <span v-else-if="type === 'minus'">-</span>
    <div v-else class="d-flex align-center gap-3">
      <NuxtIcon v-if="type === 'accept'" name="accept" style="color: black; font-size: 20px" />
      <span> {{ name }}</span>
    </div>
  </button>
</template>
<script setup>
const props = defineProps({
  name: String,
  type: String,
  isLoading: Boolean,
  bColor: {
    type: String,
    default: '#2c2c2c',
  },
});
</script>
<style scoped lang="scss">
.customButton {
  height: 40px;
  color: #fff;
  border-radius: 10px;
  border: 1px solid #242424;
  cursor: pointer;
  transition: 0.2s;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    box-shadow: 0 0 10px rgba(103, 103, 103, 0.781);
    background-color: #313131;
  }
}

// .ring {
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   animation: ring 1s linear infinite;
//   &::before {
//     content: '';
//     top: 0;
//     left: 0;
//     height: 100%;
//     width: 100%;
//     border-radius: 50%;
//     box-shadow: 0 0 5px rgba(255, 255, 255, .3);
//   }
// }

.spinner {
  background-image: url(/icons/spinner.svg);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 20px;
  height: 20px;
  animation: ring 1s linear infinite;
  transition: 1s;
  opacity: 1;
}

@keyframes ring {
  0% {
    transform: rotate(0deg);
    opacity: 1;
    // box-shadow: .5px 1px 2px #ffffff;
  }
  50% {
    transform: rotate(180deg);
    opacity: 0.8;
    // box-shadow: .5px 1px 2px #6d6d6d;
  }
  100% {
    transform: rotate(360deg);
    opacity: 0.6;
    // box-shadow: .5px 1px 2px #ffffff;
  }
}
</style>
