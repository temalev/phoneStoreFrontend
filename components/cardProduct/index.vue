<template>
  <article class="mainCardProduct">
    <NuxtLink :to="`/${product.slug || product.uuid}`" class="mainCardContainer">
      <div class="media">
        <div v-if="badges.length" class="badges">
          <span
            v-for="badge in badges"
            :key="badge.text"
            class="badge"
            :class="`badge--${badge.kind}`"
            >{{ badge.text }}</span
          >
        </div>
        <img
          class="imgProduct"
          :src="baseImg"
          :alt="`${product.name} — купить в РК-Тек`"
          width="250"
          height="250"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="infoContainer">
        <div class="header">
          <h3 class="productName">{{ product.name }}</h3>
          <div class="priceRow">
            <template v-if="price">
              <span class="price">{{ priceFrmt(price) }}&nbsp;₽</span>
              <span v-if="oldPrice > price" class="oldPrice">
                {{ priceFrmt(oldPrice) }}&nbsp;₽
              </span>
            </template>
            <button v-else type="button" class="askPrice" @click.prevent="openTelegram">
              Уточнить цену
            </button>
          </div>
          <p v-if="product?.description" class="description">
            {{ product?.description }}
          </p>
        </div>
      </div>
    </NuxtLink>
    <div class="optionsContainer">
      <Option
        v-for="(option, idOpt) in product?.options"
        :key="option?.name"
        :option="option"
        :variants="product?.variants"
        :selectedOptions="selectedOptions"
        @selectedOpt="(id) => selectedOpt(id, idOpt)"
      />
    </div>
    <div v-if="price !== 0" class="wrapperButton">
      <AddToCart :product="product" :selected-options="selectedOptions" />
    </div>
  </article>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/stores/api';
import { useCategories } from '~/stores/categories';

const categories = useCategories();
const route = useRoute();

const api = useApi();
const editedPrice = ref(null);

const emit = defineEmits(['selectedProducts']);
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  product: Object,
});

const selectedColor = ref(null);
const selectedOptions = ref([]);
const editedName = ref(null);
const editedDescription = ref(null);
const isLoading = ref(false);
const isSaved = ref(false);
const isPriceDependOnColor = ref(false);

const currentCategory = route.path.split('/').pop();
const uuidCurrentCategory = categories.categories.find(
  (el) => el.link.includes(currentCategory),
)?.uuid;

const openTelegram = () => {
  window.open('https://t.me/rk_tech_support', '_blank');
};
const isColorOpt = (options) => (optionId) => {
  const colorOption = options.find((el) => el.name.toLowerCase().includes('цвет'));
  if (!colorOption) {
    return true;
  }
  if (options.length > 1) {
    return !colorOption.items.some((el) => el.id === optionId);
  }
  return colorOption.items.some((el) => el.id === optionId);
};

const baseImg = computed(() => {
  if (selectedOptions.value.length) {
    // eslint-disable-next-line max-len
    let canditate = null;
    props.product.variants
      // eslint-disable-next-line max-len
      .forEach(({ optionsIds }, idx) => {
        const isContains = optionsIds.every((optionId) => selectedOptions.value.includes(optionId));

        if (isContains) {
          canditate = props.product?.variants[idx];
        }
      });
    return canditate?.optionsInfo?.images?.[0] || props.product?.images?.[0];
  }
  return (
    props.product?.variants?.[0]?.optionsInfo?.images?.[0]
    || props.product?.images?.[0]
  );
});

const hasSelection = computed(() => selectedOptions.value.some(Boolean));

// Цены живут в вариантах: у большинства товаров product.price === 0, и до выбора
// опции карточка показывала «Уточнить цену» при реальных ценах в variants.
// Поэтому без выбора показываем цену самого дешёвого варианта.
const pricedVariants = computed(() => (props.product?.variants ?? []).filter(
  (v) => Number(v?.optionsInfo?.price) > 0,
));

const cheapestVariant = computed(() => pricedVariants.value.reduce(
  (best, v) => (!best || v.optionsInfo.price < best.optionsInfo.price ? v : best),
  null,
));

const price = computed(() => {
  const { variants, options, price: defaultPrice, priceDependOnColor } = props.product;

  if (!variants?.length) return defaultPrice;

  const colorOptionIndex = options?.findIndex((el) => el.name.toLowerCase().includes('цвет')) ?? -1;
  if (!hasSelection.value) {
    return defaultPrice || cheapestVariant.value?.optionsInfo?.price || 0;
  }

  if (priceDependOnColor) {
    // Цена за конкретный вариант (цвет + опция)
    const candidate = variants.find(({ optionsIds }) =>
      selectedOptions.value.every((selectedId, idx) => !selectedId || optionsIds[idx] === selectedId)
    );
    return candidate?.optionsInfo?.price ?? defaultPrice;
  }

  // Цена за опцию без учёта цвета
  const candidate = variants.find(({ optionsIds }) =>
    selectedOptions.value.every((selectedId, idx) => {
      if (idx === colorOptionIndex) return true;
      return !selectedId || optionsIds[idx] === selectedId;
    })
  );
  return candidate?.optionsInfo?.price ?? defaultPrice;
});

