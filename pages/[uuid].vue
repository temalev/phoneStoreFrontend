<template>
  <div class="productPage">
    <div v-if="pending" class="productPage__skeleton">
      <div class="skeleton-img"></div>
      <div class="skeleton-info">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--price"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
        <div class="skeleton-line skeleton-line--btn"></div>
      </div>
    </div>

    <div v-else-if="product" class="productPage__content">
      <div class="productPage__gallery">
        <img
          class="productPage__img"
          :src="currentImage"
          :alt="`${displayName} — купить в РК-Тек`"
          width="560"
          height="560"
        />
      </div>

      <div class="productPage__info">
        <nav class="productPage__breadcrumb" aria-label="Хлебные крошки">
          <NuxtLink to="/">Главная</NuxtLink>
          <template v-if="breadcrumbMiddle">
            <span>/</span>
            <NuxtLink :to="breadcrumbMiddle.to">{{ breadcrumbMiddle.label }}</NuxtLink>
          </template>
          <template v-if="breadcrumbCategory">
            <span>/</span>
            <NuxtLink :to="breadcrumbCategory.to">{{ breadcrumbCategory.label }}</NuxtLink>
          </template>
          <span>/</span>
          <span>{{ displayName }}</span>
        </nav>

        <h1 class="productPage__name">{{ displayName }}</h1>

        <div class="productPage__priceRow">
          <span v-if="currentOldPrice" class="productPage__oldPrice">
            {{ formatPrice(currentOldPrice) }} <strong>₽</strong>
          </span>
          <a
            v-if="currentPrice === 0"
            href="https://t.me/rk_tech_support"
            class="productPage__priceLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            Уточнить цену в Telegram
          </a>
          <span v-else class="productPage__price" :class="{ 'productPage__price--discount': currentOldPrice }">
            {{ formatPrice(currentPrice) }} <strong>₽</strong>
          </span>
          <span v-if="currentOldPrice" class="productPage__badge">
            -{{ discountPercent }}%
          </span>
        </div>

        <p v-if="product.description" class="productPage__description">
          {{ product.description }}
        </p>

        <div v-if="product.options?.length" class="productPage__options">
          <Option
            v-for="(option, idOpt) in product.options"
            :key="option.name"
            :option="option"
            :option-index="idOpt"
            @selectedOpt="(id) => selectOption(id, idOpt)"
          />
        </div>

        <div class="productPage__actions">
          <template v-if="currentPrice !== 0">
            <button
              v-if="!isInCart"
              class="productPage__buyBtn"
              @click="addToCart"
            >
              В корзину
            </button>
            <div v-else class="productPage__cartRow">
              <div class="productPage__qtyControls">
                <button class="productPage__qtyBtn" @click="decreaseQty">−</button>
                <span class="productPage__qty">{{ cartQty }}</span>
                <button class="productPage__qtyBtn" @click="increaseQty">+</button>
              </div>
              <button class="productPage__openCartBtn" @click="api.isCartOpen = true">
                В корзине →
              </button>
            </div>
          </template>
          <a
            href="https://t.me/rk_tech_support"
            class="productPage__telegramBtn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Задать вопрос в Telegram
          </a>
        </div>

        <ul class="productPage__features">
          <li>
            <span class="productPage__featureIcon">✓</span>
            Оригинальный товар
          </li>
          <li>
            <span class="productPage__featureIcon">✓</span>
            Гарантия 1 год
          </li>
          <li>
            <span class="productPage__featureIcon">✓</span>
            Доставка по Москве и Рязани
          </li>
          <li>
            <span class="productPage__featureIcon">✓</span>
            Проверка при получении
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="productPage__error">
      <p>Товар не найден</p>
      <NuxtLink to="/" class="productPage__backLink">На главную</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';
import { useCategories } from '~/stores/categories';
import { useRoute } from 'vue-router';

const route = useRoute();
const slug = route.params.uuid; // в URL теперь slug товара (напр. airpods-4)
const config = useRuntimeConfig();
const api = useApi();
const categories = useCategories();

const apiBase = config.public.URL;

const { data: product, pending, error: productError } = await useAsyncData(
  `product-${slug}`,
  () => $fetch(`${apiBase}/api/v1/product/${slug}`),
);

if (import.meta.server && productError.value) {
  // eslint-disable-next-line no-console
  console.error(`[${slug}] API error:`, productError.value);
}

// --- Хлебные крошки ---
// Разворачиваем все категории включая вложенные (аксессуары)
const allCategories = [
  ...categories.categories,
  ...categories.categories.flatMap((c) => c.categories || []),
];

