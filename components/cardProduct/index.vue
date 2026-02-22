<template>
  <article class="mainCardProduct">
    <div class="mainCardContainer">
      <img class="imgProduct" :src="baseImg" :alt="product.name" />
      <div class="infoContainer">
        <div class="header">
          <h3 class="productName">{{ product.name }}</h3>
          <div class="priceRow">
            <span v-if="oldPrice > price && price !== 0" class="oldPrice"
              >{{ priceFrmt(oldPrice) }} <strong>₽</strong>
            </span>
            <a v-if="price === 0" href="https://t.me/Rktech_shop" style="font-weight: 300"
              >Уточнить цену</a
            >
            <span
              v-if="price"
              class="price"
              :style="{ color: oldPrice > price ? 'red' : '' }"
              >{{ priceFrmt(price) }} <strong>₽</strong>
            </span>
          </div>
          <p v-if="product?.description" class="description">
            {{ product?.description }}
          </p>
        </div>
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
      </div>
    </div>
    <div v-if="price !== 0" class="wrapperButton">
      <CustomButton
        v-if="!isInCart"
        @click="sendToShopBag"
        :name="'В корзину'"
      />
      <div v-else class="quantityControls">
        <CustomButton
          @click="decreaseQuantity"
          :name="'-'"
          :type="'minus'"
          style="width: 40px; height: 40px; border-radius: 50%;"
        />
        <span class="quantity">{{ cartQuantity }}</span>
        <CustomButton
          @click="increaseQuantity"
          :name="'+'"
          :type="'plus'"
          style="width: 40px; height: 40px; border-radius: 50%;"
        />
      </div>
    </div>
  </article>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, computed, watch } from 'vue';
import { useApi } from '~/stores/api';
import { useCategories } from '~/stores/categories';

const categories = useCategories();

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

const currentCategory = window.location.pathname.split('/').pop();
const uuidCurrentCategory = categories.categories.find(
  (el) => el.link.includes(currentCategory),
)?.uuid;

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

const isInCart = computed(() => api.orders.some((order) => {
  if (order.product.uuid !== props.product.uuid) {
    return false;
  }

  if (props.product.variants && props.product.variants.length > 0) {
    return order.options.length === selectedOptions.value.length
      && order.options.every((optionId) => selectedOptions.value.includes(optionId));
  }

  return true;
}));

const cartQuantity = computed(() => {
  const cartItem = api.orders.find((order) => {
    if (order.product.uuid !== props.product.uuid) {
      return false;
    }

    if (props.product.variants && props.product.variants.length > 0) {
      return order.options.length === selectedOptions.value.length
        && order.options.every((optionId) => selectedOptions.value.includes(optionId));
    }

    return true;
  });

  return cartItem ? (cartItem.quantity || 1) : 1;
});

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

const price = computed(() => {
  if (!props.product.priceDependOnColor) {
    return props.product.price;
  }

  if (selectedOptions.value.length) {
    // eslint-disable-next-line max-len
    let canditate = null;
    const { variants, options } = props.product;

    variants
      // eslint-disable-next-line max-len
      .forEach(({ optionsIds }, idx) => {
        const isContains = optionsIds.every((optionId) => selectedOptions.value.includes(optionId));

        if (isContains) {
          canditate = props.product?.variants[idx];
        }
      });
    return canditate?.optionsInfo?.price || props.product?.price;
  }
  return props.product.price;
});

const oldPrice = computed(() => {
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
    return canditate?.optionsInfo?.oldPrice > canditate?.optionsInfo?.price
      ? canditate.optionsInfo?.oldPrice
      : null;
  }
  return props.product.priceOld;
});

const priceFrmt = (val) => (val ? new Intl.NumberFormat('ru').format(val) : null);

const selectedOpt = (id, index) => {
  selectedOptions.value[index] = id;
};

const sendToShopBag = () => {
  // TODO хранить uuid продукта, чтобы проверять актуальность данных, в первую очередь цены
  const selectedProduct = {
    product: { ...props.product },
    options: [...selectedOptions.value],
    quantity: 1,
  };
  api.orders.push(selectedProduct);
  // localStorage.setItem('orders', JSON.stringify(api.orders));
};

const increaseQuantity = () => {
  const cartItemIndex = api.orders.findIndex((order) => {
    if (order.product.uuid !== props.product.uuid) {
      return false;
    }

    if (props.product.variants && props.product.variants.length > 0) {
      return order.options.length === selectedOptions.value.length
        && order.options.every((optionId) => selectedOptions.value.includes(optionId));
    }

    return true;
  });

  if (cartItemIndex !== -1) {
    api.orders[cartItemIndex].quantity = (api.orders[cartItemIndex].quantity || 1) + 1;
  }
};

const decreaseQuantity = () => {
  const cartItemIndex = api.orders.findIndex((order) => {
    if (order.product.uuid !== props.product.uuid) {
      return false;
    }

    if (props.product.variants && props.product.variants.length > 0) {
      return order.options.length === selectedOptions.value.length
        && order.options.every((optionId) => selectedOptions.value.includes(optionId));
    }

    return true;
  });

  if (cartItemIndex !== -1) {
    const currentQuantity = api.orders[cartItemIndex].quantity || 1;
    if (currentQuantity > 1) {
      api.orders[cartItemIndex].quantity = currentQuantity - 1;
    } else {
      // Удаляем товар из корзины если количество становится 0
      api.orders.splice(cartItemIndex, 1);
    }
  }
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
  align-items: center;
  justify-content: space-between;
  width: 330px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  border-radius: 12px;
}

.wrapperButton {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 30px 20px;
  width: 100%;
  box-sizing: border-box;
}

.quantityControls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
}

.quantity {
  font-size: 18px;
  font-weight: 500;
  min-width: 30px;
  text-align: center;
}

.mainCardContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.imgProduct {
  width: 250px;
  height: 250px;
  background-color: #fff;
  object-fit: contain;
}

.infoContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.productName {
  font-size: 20px;
  font-family: -apple-system, Roboto, BlinkMacSystemFont, "Segoe UI", Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-weight: 400;
}

.priceRow {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.oldPrice {
  font-family: -apple-system, Roboto, BlinkMacSystemFont, "Segoe UI", Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #373737;
  text-decoration: line-through;
}

.price {
  font-family: -apple-system, Roboto, BlinkMacSystemFont, "Segoe UI", Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #373737;
}

.description {
  padding-top: 8px;
  font-weight: 300;
  line-height: 1.3;
}

.optionsContainer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.icoDelete {
  background-image: url(/icons/delete.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid #2c2c2c;
  border-radius: 8px;
  opacity: 0.9;
  cursor: pointer;
}
</style>
