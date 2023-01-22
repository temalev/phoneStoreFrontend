<template>
  <div class="mainColorOption">
    <h3 class="optionName">{{ option?.name }}</h3>
    <div class="itemsContainer">
      <div
        v-for="btn in option.items"
        :key="btn.value"
        class="btnOption"
        @click="selected = btn.id"
        :style="{
          borderColor: selected === btn.id ? '#2c2c2c' : '#eee',
        }"
      >
        {{ btn.value }}
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
      selected: null,
    };
  },
};
</script>
<style scoped lang="scss">
.mainColorOption {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.optionName {
  font-weight: 300;
}
.itemsContainer {
  display: flex;
  gap: 10px;
}

.btnOption {
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    border: 1px solid #2c2c2c;
  }
}
</style>
