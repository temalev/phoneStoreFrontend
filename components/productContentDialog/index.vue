<template>
  <el-dialog
    :model-value="true"
    :title="product.name || 'Новый товар'"
    width="min(920px, 96vw)"
    top="4vh"
    append-to-body
    :close-on-click-modal="false"
    @close="emit('close')"
  >
    <el-tabs v-model="tab">
      <el-tab-pane label="Описание" name="description">
        <ClientOnly>
          <RichTextEditor v-model="description" />
        </ClientOnly>
        <p class="productContentDialog__hint">
          Текст о самом товаре. Цены, доставку, подарки и «уточняйте» лучше не писать:
          на сайте они видны, а из фида Яндекс Товаров такие фразы вырезаются.
        </p>
      </el-tab-pane>
      <el-tab-pane :label="specsLabel" name="specs">
        <SpecsEditor v-model="specs" />
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="emit('close')">Отмена</el-button>
      <el-button type="primary" :loading="isSaving" @click="save">
        {{ product.uuid ? 'Сохранить' : 'Готово' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useApi } from '~/stores/api';
import { normalizeSpecs } from '~/composables/useProductSpecs.ts';

const props = defineProps({
  /** Товар из карточки админки; у нового ещё нет uuid */
  product: { type: Object, required: true },
});
const emit = defineEmits(['close', 'saved']);

const api = useApi();

const tab = ref('description');
const description = ref(props.product.description || '');
const specs = ref(normalizeSpecs(props.product.specs));
const isSaving = ref(false);

const specsLabel = computed(() => {
  const rows = specs.value.reduce((sum, g) => sum + g.items.length, 0);
  return rows ? `Характеристики (${rows})` : 'Характеристики';
});

// Сохраняем только эти два поля: бэкенд обновляет то, что пришло, и цены
// с вариантами из несохранённой карточки сюда не утекут. У нового товара
// сохранять некуда — данные уходят в карточку и создаются вместе с ней.
const save = async () => {
  const payload = { description: description.value, specs: normalizeSpecs(specs.value) };

  if (!props.product.uuid) {
    emit('saved', payload);
    emit('close');
    return;
  }

  isSaving.value = true;
  try {
    const updated = await api.updateProduct(props.product.uuid, payload);
    if (!updated?.uuid) throw new Error(updated?.message || 'пустой ответ');
    emit('saved', {
      description: updated.description ?? payload.description,
      specs: normalizeSpecs(updated.specs ?? payload.specs),
    });
    ElMessage({ type: 'success', message: 'Описание и характеристики сохранены' });
    emit('close');
  } catch (e) {
    console.error(e);
    ElMessage({ type: 'error', message: 'Не удалось сохранить описание и характеристики' });
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped lang="scss">
.productContentDialog__hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: #909399;
}
</style>
