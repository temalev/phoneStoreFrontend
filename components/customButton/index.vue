<template>
  <button v-if="type === 'plus'" style="width: 40px; height: 30px" class="customButton">+</button>
  <button v-else class="customButton">{{ name }}</button>
</template>
<script setup>
const props = defineProps({
  name: String,
  type: String,
});
</script>
<style scoped lang="scss">
.customButton {
  height: 40px;
  background-color: #2c2c2c;
  color: #fff;
  border-radius: 10px;
  border: 1px solid #242424;
  cursor: pointer;
  transition: 0.2s;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;

  &:hover {
    box-shadow: 0 0 10px rgba(103, 103, 103, 0.781);
    background-color: #313131;
  }
}
</style>
