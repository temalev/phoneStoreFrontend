<template>
  <div class="order">
    <img
      :src="imageOrder"
      :alt="order.product.name"
      width="56"
      height="56"
      loading="lazy"
      decoding="async"
      class="orderImg"
    />

    <div class="orderBody">
      <div class="orderTop">
        <span class="orderName">{{ order.product.name }}</span>
        <button
          type="button"
          class="orderRemove"
          aria-label="Убрать из корзины"
          @click="deleteOrder(order.product.uuid)"
        />
      </div>

      <span v-if="optionsNames" class="orderOptions">{{ optionsNames }}</span>

      <div class="orderBottom">
        <AddToCart
          :product="order.product"
          :selected-options="order.options"
          size="sm"
          :block="false"
        />
        <span class="orderPrice">{{ orderPrice }} <strong>₽</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { computed } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const props = defineProps({
  order: Object,
});

// Вариант, который соответствует выбранным опциям (как и раньше — последний подходящий)
const currentVariant = computed(() => {
  if (!props.order.product.variants?.length) return null;

  const matched = props.order.product.variants.filter(
    ({ optionsIds }) => optionsIds.every((optionId) => props.order.options.includes(optionId)),
  );

  return matched[matched.length - 1] || null;
});

const imageOrder = computed(() => currentVariant.value?.optionsInfo?.images?.[0]
  || props.order.product.images?.[0]);

const orderPrice = computed(() => {
  let basePrice;

  if (props.order.product.variants?.length) {
    basePrice = currentVariant.value ? currentVariant.value.optionsInfo.price : 0;
  } else {
    basePrice = props.order.product.price;
  }

  return new Intl.NumberFormat('ru').format(basePrice * (props.order.quantity || 1));
});

const optionsNames = computed(() => (props.order.product.options || [])
  .map(({ items }) => items.find(({ id }) => props.order.options.includes(id))?.name)
  .filter(Boolean)
  .join(' · '));

const deleteOrder = (uuid) => {
  const index = api.orders.findIndex((el) => {
    // Проверяем UUID товара
    if (el.product.uuid !== uuid) {
      return false;
    }

    // Если у товара есть варианты, проверяем также выбранные опции
    if (el.product.variants && el.product.variants.length > 0) {
      return el.options.length === props.order.options.length
        && el.options.every((optionId) => props.order.options.includes(optionId));
    }

    // Если вариантов нет, просто проверяем UUID
    return true;
  });

  if (index !== -1) {
    api.orders.splice(index, 1);
    localStorage.setItem('orders', JSON.stringify(api.orders));
    api.getTotalCost();
  }
};
</script>
<style scoped lang="scss">
.order {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f2f2f2;

  &:last-child {
    border-bottom: none;
  }

  &:hover .orderRemove {
    opacity: 0.7;
  }
}

.orderImg {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  padding: 4px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  background-color: #fafafa;
  object-fit: contain;
  box-sizing: border-box;
}

.orderBody {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.orderTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.orderName {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.3;
  color: #2c2c2c;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.orderRemove {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent url(/icons/close.svg) center / 13px 13px no-repeat;
  opacity: 0.3;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    opacity: 1 !important;
    background-color: #f4f4f4;
  }
}

.orderOptions {
  font-size: 13px;
  font-weight: 300;
  color: #9a9a9a;
  line-height: 1.3;
}

.orderBottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 2px;
}

.orderPrice {
  font-size: 15px;
  font-weight: 500;
  color: #2c2c2c;
  white-space: nowrap;
}
</style>
