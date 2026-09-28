<template>
  <div class="specsEditor">
    <p v-if="!groups.length" class="specsEditor__empty">
      Характеристик пока нет. Добавьте группу или вставьте таблицу списком.
    </p>

    <div v-for="(group, gIdx) in groups" :key="group.key" class="specsEditor__group">
      <div class="specsEditor__groupHead">
        <el-input v-model="group.title" placeholder="Группа, например «Дисплей»" class="specsEditor__groupTitle" />
        <el-button-group>
          <el-button :icon="ArrowUp" :disabled="gIdx === 0" title="Группу выше" @click="move(groups, gIdx, -1)" />
          <el-button :icon="ArrowDown" :disabled="gIdx === groups.length - 1" title="Группу ниже" @click="move(groups, gIdx, 1)" />
          <el-button :icon="Delete" title="Удалить группу" @click="removeGroup(gIdx)" />
        </el-button-group>
      </div>

      <div v-for="(item, iIdx) in group.items" :key="item.key" class="specsEditor__row">
        <el-input v-model="item.name" placeholder="Характеристика" />
        <el-input v-model="item.value" type="textarea" :autosize="{ minRows: 1, maxRows: 4 }" placeholder="Значение" />
        <el-button-group class="specsEditor__rowActions">
          <el-button size="small" :icon="ArrowUp" :disabled="iIdx === 0" title="Выше" @click="move(group.items, iIdx, -1)" />
          <el-button size="small" :icon="ArrowDown" :disabled="iIdx === group.items.length - 1" title="Ниже" @click="move(group.items, iIdx, 1)" />
          <el-button size="small" :icon="Close" title="Удалить строку" @click="group.items.splice(iIdx, 1)" />
        </el-button-group>
      </div>

      <!-- Без type="primary": common.scss красит .el-button--primary в тёмный фон
           с !important, и у текстовой кнопки текст сливается с фоном. -->
      <el-button text :icon="Plus" class="specsEditor__addRow" @click="addRow(group)">Строка</el-button>
    </div>

    <div class="specsEditor__footer">
      <el-button :icon="Plus" @click="addGroup">Группа</el-button>
      <el-button @click="isPasteOpen = !isPasteOpen">Вставить списком</el-button>
    </div>

    <div v-if="isPasteOpen" class="specsEditor__paste">
      <p class="specsEditor__hint">
        Строка «Название: значение» или таблица, скопированная с сайта производителя, —
        строка таблицы. Строка без двоеточия — заголовок новой группы.
      </p>
      <el-input
        v-model="pasteText"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 16 }"
        :placeholder="'Дисплей\nДиагональ: 6,3 дюйма\nЧастота обновления: до 120 Гц\nКорпус\nВес: 199 г'"
      />
      <div class="specsEditor__pasteActions">
        <span class="specsEditor__hint">Распознано строк: {{ pastedRows }}</span>
        <el-button :disabled="!pastedRows" @click="applyPaste(false)">Добавить к текущим</el-button>
        <el-button type="danger" plain :disabled="!pastedRows" @click="applyPaste(true)">Заменить всё</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ArrowUp, ArrowDown, Delete, Close, Plus } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { normalizeSpecs, parseSpecsText } from '~/composables/useProductSpecs.ts';

const props = defineProps({
  /** [{ title, items: [{ name, value }] }] — composables/useProductSpecs.ts */
  modelValue: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:modelValue']);

// Ключи строк нужны только редактору: без них Vue при перестановке
// переиспользует поля ввода и курсор «прыгает» в соседнюю строку.
let seq = 0;
const withKeys = (list) => list.map((group) => ({
  key: `g${(seq += 1)}`,
  title: group.title || '',
  items: (group.items || []).map((item) => ({ key: `i${(seq += 1)}`, name: item.name || '', value: item.value || '' })),
}));

const groups = ref(withKeys(Array.isArray(props.modelValue) ? props.modelValue : []));

// Наружу — без служебных ключей и без пустых строк: пустая строка здесь —
// ещё не заполненное поле, а не данные.
watch(groups, (list) => {
  emit('update:modelValue', normalizeSpecs(list));
}, { deep: true });

const move = (list, idx, dir) => {
  const [moved] = list.splice(idx, 1);
  list.splice(idx + dir, 0, moved);
};

const addRow = (group) => {
  group.items.push({ key: `i${(seq += 1)}`, name: '', value: '' });
};

const addGroup = () => {
  groups.value.push({ key: `g${(seq += 1)}`, title: '', items: [{ key: `i${(seq += 1)}`, name: '', value: '' }] });
};

const removeGroup = async (idx) => {
  const group = groups.value[idx];
  if (group.items.some((i) => i.name || i.value)) {
    try {
      await ElMessageBox.confirm(
        `Удалить группу «${group.title || 'без названия'}» и все её строки?`,
        'Удаление группы',
        { confirmButtonText: 'Удалить', cancelButtonText: 'Отмена', type: 'warning' },
      );
    } catch {
      return;
    }
  }
  groups.value.splice(idx, 1);
};

const isPasteOpen = ref(false);
const pasteText = ref('');
const parsed = computed(() => parseSpecsText(pasteText.value));
const pastedRows = computed(() => parsed.value.reduce((sum, g) => sum + g.items.length, 0));

const applyPaste = (replace) => {
  const incoming = withKeys(parsed.value);
  if (replace) {
    groups.value = incoming;
  } else {
    // Группа с тем же названием дополняется, а не дублируется.
    incoming.forEach((group) => {
      const same = groups.value.find((g) => g.title.trim().toLowerCase() === group.title.toLowerCase());
      if (same) same.items.push(...group.items);
      else groups.value.push(group);
    });
  }
  pasteText.value = '';
  isPasteOpen.value = false;
};
</script>

<style scoped lang="scss">
.specsEditor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.specsEditor__empty,
.specsEditor__hint {
  margin: 0;
  font-size: 13px;
  color: #909399;
}

.specsEditor__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fcfcfd;
}

.specsEditor__groupHead {
  display: flex;
  gap: 8px;
  align-items: center;

  .el-button-group { display: flex; flex-shrink: 0; }
}

.specsEditor__rowActions {
  display: flex;
  flex-shrink: 0;
}

.specsEditor__addRow {
  align-self: flex-start;
}

.specsEditor__groupTitle :deep(.el-input__inner) {
  font-weight: 600;
}

.specsEditor__row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) auto;
  gap: 8px;
  align-items: start;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.specsEditor__footer,
.specsEditor__pasteActions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.specsEditor__paste {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
