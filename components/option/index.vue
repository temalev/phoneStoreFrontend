<template>
  <component
    :is="isComponent"
    :option="option"
    :show-sync-button="showSyncButton"
    :option-index="optionIndex"
    @selectedOpt="$emit('selectedOpt', $event)"
    @moveColor="$emit('moveColor', $event)"
    @onEdit="$emit('onEdit', $event)"
    @deleteColor="$emit('deleteColor', $event)"
    @addColor="$emit('addColor', $event)"
    @sync="$emit('sync')"
  />
</template>
<script>
import ColorOption from './colorOption.vue';
import DefaultOption from './defaultOption.vue';

export default {
  components: { ColorOption, DefaultOption },
  emits: ['selectedOpt', 'moveColor', 'onEdit', 'deleteColor', 'addColor', 'sync'],
  props: {
    option: {
      type: Object,
      default: () => {},
    },
    showSyncButton: {
      type: Boolean,
      default: false,
    },
    optionIndex: {
      type: Number,
      default: 0,
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
