<template>
  <section
    v-if="groups.length"
    class="productSpecs"
    aria-labelledby="product-specs-title"
  >
    <h2 id="product-specs-title" class="productSpecs__title">
      Характеристики {{ name }}
    </h2>

    <!-- Вся таблица — в серверной разметке, без «показать ещё» на клиенте:
         ради уникального текста карточки блок и сделан. -->
    <div class="productSpecs__groups">
      <div v-for="(group, gIdx) in groups" :key="`${group.title}-${gIdx}`" class="productSpecs__group">
        <h3 v-if="group.title" class="productSpecs__groupTitle">{{ group.title }}</h3>
        <dl class="productSpecs__list">
          <div v-for="(item, iIdx) in group.items" :key="`${item.name}-${iIdx}`" class="productSpecs__row">
            <dt class="productSpecs__name">{{ item.name }}</dt>
            <dd class="productSpecs__value">{{ item.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { normalizeSpecs } from '~/composables/useProductSpecs.ts';

const props = defineProps({
  /** product.specs из API — composables/useProductSpecs.ts */
  specs: { type: Array, default: () => [] },
  /** Название модели для заголовка: «Характеристики iPhone 17 Pro» */
  name: { type: String, default: '' },
});

const groups = computed(() => normalizeSpecs(props.specs));
</script>

<style scoped lang="scss">
.productSpecs {
  margin-top: 64px;
  padding-top: 32px;
  border-top: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    margin-top: 40px;
    padding-top: 24px;
  }
}

.productSpecs__title {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.25;
  color: #1a1a1a;
  letter-spacing: -0.3px;
  margin: 0 0 24px;

  @media (max-width: 768px) { font-size: 20px; }
}

// Две колонки групп на широком экране: тридцать строк в одну колонку —
// это три экрана прокрутки.
.productSpecs__groups {
  columns: 2;
  column-gap: 48px;

  @media (max-width: 900px) { columns: 1; }
}

.productSpecs__group {
  break-inside: avoid;
  margin-bottom: 28px;
}

.productSpecs__groupTitle {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.productSpecs__list {
  margin: 0;
}

.productSpecs__row {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: 16px;
  padding: 9px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  line-height: 1.45;

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
  }
}

// «Ультраширокоугольная» шире колонки на телефоне — без переноса слово
// налезает на значение.
.productSpecs__name {
  color: #888;
  font-weight: 300;
  hyphens: auto;
  overflow-wrap: anywhere;
}

.productSpecs__value {
  margin: 0;
  color: #1a1a1a;
  overflow-wrap: anywhere;
}
</style>
