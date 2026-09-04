<template>
  <div
    v-if="isLoading"
    class="customButton"
    style="
      background-color: #fff;
      color: #979797;
      border: 1.5px solid #eee;
      box-shadow: none;
      cursor: default;
    "
  >
    <div class="spinner"></div>
    <span>Загрузка</span>
  </div>
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
  height: 44px;
  color: #fff;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.15s, background-color 0.2s;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(44, 44, 44, 0.18);

  &:hover {
    box-shadow: 0 8px 20px rgba(44, 44, 44, 0.28);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 6px rgba(44, 44, 44, 0.24);
  }
}

@media (prefers-reduced-motion: reduce) {
  .customButton {
    transition: none;

    &:hover,
    &:active {
      transform: none;
    }
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
