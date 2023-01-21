<template>
  <div class="mainCustomInput">
    <label for="">{{ label }}</label>
    <input class="customInput" type="text" />
  </div>
</template>
<script setup>
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  label: String,
});
</script>
<style scoped>
.mainCustomInput {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.customInput {
  padding: 10px;
  border-radius: 10px;
  outline: none;
  border: 1px solid #ccc;
  font-size: 18px;
}
</style>
