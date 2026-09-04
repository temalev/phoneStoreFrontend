<template>
  <div class="mainCustomInput">
    <label for="">{{ label }}</label>
    <div class="input">
      <input
        class="customInput"
        v-model="model"
        name="phone"
        placeholder="Введите номер телефона"
        data-phone-pattern
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  label: String,
  value: { type: String, default: '' },
});

const eventCalllback = function (e) {
  const el = e.target;
  const clearVal = el.dataset.phoneClear;
  const pattern = el.dataset.phonePattern;
  const matrixDef = '+7(___) ___-__-__';
  const matrix = pattern || matrixDef;
  let i = 0;
  const def = matrix.replace(/\D/g, '');
  let val = e.target.value.replace(/\D/g, '');
  if (clearVal !== 'false' && e.type === 'blur') {
    if (val.length < matrix.match(/([\\_\d])/g).length) {
      e.target.value = '';
      return;
    }
  }
  if (def.length >= val.length) {
    val = def;
  }
  // eslint-disable-next-line no-plusplus, no-nested-ternary
  e.target.value = matrix.replace(/./g, (a) => (/[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a));
};

const emit = defineEmits(['inputValue']);
const text = ref('');
const model = computed({
  get() {
    return props.value || '';
  },
  set(val) {
    emit('inputValue', val);
  },
});
// eslint-disable-next-line no-undef
onMounted(() => {
  const phoneInputs = document.querySelectorAll('[data-phone-pattern]');
  // eslint-disable-next-line no-restricted-syntax
  for (const elem of phoneInputs) {
    // eslint-disable-next-line no-restricted-syntax
    for (const ev of ['input', 'blur', 'focus']) {
      elem.addEventListener(ev, eventCalllback);
    }
  }
});
</script>

<style>
.mainCustomInput {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

label {
  font-weight: 400;
  font-size: 14px;
  color: #6c6c6c;
}

.input {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 14px;
  border: 1.5px solid #e6e6e6;
  border-radius: 12px;
  background-color: #fff;
  box-sizing: border-box;
  width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus-within {
  border-color: #2c2c2c;
  box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.06);
}

.customInput {
  padding: 0;
  border: none;
  outline: none;
  width: 100%;
  font-size: 15px;
  color: #2c2c2c;
  background: transparent;
  box-sizing: border-box;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input::placeholder {
  font-size: 15px;
  font-weight: 300;
  color: #b4b4b4;
}

input:focus::-webkit-input-placeholder {
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