const accessoriesCat = categories.categories.find((c) => c.link === '/accessories');
const productCategory = allCategories.find(
  (c) => c.uuid === product.value?.category?.uuid,
);

let breadcrumbMiddle = null;
let breadcrumbCategory = null;

if (productCategory) {
  const isAccessorySub = accessoriesCat?.categories?.some(
    (c) => c.uuid === productCategory.uuid,
  );

  if (isAccessorySub) {
    breadcrumbMiddle = { label: 'Аксессуары', to: '/accessories' };
    breadcrumbCategory = { label: productCategory.name, to: productCategory.link };
  } else {
    breadcrumbCategory = { label: productCategory.name, to: productCategory.link };
  }
} else if (product.value?.category?.name) {
  // Неизвестная категория (суббренд «Другое»)
  const catName = product.value.category.name;
  breadcrumbMiddle = { label: 'Другое', to: '/other' };
  breadcrumbCategory = { label: catName, to: `/other/${catName.toLowerCase()}` };
}

// --- Опции ---
const selectedOptions = ref([]);

const getDefaultOptions = () => {
  if (!product.value?.options) return;
  product.value.options.forEach((option, idx) => {
    const defaultVariant = product.value.variants?.find((v) => v.isDefault);
    if (defaultVariant) {
      const matchingId = option.items.find((item) =>
        defaultVariant.optionsIds.includes(item.id),
      );
      if (matchingId) selectedOptions.value[idx] = matchingId.id;
    } else if (option.items[0]) {
      selectedOptions.value[idx] = option.items[0].id;
    }
  });
};

getDefaultOptions();

const selectOption = (id, index) => {
  selectedOptions.value[index] = id;
};

/** Название: name + выбранные опции (например «AirPods 4 — С шумоподавлением») */
const displayName = computed(() => {
  const name = product.value?.name || '';
  if (!product.value?.options?.length || !selectedOptions.value.length) return name;
  const parts = product.value.options
    .map((option, idx) => {
      const selectedId = selectedOptions.value[idx];
      if (selectedId == null) return null;
      const item = option.items?.find((i) => i.id === selectedId);
      return item?.name ?? item?.value ?? null;
    })
    .filter(Boolean);
  if (!parts.length) return name;
  return `${name} — ${parts.join(' ')}`;
});

const currentVariant = computed(() => {
  if (!product.value?.variants?.length) return null;
  if (!selectedOptions.value.length) {
    return product.value.variants.find((v) => v.isDefault) || product.value.variants[0];
  }
  return product.value.variants.find(({ optionsIds }) =>
    optionsIds.every((optId) => selectedOptions.value.includes(optId)),
  ) || product.value.variants[0];
});

const currentImage = computed(() =>
  currentVariant.value?.optionsInfo?.images?.[0]
  || product.value?.variants?.[0]?.optionsInfo?.images?.[0]
  || product.value?.images?.[0]
  || '/images/placeholder.webp');

const currentPrice = computed(() => {
  const variantPrice = currentVariant.value?.optionsInfo?.price;
  if (variantPrice) return variantPrice;
  return product.value?.price ?? 0;
});

const currentOldPrice = computed(() => {
  const oldP = currentVariant.value?.optionsInfo?.oldPrice;
  const newP = currentVariant.value?.optionsInfo?.price;
  if (oldP && newP && oldP > newP) return oldP;
  if (product.value?.priceOld && product.value.priceOld > currentPrice.value) return product.value.priceOld;
  return null;
});

const discountPercent = computed(() => {
  if (!currentOldPrice.value || !currentPrice.value) return 0;
  return Math.round((1 - currentPrice.value / currentOldPrice.value) * 100);
});

const formatPrice = (val) => (val ? new Intl.NumberFormat('ru').format(val) : '');

const isInCart = computed(() => api.orders.some((order) => {
  if (order.product.uuid !== product.value?.uuid) return false;
  if (product.value?.variants?.length) {
    return order.options.length === selectedOptions.value.length
      && order.options.every((id) => selectedOptions.value.includes(id));
  }
  return true;
}));

const cartQty = computed(() => {
  const item = api.orders.find((order) => {
    if (order.product.uuid !== product.value?.uuid) return false;
    if (product.value?.variants?.length) {
      return order.options.length === selectedOptions.value.length
        && order.options.every((id) => selectedOptions.value.includes(id));
    }
    return true;
  });
  return item?.quantity || 1;
});

const addToCart = () => {
  api.orders.push({
    product: { ...product.value },
    options: [...selectedOptions.value],
    quantity: 1,
  });
};

