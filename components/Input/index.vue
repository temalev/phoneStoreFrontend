<template>
  <div class="mainCustomInput" :style="styles">
    <label for="">{{ label }}</label>
    <div class="input">
      <input
        v-if="!textArea"
        class="customInput"
        :type="type"
        :placeholder="placeholder"
        v-model="model"
      />
      <textarea
        v-else
        class="customInput"
        name=""
        id=""
        cols="30"
        rows="4"
        v-model="model"
      ></textarea>
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
      default: "text",
    },
    textArea: {
      type: Boolean,
      default: false,
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
  emits: ["inputValue"],
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("inputValue", val);
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

  &:focus-within {
    border-color: #2c2c2c;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.06);
  }
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

textarea.customInput {
  padding: 12px 0;
  resize: vertical;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input::placeholder,
textarea::placeholder {
  font-size: 15px;
  font-weight: 300;
  color: #b4b4b4;
}

input:focus::-webkit-input-placeholder {
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
