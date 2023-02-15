<template>
  <div
    class="dropZone"
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="{ activeDropzone: active }"
  >
    <label for="dropZone"></label>
    <input id="dropZone" type="file" name="file" class="dragZone" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const active = ref(false);

const toggleActive = () => {
  active.value = !active.value;
};
</script>

<style scoped lang="scss">
.dropZone {
  width: 250px;
  height: 250px;
  border: 1px solid #eee;
  border-radius: 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  label {
    background-image: url(~/public/icons/plus.svg);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width: 60px;
    height: 60px;
    opacity: 0.2;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      opacity: 0.5;
    }
  }

  input {
    display: none;
  }
}

.activeDropzone {
  background-color: rgba(52, 142, 52, 0.515);
}
</style>
