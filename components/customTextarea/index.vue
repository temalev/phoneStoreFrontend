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
  resize: none;
}

textarea::-webkit-outer-spin-button,
textarea::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
