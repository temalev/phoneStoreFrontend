<template>
  <section
    v-if="items?.length"
    class="relatedModels"
    aria-labelledby="related-models-title"
  >
    <div class="relatedModels__head">
      <h2 id="related-models-title" class="relatedModels__title">{{ title }}</h2>
      <NuxtLink v-if="allLink" :to="allLink.to" class="relatedModels__all">
        {{ allLink.label }} →
      </NuxtLink>
    </div>

    <!-- Обычные <a href> в серверной разметке: ради них блок и сделан.
         Ни ленивой подгрузки, ни рендера только на клиенте. -->
    <ul class="relatedModels__list">
      <li v-for="item in items" :key="item.uuid" class="relatedModels__item">
        <NuxtLink :to="item.to" class="relatedModels__card">
          <span class="relatedModels__media">
            <img
              v-if="item.image"
              class="relatedModels__img"
              :src="item.image"
              :alt="item.name"
              width="180"
              height="180"
              loading="lazy"
              decoding="async"
            />
          </span>
          <span class="relatedModels__name">{{ item.name }}</span>
          <span class="relatedModels__price" :class="{ 'relatedModels__price--ask': !item.price }">
            {{ priceLabel(item) }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  /** Записи из relatedModels() — composables/useRelatedModels.ts */
  items: { type: Array, default: () => [] },
  title: { type: String, required: true },
  /** Ссылка на раздел целиком: { to, label } или null */
  allLink: { type: Object, default: null },
});

const formatPrice = (val) => new Intl.NumberFormat('ru').format(val);

// Ноль — «цена по запросу», как и везде в проекте (useProductPrice.ts).
const priceLabel = (item) => {
  if (!item.price) return 'Цена по запросу';
  return `${item.isFrom ? 'от ' : ''}${formatPrice(item.price)} ₽`;
};
</script>

<style scoped lang="scss">
.relatedModels {
  margin-top: 64px;
  padding-top: 32px;
  border-top: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    margin-top: 40px;
    padding-top: 24px;
  }
}

.relatedModels__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.relatedModels__title {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.25;
  color: #1a1a1a;
  letter-spacing: -0.3px;
  margin: 0;

  @media (max-width: 768px) { font-size: 20px; }
}

.relatedModels__all {
  font-size: 15px;
  color: #0071e3;
  text-decoration: none;
  white-space: nowrap;

  &:hover { text-decoration: underline; }
}

.relatedModels__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  // На телефоне — лента с прокруткой вбок, а не восемь рядов карточек.
  @media (max-width: 640px) {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: 44%;
    gap: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin: 0 -20px;
    padding: 0 20px 4px;
    scroll-padding: 0 20px;

    &::-webkit-scrollbar { display: none; }
  }
}

.relatedModels__item {
  min-width: 0;
  scroll-snap-align: start;
}

.relatedModels__card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  height: 100%;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #e0e0e0;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  }

  &:focus-visible {
    outline: 2px solid #0071e3;
    outline-offset: 2px;
  }
}

.relatedModels__media {
  display: block;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  background-color: #f9f9f9;
  overflow: hidden;
}

.relatedModels__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

// Полное название остаётся в разметке — обрезка только визуальная.
.relatedModels__name {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.35;
  color: #1a1a1a;
  font-weight: 400;
}

.relatedModels__price {
  margin-top: auto;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;

  &--ask {
    font-weight: 400;
    color: #999;
  }
}
</style>
