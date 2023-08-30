<template>
  <div class="modal-background"         @click="emits('close')">
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
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

const emits = defineEmits(["close"]);
</script>
<style scoped lang="scss">
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;

}
.modal {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;

  @media (min-width: 850px) {
    box-sizing: border-box;
    box-shadow: 0 0 20px #eee;
    border-radius: 8px;
  }
  @media (max-width: 850px) {
    width: 100%;
    height: 100%;
  }
}

.ico {
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  z-index: 9999;
  @media (min-width: 850px) {
    display: none;
  }
}

.nuxt-icon svg {
  width: 28px;
  height: 28px;
}
</style>
