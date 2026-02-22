<template>
  <div class="mainColorOption">
    <h3 class="optionName">{{ option.name.charAt(0).toUpperCase() + option.name.slice(1) }}</h3>
    <div class="colorContainer">
      <draggable
        v-model="option.items"
        item-key="id"
        :disabled="!isEditMode"
        class="drag-list"
        ghost-class="drag-ghost"
        chosen-class="drag-chosen"
        animation="200"
      >
        <template #item="{ element: item }">
          <div class="color-wrapper">
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
              :class="{ 'drag-handle': isEditMode }"
              :title="item.name"
              @click="selectedColor(item.id)"
            >
              <div
                class="colorDot"
                :style="{ borderColor: item.id === selected ? item.value : '#fff' }"
              >
                <div
                  class="selectedColorDot"
                  :style="{ borderColor: item.value, backgroundColor: item.value }"
                />
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <el-tooltip v-if="isEditMode" content="Добавить цвет" placement="top">
        <el-button :icon="Plus" circle size="small" class="add-btn" @click.stop="isAdding = true" />
      </el-tooltip>
    </div>

    <!-- Модалка добавления цвета -->
    <el-dialog
      v-model="isAdding"
      title="Добавить цвет"
      width="320px"
      :close-on-click-modal="false"
      destroy-on-close
      append-to-body
    >
      <div class="dialog-body">
        <div class="picker-row">
          <span class="picker-label">Цвет</span>
          <input class="picker-large" type="color" v-model="newColorValue" />
        </div>
        <el-input
          v-model="newColorName"
          placeholder="Название цвета"
          @keyup.enter="confirmAddColor"
        />
      </div>
      <template #footer>
        <el-button @click="cancelAddColor">Отмена</el-button>
        <el-button type="primary" :disabled="!newColorName.trim()" @click="confirmAddColor">
          Добавить
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
import { ref, computed } from 'vue';
import draggable from 'vuedraggable';
import { Delete, Plus } from '@element-plus/icons-vue';
import { useApi } from '~/stores/api';

const api = useApi();

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  option: Object,
  showSyncButton: { type: Boolean, default: false },
  optionIndex: { type: Number, default: 0 },
});

const emit = defineEmits(['selectedOpt', 'moveColor', 'deleteColor', 'addColor']);

const selectedItem = ref(props.option.items[0]?.id);
const isAdding = ref(false);
const newColorValue = ref('#000000');
const newColorName = ref('');

const isEditMode = computed(() => api.isAuth);

// eslint-disable-next-line max-len
const selected = computed(() => (!selectedItem.value ? props.option.items[0].id : selectedItem.value));

const selectedColor = (id) => {
  selectedItem.value = id;
  emit('selectedOpt', selectedItem.value);
};

const deleteColor = (colorId) => {
  emit('deleteColor', colorId);
};

const confirmAddColor = () => {
  if (!newColorName.value.trim()) return;
  emit('addColor', { name: newColorName.value.trim(), value: newColorValue.value });
  newColorName.value = '';
  newColorValue.value = '#000000';
  isAdding.value = false;
};

const cancelAddColor = () => {
  newColorName.value = '';
  newColorValue.value = '#000000';
  isAdding.value = false;
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

  &.drag-handle {
    cursor: grab;
    &:active { cursor: grabbing; }
  }
}

.colorContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-left: 5px;
  align-items: center;
}

.drag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.drag-ghost {
  opacity: 0.3;
}

.drag-chosen {
  .colorDot {
    box-shadow: 0 0 0 2px #409eff;
  }
}

.add-btn {
  opacity: 0.5;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}


.picker-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.picker-label {
  font-size: 14px;
  color: #606266;
  flex-shrink: 0;
}

.picker-large {
  appearance: none;
  height: 44px;
  width: 100%;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  border-radius: 8px;
  padding: 2px;
  background: none;
  flex: 1;

  &::-webkit-color-swatch-wrapper { padding: 0; }
  &::-webkit-color-swatch { border: none; border-radius: 6px; }
  &::-moz-color-swatch { border: none; border-radius: 6px; }
}

.inputColor {
  appearance: none;
  position: absolute;
}

.colorDot {
  position: relative;
  transition: 0.2s;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 2px solid #eee;

}

.selectedColorDot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  padding: 3px;
  flex-shrink: 0;
  &:hover {
    box-shadow: 0 0 2px currentColor;
  }
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
