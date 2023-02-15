<template>
  <div class="mainCustomInput">
    <label for="">{{ label }}</label>
    <input class="customInput" :type="type" :placeholder="placeholder" v-model="model" />
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
