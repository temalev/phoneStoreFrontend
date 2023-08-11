<template>
  <div class="table">
    <TableHeader />
  </div>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
</script>
<style scoped>
.table {
  width: 100%;
}
</style>