const increaseQty = () => {
  const idx = api.orders.findIndex((order) => {
    if (order.product.uuid !== product.value?.uuid) return false;
    if (product.value?.variants?.length) {
      return order.options.length === selectedOptions.value.length
        && order.options.every((id) => selectedOptions.value.includes(id));
    }
    return true;
  });
  if (idx !== -1) api.orders[idx].quantity = (api.orders[idx].quantity || 1) + 1;
};

const decreaseQty = () => {
  const idx = api.orders.findIndex((order) => {
    if (order.product.uuid !== product.value?.uuid) return false;
    if (product.value?.variants?.length) {
      return order.options.length === selectedOptions.value.length
        && order.options.every((id) => selectedOptions.value.includes(id));
    }
    return true;
  });
  if (idx !== -1) {
    const qty = api.orders[idx].quantity || 1;
    if (qty > 1) api.orders[idx].quantity = qty - 1;
    else api.orders.splice(idx, 1);
  }
};

// --- SEO ---
const pageUrl = `https://рк-тек.рф/${slug}`;
const productDescription = product.value?.description || '';
const categoryName = product.value?.category?.name || '';
const siteUrl = 'https://рк-тек.рф';
const ogImageRaw = product.value?.variants?.[0]?.optionsInfo?.images?.[0]
  || product.value?.images?.[0]
  || `${siteUrl}/images/mainPageBackground.webp`;
const ogImage = ogImageRaw.startsWith('http') ? ogImageRaw : `${siteUrl}${ogImageRaw}`;

const minPrice = product.value?.variants?.length
  ? Math.min(...product.value.variants.map((v) => v.optionsInfo?.price || 0).filter(Boolean))
  : product.value?.price || 0;

const priceStr = minPrice ? `— цена ${formatPrice(minPrice)} ₽ ` : '';
const pageTitle = computed(() => `Купить ${displayName.value} ${priceStr}в Москве и Рязани | РК-Тек`);
const pageDescription = computed(() => `Купить ${displayName.value} в Москве и Рязани с доставкой.${productDescription ? ` ${productDescription}` : ''} Оригинал, гарантия 1 год, низкие цены.`);

const keywords = computed(() => [
  `купить ${displayName.value.toLowerCase()}`,
  `${displayName.value.toLowerCase()} цена`,
  `${displayName.value.toLowerCase()} москва`,
  `${displayName.value.toLowerCase()} рязань`,
  `${displayName.value.toLowerCase()} купить`,
  categoryName ? `купить ${categoryName.toLowerCase()} москва` : '',
].filter(Boolean).join(', '));

const brandMap = {
  iPhone: 'Apple',
  iPad: 'Apple',
  Mac: 'Apple',
  Watch: 'Apple',
  AirPods: 'Apple',
  Samsung: 'Samsung',
  Dyson: 'Dyson',
  'PlayStation 5': 'Sony',
};
const brandName = brandMap[categoryName] || categoryName || 'РК-Тек';

const allImages = product.value?.variants
  ?.map((v) => v.optionsInfo?.images?.[0])
  .filter(Boolean) || [];

const offers = product.value?.variants?.length
  ? product.value.variants.map((v) => ({
    '@type': 'Offer',
    priceCurrency: 'RUB',
    price: v.optionsInfo?.price || 0,
    availability: v.optionsInfo?.price
      ? 'https://schema.org/InStock'
      : 'https://schema.org/PreOrder',
    seller: { '@type': 'Organization', name: 'РК-Тек' },
    url: pageUrl,
  }))
  : [{
    '@type': 'Offer',
    priceCurrency: 'RUB',
    price: product.value?.price || 0,
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'Organization', name: 'РК-Тек' },
    url: pageUrl,
  }];

useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: pageDescription },
    { name: 'keywords', content: keywords },
    { property: 'og:type', content: 'product' },
    { property: 'og:locale', content: 'ru_RU' },
    { property: 'og:title', content: computed(() => `Купить ${displayName.value} — РК-Тек`) },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:site_name', content: 'РК-Тек' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: computed(() => `Купить ${displayName.value} — РК-Тек`) },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: ogImage },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Product',
            name: displayName.value,
            description: productDescription,
            image: allImages,
            brand: { '@type': 'Brand', name: brandName },
            category: categoryName,
            offers,
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Главная',
                item: siteUrl,
              },
              ...(breadcrumbMiddle ? [{
                '@type': 'ListItem',
                position: 2,
                // eslint-disable-next-line max-len
                name: breadcrumbMiddle.label,
                item: `${siteUrl}${breadcrumbMiddle.to}`,
              }] : []),
              ...(breadcrumbCategory ? [{
                '@type': 'ListItem',
                position: breadcrumbMiddle ? 3 : 2,
                // eslint-disable-next-line max-len
                name: breadcrumbCategory.label,
                item: `${siteUrl}${breadcrumbCategory.to}`,
              }] : []),
              {
                '@type': 'ListItem',
                position: (breadcrumbMiddle ? 3 : 2) + (breadcrumbCategory ? 1 : 0),
                name: displayName.value,
                item: pageUrl,
              },
            ],
          },
        ],
      })),
    },
  ],
});
</script>

