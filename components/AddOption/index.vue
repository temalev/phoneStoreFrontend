<template>
  <div class="editOption">
    <Input :placeholder="'Объем памяти'" @inputValue="(val) => (options.name = val)" />
    <div class="options">
      <Input v-for="item in options.items"
        :key="item"
        @inputValue="(val) => (item.name = val, item.value = val)"
        :data="colors"
        placeholder="128ГБ"
        :styles="{width: 'auto'}" />
      <CustomButton @click="addOpt" type="plus" />
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const opts = ref(1);
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

const options = ref({
  name: null,
  items: [],
});

const emit = defineEmits(['change']);

watch(options.value, (newVal, oldVal) => {
  emit('change', newVal);
});

const addOpt = () => {
  const Obj = { id: uuidv4(), name: null, value: null };
  options.value.items.push(Obj);
};
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
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 8px;
}
</style>
