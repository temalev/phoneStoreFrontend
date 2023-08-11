<template>
  <div class="modal">
    <img
      src="/icons/close.svg"
      width="28"
      height="28"
      alt=""
      class="ico"
      @click="emits('close')"
    />
    <slot></slot>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const emits = defineEmits(['close']);
</script>
<style scoped>
.modal {
  position: relative;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  @media (max-width: 850px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
  }
}

.ico {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
}

.nuxt-icon svg {
  width: 28px;
  height: 28px;
}
</style>
