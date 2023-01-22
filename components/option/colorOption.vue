<template>
  <div class="mainColorOption">
    <h3>{{ option.name }}</h3>
    <div class="colorContainer">
      <div
        v-for="item in option.items"
        :key="item.name"
        class="color"
        @click="selectedItem = item.id"
      >
        <div
          class="colorDot"
          :style="{
            backgroundColor: item.value,
          }"
        >
          <div
            v-if="selected === item.id"
            class="selectedColorDot"
            :style="{
              borderColor: item.value,
            }"
          ></div>
        </div>
        <!-- <label class="labelColor" for="i" />
        <input id="i" class="inputColor" type="radio" /> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    option: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selectedItem: null,
    };
  },
  computed: {
    selected() {
      return !this.selectedItem ? this.option.items[0].id : this.selectedItem;
    },
  },
};
</script>
<style scoped lang="scss">
.mainColorOption {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color {
  cursor: pointer;
}
.colorContainer {
  display: flex;
  gap: 15px;
}
.inputColor {
  appearance: none;
  position: absolute;
}

.colorDot {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #eee;
  transition: 0.2s;
  &:hover {
    box-shadow: 0 0 5px #9e9e9e;
  }
}

.selectedColorDot {
  position: absolute;
  top: -5px;
  left: -5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid black;
  padding: 3px;
}

.labelColor {
  width: 40px;
  height: 40px;
  display: block;
}

.labelColor:before {
  content: '';
  position: relative;
  background-color: rgb(155, 155, 155);
  border: 1px solid transparent;
  width: 40px;
  height: 40px;
  display: block;
  border-radius: 50%;
}

.inputColor:checked + .labelColor:before {
  content: '';
  position: relative;
  background-color: rgb(255, 255, 255);
  border: 1px solid black;
  width: 40px;
  height: 40px;
  display: block;
  border-radius: 50%;
}
</style>