const oldPrice = computed(() => {
  const { variants, options, priceDependOnColor } = props.product;

  if (!variants?.length) return props.product.priceOld;

  const colorOptionIndex = options?.findIndex((el) => el.name.toLowerCase().includes('цвет')) ?? -1;
  if (!hasSelection.value) {
    const info = cheapestVariant.value?.optionsInfo;
    return info?.oldPrice > info?.price ? info.oldPrice : props.product.priceOld;
  }

  let candidate;

  if (priceDependOnColor) {
    candidate = variants.find(({ optionsIds }) =>
      selectedOptions.value.every((selectedId, idx) => !selectedId || optionsIds[idx] === selectedId)
    );
  } else {
    candidate = variants.find(({ optionsIds }) =>
      selectedOptions.value.every((selectedId, idx) => {
        if (idx === colorOptionIndex) return true;
        return !selectedId || optionsIds[idx] === selectedId;
      })
    );
  }

  return candidate?.optionsInfo?.oldPrice > candidate?.optionsInfo?.price
    ? candidate.optionsInfo.oldPrice
    : props.product.priceOld;
});

const discountPct = computed(() => {
  if (!price.value || !oldPrice.value || oldPrice.value <= price.value) return 0;
  return Math.round((1 - price.value / oldPrice.value) * 100);
});

const isNew = computed(() => {
  const raw = props.product?.releaseAt || props.product?.createdAt;
  if (!raw) return false;
  const days = (Date.now() - new Date(raw).getTime()) / 86400000;
  return days >= 0 && days <= 30;
});

const badges = computed(() => {
  const list = [];
  if (discountPct.value >= 3) list.push({ kind: 'sale', text: `−${discountPct.value}%` });
  if (isNew.value) list.push({ kind: 'new', text: 'Новинка' });
  return list;
});

const priceFrmt = (val) => (val ? new Intl.NumberFormat('ru').format(val) : null);

const selectedOpt = (id, index) => {
  selectedOptions.value[index] = id;
};

// eslint-disable-next-line no-undef
onMounted(() => {
  isPriceDependOnColor.value = props.product.priceDependOnColor;
});
</script>

<style scoped lang="scss">
.mainCardProduct {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  // flex-basis для страниц с flex-wrap (accessories, other); в grid-родителе
  // (категория) flex игнорируется и работает width/max-width.
  flex: 0 1 330px;
  width: 100%;
  max-width: 360px;
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: #dcdcdc;
    box-shadow: 0 12px 28px -18px rgba(0, 0, 0, 0.35);
    transform: translateY(-2px);
  }

  &:focus-within {
    border-color: #c9c9c9;
  }
}

.mainCardContainer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #0071e3;
    outline-offset: -2px;
    border-radius: 16px;
  }
}

.media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 18px 6px;
  background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
}

.badges {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  z-index: 1;
}

.badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;

  &--sale {
    background: #ffe8e6;
    color: #c2352b;
  }

  &--new {
    background: #eaf1fd;
    color: #0058b8;
  }
}

.imgProduct {
  width: 250px;
  height: 250px;
  max-width: 100%;
  background-color: transparent;
  object-fit: contain;
  transition: transform 0.25s ease;

  .mainCardProduct:hover & {
    transform: scale(1.03);
  }
}

.infoContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px 20px 4px;
  width: 100%;
  box-sizing: border-box;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.productName {
  margin: 0;
  font-size: 17px;
  font-family: -apple-system, Roboto, BlinkMacSystemFont, "Segoe UI", Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 600;
  line-height: 1.3;
  color: #1a1a1a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.priceRow {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  min-height: 26px;
}

.price {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.oldPrice {
  font-size: 14px;
  font-weight: 400;
  color: #a0a0a5;
  text-decoration: line-through;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.askPrice {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  color: #0071e3;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.description {
  margin: 8px 0 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
  color: #6b6b6b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.optionsContainer {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 12px 20px 10px;
}

.wrapperButton {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 8px 20px 20px;
  width: 100%;
  box-sizing: border-box;
  margin-top: auto;
}

@media (prefers-reduced-motion: reduce) {
  .mainCardProduct,
  .imgProduct {
    transition: none;
  }

  .mainCardProduct:hover {
    transform: none;
  }

  .mainCardProduct:hover .imgProduct {
    transform: none;
  }
}
</style>
