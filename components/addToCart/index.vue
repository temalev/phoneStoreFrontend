<template>
  <div class="addToCart" :class="[`addToCart--${size}`, { 'addToCart--inline': !block }]">
    <Transition name="swap" mode="out-in">
      <button
        v-if="!isInCart"
        key="add"
        type="button"
        class="addBtn"
        @click="add"
      >
        <span class="addBtn__shine" aria-hidden="true" />
        <svg class="addBtn__ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5.5 8h13l-1 11.2A3 3 0 0 1 14.5 22h-5a3 3 0 0 1-3-2.8L5.5 8Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path
            d="M9 10V7a3 3 0 0 1 6 0v3"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
        <span>В корзину</span>
      </button>

      <div v-else key="stepper" class="stepper">
        <button
          type="button"
          class="stepper__btn"
          :class="{ 'stepper__btn--remove': quantity === 1 }"
          :aria-label="quantity === 1 ? 'Убрать из корзины' : 'Уменьшить количество'"
          @click="decrease"
        >
          <svg v-if="quantity === 1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 7h14M10 7V5.8A1.8 1.8 0 0 1 11.8 4h.4A1.8 1.8 0 0 1 14 5.8V7
                m3 0-.7 11.1A2 2 0 0 1 14.3 20H9.7a2 2 0 0 1-2-1.9L7 7"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>

        <span class="stepper__value">
          <Transition :name="direction > 0 ? 'countUp' : 'countDown'" mode="out-in">
            <span :key="quantity" class="stepper__number">{{ quantity }}</span>
          </Transition>
          <span class="sr-only" aria-live="polite">В корзине {{ quantity }} шт.</span>
        </span>

        <button
          type="button"
          class="stepper__btn"
          aria-label="Увеличить количество"
          @click="increase"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 6v12M6 12h12"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, computed } from 'vue';
import { useApi } from '~/stores/api';

const api = useApi();

const props = defineProps({
  product: Object,
  selectedOptions: {
    type: Array,
    default: () => [],
  },
  // md — карточка каталога, lg — страница товара
  size: {
    type: String,
    default: 'md',
  },
  // false — ширина по содержимому, чтобы встать в ряд с другими кнопками
  block: {
    type: Boolean,
    default: true,
  },
});

// Направление последнего изменения — от него зависит, куда «перелистывается» цифра
const direction = ref(1);

const isSameItem = (order) => {
  if (order.product.uuid !== props.product.uuid) {
    return false;
  }

  if (props.product.variants && props.product.variants.length > 0) {
    return order.options.length === props.selectedOptions.length
      && order.options.every((optionId) => props.selectedOptions.includes(optionId));
  }

  return true;
};

const cartItem = computed(() => api.orders.find(isSameItem));
const isInCart = computed(() => !!cartItem.value);
const quantity = computed(() => cartItem.value?.quantity || 1);

const add = () => {
  direction.value = 1;
  api.orders.push({
    product: { ...props.product },
    options: [...props.selectedOptions],
    quantity: 1,
  });
};

const increase = () => {
  const idx = api.orders.findIndex(isSameItem);
  if (idx !== -1) {
    direction.value = 1;
    api.orders[idx].quantity = (api.orders[idx].quantity || 1) + 1;
  }
};

const decrease = () => {
  const idx = api.orders.findIndex(isSameItem);
  if (idx === -1) return;

  direction.value = -1;
  const current = api.orders[idx].quantity || 1;

  if (current > 1) {
    api.orders[idx].quantity = current - 1;
  } else {
    // На единице минус превращается в корзину — убираем товар целиком
    api.orders.splice(idx, 1);
  }
};
</script>

<style scoped lang="scss">
.addToCart {
  width: 100%;
}

.addToCart--inline {
  width: auto;

  .addBtn {
    width: auto;
    padding: 0 32px;
  }

  .stepper {
    width: auto;
    gap: 18px;
    padding: 0 8px;
  }

  .stepper__value {
    min-width: 34px;
  }
}

.addToCart--lg {
  .addBtn,
  .stepper {
    height: 52px;
  }

  .stepper__btn {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .stepper__value {
    font-size: 18px;
  }
}

.addBtn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 46px;
  padding: 0 20px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(180deg, #3a3a3a 0%, #2c2c2c 55%, #232323 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(44, 44, 44, 0.18);
  transition: box-shadow 0.2s, transform 0.15s;

  &:hover {
    box-shadow: 0 8px 20px rgba(44, 44, 44, 0.28);
    transform: translateY(-1px);

    .addBtn__ico {
      transform: translateY(-1px) rotate(-6deg);
    }

    .addBtn__shine {
      transform: translateX(180%) skewX(-18deg);
    }
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 6px rgba(44, 44, 44, 0.24);
  }
}

.addBtn__shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 45%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.22) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateX(-160%) skewX(-18deg);
  transition: transform 0.6s ease;
  pointer-events: none;
}

.addBtn__ico {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: 46px;
  padding: 4px;
  border: 1.5px solid #e8e8e8;
  border-radius: 14px;
  background-color: #fff;
  box-sizing: border-box;
}

.stepper__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  padding: 0;
  border: none;
  border-radius: 10px;
  background-color: #f5f5f5;
  color: #2c2c2c;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, transform 0.12s;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background-color: #ececec;
  }

  &:active {
    transform: scale(0.92);
  }

  &--remove:hover {
    background-color: #fdecec;
    color: #d33a3a;
  }
}

.stepper__value {
  position: relative;
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  overflow: hidden;
}

.stepper__number {
  display: inline-block;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.swap-enter-from {
  opacity: 0;
  transform: scale(0.94);
}

.swap-leave-to {
  opacity: 0;
  transform: scale(0.94);
}

.countUp-enter-active,
.countUp-leave-active,
.countDown-enter-active,
.countDown-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.countUp-enter-from {
  opacity: 0;
  transform: translateY(90%);
}

.countUp-leave-to {
  opacity: 0;
  transform: translateY(-90%);
}

.countDown-enter-from {
  opacity: 0;
  transform: translateY(-90%);
}

.countDown-leave-to {
  opacity: 0;
  transform: translateY(90%);
}

@media (prefers-reduced-motion: reduce) {
  .addBtn,
  .addBtn__ico,
  .addBtn__shine,
  .stepper__btn,
  .swap-enter-active,
  .swap-leave-active,
  .countUp-enter-active,
  .countUp-leave-active,
  .countDown-enter-active,
  .countDown-leave-active {
    transition: none;
  }
}
</style>
