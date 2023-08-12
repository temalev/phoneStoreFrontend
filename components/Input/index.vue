<template>
  <div class="mainCustomInput" :style="styles">
    <label for="">{{ label }}</label>
    <div class="input">
      <input
        class="customInput"
        :type="type"
        :placeholder="placeholder"
        v-model="model"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: String,
    placeholder: String,
    type: {
      type: String,
      default: 'text',
    },
    styles: {
      type: Object,
      default: null,
    },
    value: {
      type: [String, Number],
      default: null,
    },
  },
  emits: ['inputValue'],
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('inputValue', val);
      },
    },
  },
};

// eslint-disable-next-line no-unused-vars
</script>

<style scoped>
.mainCustomInput {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

label {
  font-weight: 300;
  font-size: 17px;
}

.input {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
  width: 100%;
  padding: 5px;
}
.customInput {
  padding: 2px 5px;
  border: none;
  outline: none;
  width: 100%;
  font-size: 18px;
  box-sizing: border-box;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input::placeholder {
    font: sans-serif;
    font-size: 16px;
    font-weight: 100;
}

::-webkit-input-placeholder {
  font-weight: 300;
  opacity: 1;
  transition: opacity 0.3s ease;
}
input:focus::-webkit-input-placeholder {opacity: 0; transition: opacity 0.3s ease;}
</style>
