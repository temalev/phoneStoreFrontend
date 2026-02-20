<template>
  <div class="mainColorOption">
    <h3 class="optionName">{{ option.name.charAt(0).toUpperCase() + option.name.slice(1) }}</h3>
    <div class="colorContainer">
      <div
        v-for="(item, index) in option?.items"
        :key="item.name"
        class="color-wrapper"
      >
        <el-button
          v-if="isEditMode"
          type="danger"
          :icon="Delete"
          circle
          size="small"
          class="delete-btn"
          @click.stop="deleteColor(item.id)"
        />
        <div
          class="color"
          :title="item.name"
          @click="selectedColor(item.id)"
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
        </div>
        <div v-if="isEditMode" class="color-controls">
          <el-button
            v-if="index > 0"
            :icon="ArrowLeft"
            circle
            size="small"
            @click.stop="moveUp(index)"
          />
          <el-button
            v-if="index < option.items.length - 1"
            :icon="ArrowRight"
            circle
            size="small"
            @click.stop="moveDown(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
import { ref, computed } from 'vue';
import { ArrowLeft, ArrowRight, Delete } from '@element-plus/icons-vue';
import { useApi } from '~/stores/api';

const api = useApi();

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  option: Object,
  showSyncButton: { type: Boolean, default: false },
  optionIndex: { type: Number, default: 0 },
});

const emit = defineEmits(['selectedOpt', 'moveColor', 'deleteColor']);

const selectedItem = ref(props.option.items[0].id);

const isEditMode = computed(() => api.isAuth);

// eslint-disable-next-line max-len
const selected = computed(() => (!selectedItem.value ? props.option.items[0].id : selectedItem.value));

const selectedColor = (id) => {
  selectedItem.value = id;
  emit('selectedOpt', selectedItem.value);
};

const moveUp = (index) => {
  if (index > 0) {
    emit('moveColor', { from: index, to: index - 1 });
  }
};

const moveDown = (index) => {
  if (index < props.option.items.length - 1) {
    emit('moveColor', { from: index, to: index + 1 });
  }
};

const deleteColor = (colorId) => {
  emit('deleteColor', colorId);
};

// eslint-disable-next-line no-undef
onMounted(() => {
  emit('selectedOpt', selectedItem.value);
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

.color-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.delete-btn {
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
}

.color {
  cursor: pointer;
}

.color-controls {
  display: flex;
  gap: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
}

.colorContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-left: 5px;
}
.inputColor {
  appearance: none;
  position: absolute;
}

.colorDot {
  position: relative;
  width: 25px;
  height: 25px;
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
  width: 25px;
  height: 25px;
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
