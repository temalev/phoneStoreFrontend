<template>
  <component 
    :is="isComponent" 
    :option="option" 
    @selectedOpt="$emit('selectedOpt', $event)"
    @moveColor="$emit('moveColor', $event)"
    @onEdit="$emit('onEdit', $event)"
  />
</template>
<script>
import ColorOption from './colorOption.vue';
import DefaultOption from './defaultOption.vue';

export default {
  components: { ColorOption, DefaultOption },
  emits: ['selectedOpt', 'moveColor', 'onEdit'],
  props: {
    option: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isComponent() {
      return this.option.name.charAt(0).toUpperCase() + this.option.name.slice(1).split(' ')[0]
        === 'Цвет'
        ? 'ColorOption'
        : 'defaultOption';
    },
  },
  mounted() {},
};
</script>
<style scoped></style>
