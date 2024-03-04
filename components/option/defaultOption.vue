<template>
  <div class="mainColorOption">
    <h3 class="optionName">{{ option?.name.charAt(0).toUpperCase() + option?.name.slice(1) }} 
      <el-button class="ml-2" type="primary" :icon="Edit" circle @click="$emit('onEdit', option)" />
      </h3>
    <div class="itemsContainer">
      <div
        v-for="btn in option.items"
        :key="btn.value"
        class="btnOption"
        @click="selectOpt(btn.id)"
        :style="{
          borderColor: selectedOpt === btn.id ? '#2c2c2c' : '#eee',
        }"
      >
        {{ btn.value }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import {
  Edit,
} from '@element-plus/icons-vue'

const emit = defineEmits(['selectedOpt', 'onEdit']);

const props = defineProps({
  option: Object,
});

const selectedOpt = ref(props.option.items[0].id);

const selectOpt = (id) => {
  selectedOpt.value = id;
  emit('selectedOpt', selectedOpt.value);
};

// eslint-disable-next-line no-undef
onMounted(() => {
  emit('selectedOpt', selectedOpt.value);
});
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
  flex-wrap: wrap;
  margin-left: 5px;
}

.btnOption {
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    border: 1px solid #2c2c2c;
  }
}
</style>
