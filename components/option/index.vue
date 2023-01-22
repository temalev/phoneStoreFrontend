<template>
  <component :is="isComponent" :option="option" />
</template>
<script>
import ColorOption from './colorOption.vue';
import DefaultOption from './defaultOption.vue';

export default {
  components: { ColorOption, DefaultOption },
  props: {
    option: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isComponent() {
      return this.option.name === 'Цвет' ? 'ColorOption' : 'defaultOption';
    },
  },
  mounted() {},
};
</script>
<style scoped></style>