<style scoped lang="scss">
.productPage {
  max-width: 1100px;
  margin: 90px auto 60px;
  padding: 0 20px;

  @media (min-width: 851px) {
    margin-top: 120px;
  }
}

.productPage__content {
  display: flex;
  gap: 50px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
}

.productPage__gallery {
  flex: 0 0 auto;
  width: 480px;
  position: sticky;
  top: 100px;

  @media (max-width: 900px) { width: 340px; }
  @media (max-width: 768px) { width: 100%; position: static; }
}

.productPage__img {
  width: 100%;
  height: 480px;
  object-fit: contain;
  border-radius: 20px;
  background-color: #f9f9f9;

  @media (max-width: 900px) { height: 340px; }
  @media (max-width: 768px) { height: 300px; }
}

.productPage__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.productPage__breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
  flex-wrap: wrap;

  a {
    color: #999;
    text-decoration: none;
    transition: color 0.2s;
    &:hover { color: #2c2c2c; }
  }
}

.productPage__name {
  font-size: 32px;
  font-weight: 500;
  line-height: 1.2;
  color: #1a1a1a;
  letter-spacing: -0.5px;

  @media (max-width: 768px) { font-size: 26px; }
}

.productPage__priceRow {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.productPage__oldPrice {
  font-size: 18px;
  font-weight: 300;
  color: #aaa;
  text-decoration: line-through;
}

.productPage__price {
  font-size: 28px;
  font-weight: 500;
  color: #1a1a1a;

  &--discount { color: #e53935; }
}

.productPage__priceLink {
  font-size: 18px;
  font-weight: 400;
  color: #0071e3;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

.productPage__badge {
  background-color: #e53935;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
}

.productPage__description {
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  font-weight: 300;
}

.productPage__options {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.productPage__actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
}

.productPage__buyBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 32px;
  background: #2c2c2c;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, transform 0.1s;

  &:hover { background: #1a1a1a; }
  &:active { transform: scale(0.98); }
}

.productPage__cartRow {
  display: inline-flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    max-width: 100%;

    .productPage__openCartBtn {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.productPage__qtyControls {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  background: #f5f5f5;
  border-radius: 14px;
  height: 52px;
  padding: 0 20px;
}

.productPage__qtyBtn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #d0d0d0;
  background: #fff;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;

  &:hover { border-color: #2c2c2c; }
}

.productPage__qty {
  font-size: 18px;
  font-weight: 500;
  min-width: 24px;
  text-align: center;
}

.productPage__openCartBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 32px;
  border-radius: 14px;
  border: none;
  background: #2c2c2c;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, transform 0.1s;

  &:hover { background: #1a1a1a; }
  &:active { transform: scale(0.98); }
}

.productPage__telegramBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  height: 52px;
  border: 1.5px solid #d0d0d0;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 400;
  color: #2c2c2c;
  text-decoration: none;
  white-space: nowrap;
  transition: border-color 0.2s;

  &:hover { border-color: #2c2c2c; }
}

.productPage__features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.productPage__features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 300;
}

.productPage__featureIcon {
  color: #34c759;
  font-size: 16px;
  font-weight: 600;
}

.productPage__skeleton {
  display: flex;
  gap: 50px;

  @media (max-width: 768px) { flex-direction: column; }
}

.skeleton-img {
  width: 480px;
  height: 480px;
  border-radius: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;

  @media (max-width: 768px) { width: 100%; height: 300px; }
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 10px;
}

.skeleton-line {
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  &--title { height: 40px; width: 60%; }
  &--price { height: 34px; width: 40%; }
  &--desc { height: 16px; width: 100%; }
  &--btn { height: 52px; width: 70%; border-radius: 14px; margin-top: 10px; }
}

.productPage__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 60px 0;
  color: #555;
}

.productPage__backLink {
  color: #0071e3;
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
