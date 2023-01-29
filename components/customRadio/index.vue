<template>
  <div class="mainRadio">
    <input
      class="radioInput"
      :id="id"
      :value="id"
      v-model="radioVal"
      :checked="checked"
      @change="fun"
      type="radio"
    />
    <label class="radioLabel" :for="id">{{ label }}</label>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['change']);

const props = defineProps({
  label: String,
  checked: Boolean,
  id: Number,
});
const radioVal = ref(false);
const fun = () => {
  emit('change', radioVal.value);
};
</script>
<style scoped lang="scss">
.radioInput {
  appearance: none;
  position: absolute;

  &:checked {
    + .radioLabel::after {
      opacity: 1;
    }
  }
}
.radioLabel {
  font-size: 18px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;

  &::before {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    border: 1px solid #2c2c2c;
    border-radius: 50%;
    position: relative;
  }
  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 2.5px;
    width: 13px;
    height: 13px;
    border: 1px solid #2c2c2c;
    background-color: #2c2c2c;
    border-radius: 50%;
    opacity: 0;
    transition: 0.2s;
  }
}
</style>
