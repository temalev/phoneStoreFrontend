<template>
  <div class="mainCardProduct">
    <div class="mainCardContainer">
      <img class="imgProduct" :src="baseImg" alt="" />
      <div class="infoContainer">
        <div class="header">
          <h3 v-if="!api.isAuth" class="productName">{{ product.name }}</h3>
          <CustomInput
            v-if="api.isAuth"
            :value="product.name"
            type="text"
            @inputValue="(val) => (editedName = val)"
          />
          <span v-if="!api.isAuth" class="price">{{ priceFrmt }} <strong>₽</strong> </span>
          <!-- <p class="description">{{ product?.description }}</p> -->
          <CustomInput
            v-if="api.isAuth"
            :value="price"
            type="number"
            @inputValue="(val) => (editedPrice = val)"
          />
        </div>
        <div class="optionsContainer">
          <Option
            v-for="(option, idOpt) in product.options"
            :key="option.name"
            :option="option"
            @selectedOpt="(id) => selectedOpt(id, idOpt)"
          />
        </div>
      </div>
    </div>
    <div class="wrapperButton">
      <CustomButton v-if="!api.isAuth" @click="sendToShopBag" :name="'В корзину'" />
      <div class="icoDelete" @click="onDeleteProduct"></div>
      <CustomButton v-if="api.isAuth" @click="onSaveProductData" :name="'Сохранить'" />
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ref, computed } from 'vue';
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

const baseImg = computed(() => {
  if (selectedOptions.value.length) {
    // eslint-disable-next-line max-len
    let canditate = null;
    props.product.variants
      // eslint-disable-next-line max-len
      .forEach(({ optionsIds }, idx) => {
        const isContains = optionsIds.every((optionId) => selectedOptions.value.includes(optionId));

        if (isContains) {
          canditate = props.product.variants[idx];
        }
      });
    return canditate.optionsInfo.images[0] || props.product.images[0];
  }
  return props.product.variants[0].optionsInfo?.images[0] || props.product.images[0];
});

const price = computed(() => {
  if (selectedOptions.value.length) {
    // eslint-disable-next-line max-len
    let canditate = null;
    props.product.variants
      // eslint-disable-next-line max-len
      .forEach(({ optionsIds }, idx) => {
        const isContains = optionsIds.every((optionId) => selectedOptions.value.includes(optionId));

        if (isContains) {
          canditate = props.product.variants[idx];
        }
      });
    return canditate.optionsInfo.price;
  }
  return props.product.price;
});

const priceFrmt = computed(() => new Intl.NumberFormat('ru').format(price.value));

const selectedOpt = (id, index) => {
  selectedOptions.value[index] = id;
};

const sendToShopBag = () => {
  // TODO хранить uuid продукта, чтобы проверять актуальность данных, в первую очередь цены
  const selectedProduct = { product: props.product, options: selectedOptions.value };
  api.orders.push(selectedProduct);
  localStorage.setItem('orders', JSON.stringify(api.orders));
};

const isColorOpt = (options) => (optionId) => {
  const colorOption = options.find((el) => el.name.toLowerCase().includes('цвет'));
  if (!colorOption) {
    return true;
  }
  return !colorOption.items.some((el) => el.id === optionId);
};

const onSaveProductData = () => {
  const { variants, options } = props.product;
  const notColorOptions = selectedOptions.value.filter(isColorOpt(options));

  variants.forEach(({ optionsIds }, idx) => {
    const isCandidate = notColorOptions.every((id) => optionsIds.includes(id));

    if (isCandidate) {
      variants[idx].optionsInfo.oldPrice = variants[idx].optionsInfo.price;
      variants[idx].optionsInfo.price = editedPrice.value || variants[idx].optionsInfo.price;
    }
  });

  const updatedProductData = { name: editedName.value || props.product.name, variants };

  api.updateProduct(props.product.uuid, updatedProductData);
};

const onDeleteProduct = () => {
  api.deleteProduct(props.product.uuid);
  const currentCategory = window.location.href.split('/').at(-1);
  const uuidCurrentCategory = categories.categories.find((el) => el.link === currentCategory)?.uuid;
  if (uuidCurrentCategory) {
    api.getProducts(uuidCurrentCategory);
  }
};

// eslint-disable-next-line no-undef
onMounted(() => {});
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
  background-color: #eee;
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
  font-family: -apple-system, Roboto, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
}

.price {
  font-family: -apple-system, Roboto, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: #373737;
}

.optionsContainer {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.icoDelete {
  background-image: url(~/public/icons/delete.svg);
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
