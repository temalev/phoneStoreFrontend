<template>
  <div class="editOption">
    <h3 class="optionName">Цвет</h3>
    <div class="options">
      <CustomInput
        v-for="item in opts"
        :key="item"
        @inputValue="(val) => (productData.description = val)"
        :data="colors"
        placeholder="Название"
      />
      <CustomButton @click="opts += 1" type="plus" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const opts = ref(0);
const colors = ref([
  {
    id: 1,
    color: '#333',
  },
  {
    id: 2,
    color: '#eee',
  },
  {
    id: 3,
    color: '#5t5t5t',
  },
]);
</script>
<style scoped>
.optionName {
  font-weight: 300;
}

.editOption {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 8px;
}
</style>
