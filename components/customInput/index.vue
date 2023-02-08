<template>
  <div class="mainCustomInput">
    <label for="">{{ label }}</label>
    <input class="customInput" type="text" :placeholder="placeholder" v-model="value" />
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';

const emits = defineEmits(['inputValue']);

const value = ref(null);

watch(value, (newValue, oldValue) => {
  emits('inputValue', newValue);
});

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  label: String,
  placeholder: String,
});
</script>

<style scoped>
.mainCustomInput {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: 300;
  font-size: 17px;
}
.customInput {
  padding: 10px;
  border-radius: 10px;
  outline: none;
  border: 1px solid #ccc;
  font-size: 18px;
}
</style>
