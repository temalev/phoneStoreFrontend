<template>
  <div class="mainCustomInput">
    <label for="">{{ label }}</label>
    <input class="customInput" :type="type" :placeholder="placeholder" v-model="value" />
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
});

const emits = defineEmits(['inputValue']);

const value = ref(null);

watch(value, (newValue, oldValue) => {
  emits('inputValue', newValue);
});

// eslint-disable-next-line no-unused-vars
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
