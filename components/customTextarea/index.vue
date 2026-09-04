<template>
  <div class="mainCustomInput">
    <label for="">{{ label }}</label>
    <textarea class="customInput" :type="type" :placeholder="placeholder" v-model="model" />
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
    value: Number,
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

<style scoped lang="scss">
.mainCustomInput {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-weight: 400;
  font-size: 14px;
  color: #6c6c6c;
}

.customInput {
  padding: 12px 14px;
  border: 1.5px solid #e6e6e6;
  border-radius: 12px;
  outline: none;
  font-size: 15px;
  font-family: inherit;
  color: #2c2c2c;
  resize: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #2c2c2c;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.06);
  }

  &::placeholder {
    font-size: 15px;
    font-weight: 300;
    color: #b4b4b4;
  }
}

textarea::-webkit-outer-spin-button,
textarea::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
